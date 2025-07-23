import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [formKey, setFormKey] = useState(Date.now());

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/diary', {
        headers: { 'Accept': 'application/json' }
      });
      console.log('Fetched entries:', response.data);
      const sortedEntries = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setEntries(sortedEntries);
    } catch (error) {
      console.error('Error fetching entries:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setError(`Failed to load entries. Status: ${error.response?.status || 'Unknown'}, Message: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Content is required');
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('content', content);
    if (topic.trim()) formData.append('topic', topic);
    if (image) formData.append('image', image);
    if (video) formData.append('video', video);
    if (audio) formData.append('audio', audio);
    console.log('Submitting formData:', {
      topic,
      content,
      imageName: image?.name,
      videoName: video?.name,
      audioName: audio?.name
    });

    try {
      const response = await axios.post('http://localhost:8080/api/diary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Post response:', response.data);
      setContent('');
      setTopic('');
      setImage(null);
      setVideo(null);
      setAudio(null);
      setFormKey(Date.now());
      await fetchEntries();
      console.log('Entry saved and refreshed');
    } catch (error) {
      console.error('Error creating entry:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setError(`Failed to save entry. Status: ${error.response?.status || 'Unknown'}, Message: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/api/diary/${id}`);
        console.log('Entry deleted');
        await fetchEntries();
      } catch (error) {
        console.error('Error deleting entry:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        setError(`Failed to delete entry. Status: ${error.response?.status || 'Unknown'}, Message: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editEntry.content.trim()) {
      setError('Content is required');
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('content', editEntry.content);
    if (editEntry.topic.trim()) formData.append('topic', editEntry.topic);
    if (editEntry.image) formData.append('image', editEntry.image);
    if (editEntry.video) formData.append('video', editEntry.video);
    if (editEntry.audio) formData.append('audio', editEntry.audio);
    console.log('Updating formData:', {
      topic: editEntry.topic,
      content: editEntry.content,
      imageName: editEntry.image?.name,
      videoName: editEntry.video?.name,
      audioName: editEntry.audio?.name
    });

    try {
      await axios.put(`http://localhost:8080/api/diary/${editEntry.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Entry updated');
      setEditEntry(null);
      setFormKey(Date.now()); // Reset form for new entry
      await fetchEntries();
    } catch (error) {
      console.error('Error updating entry:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setError(`Failed to update entry. Status: ${error.response?.status || 'Unknown'}, Message: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setEditEntry(null);
  };

  const getHeading = (topic, content) => {
    const safeTopic = topic || '';
    const safeContent = content || '';
    return safeTopic.trim() || safeContent.split('\n')[0] || 'Untitled Entry';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">MyDiary</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">New Entry</h2>
        <form onSubmit={handleSubmit} key={formKey} className="space-y-4">
          <div>
            <label className="block mb-1">Topic:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (optional)"
            />
          </div>
          <textarea
            className="w-full p-2 border rounded"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your diary entry..."
            required
          />
          <div>
            <label className="block mb-1">Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Video:</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              className="p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Audio:</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudio(e.target.files[0])}
              className="p-2"
            />
          </div>
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Entry'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
      <h2 className="text-xl font-semibold mb-2">Diary Entries</h2>
      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : entries.length === 0 ? (
          <p>No entries yet.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="border p-4 rounded flex justify-between items-start">
              <div className="cursor-pointer flex-1" onClick={() => setSelectedEntry(entry)}>
                <h3 className="text-lg font-semibold">{getHeading(entry.topic, entry.content)}</h3>
                <p className="text-gray-600 text-sm">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setEditEntry({ ...entry, image: null, video: null, audio: null })}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-2">{getHeading(selectedEntry.topic, selectedEntry.content)}</h3>
            <p className="mt-2">{selectedEntry.content}</p>
            {selectedEntry.imagePath && (
              <img
                src={`http://localhost:8080/api/diary/media/${selectedEntry.imagePath}`}
                alt="Diary Image"
                className="mt-2 max-w-xs"
              />
            )}
            {selectedEntry.videoPath && (
              <video controls className="mt-2 max-w-xs">
                <source
                  src={`http://localhost:8080/api/diary/media/${selectedEntry.videoPath}`}
                />
              </video>
            )}
            {selectedEntry.audioPath && (
              <audio controls className="mt-2">
                <source
                  src={`http://localhost:8080/api/diary/media/${selectedEntry.audioPath}`}
                />
              </audio>
            )}
            <p className="text-gray-600 text-sm mt-2">
              {new Date(selectedEntry.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {editEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-2">Edit Entry</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block mb-1">Topic:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={editEntry.topic || ''}
                  onChange={(e) => setEditEntry({ ...editEntry, topic: e.target.value })}
                  placeholder="Enter a topic (optional)"
                />
              </div>
              <textarea
                className="w-full p-2 border rounded"
                rows="4"
                value={editEntry.content || ''}
                onChange={(e) => setEditEntry({ ...editEntry, content: e.target.value })}
                placeholder="Write your diary entry..."
                required
              />
              <div>
                <label className="block mb-1">Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditEntry({ ...editEntry, image: e.target.files[0] })}
                  className="p-2"
                />
              </div>
              <div>
                <label className="block mb-1">Video:</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setEditEntry({ ...editEntry, video: e.target.files[0] })}
                  className="p-2"
                />
              </div>
              <div>
                <label className="block mb-1">Audio:</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setEditEntry({ ...editEntry, audio: e.target.files[0] })}
                  className="p-2"
                />
              </div>
              <button
                type="submit"
                className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Update Entry'}
              </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;