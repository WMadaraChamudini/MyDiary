import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editEntry, setEditEntry] = useState(null);

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
      console.error('Error fetching entries:', { message: error.message, status: error.response?.status, data: error.response?.data });
      setError(`Failed to load entries. Status: ${error.response?.status || 'Unknown'}, Message: ${error.message}`);
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
        console.error('Error deleting entry:', { message: error.message, status: error.response?.status, data: error.response?.data });
        setError(`Failed to delete entry. Status: ${error.response?.status || 'Unknown'}, Message: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const safeContent = editEntry.content || '';
    if (!safeContent.trim()) {
      setError('Content is required');
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('content', safeContent);
    if (editEntry.topic?.trim()) formData.append('topic', editEntry.topic);
    if (editEntry.image) formData.append('image', editEntry.image);
    if (editEntry.video) formData.append('video', editEntry.video);
    if (editEntry.audio) formData.append('audio', editEntry.audio);
    console.log('Updating formData:', {
      topic: editEntry.topic,
      content: safeContent,
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
      await fetchEntries();
    } catch (error) {
      console.error('Error updating entry:', { message: error.message, status: error.response?.status, data: error.response?.data });
      setError(`Failed to update entry. Status: ${error.response?.status || 'Unknown'}, Message: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getHeading = (topic, content) => {
    const safeTopic = topic || '';
    const safeContent = content || '';
    return safeTopic.trim() || safeContent.split('\n')[0] || 'Untitled Entry';
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setEditEntry(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Diary Entries</h2>
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
                <p className="text-gray-600 text-sm">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setEditEntry({ ...entry, image: null, video: null, audio: null, content: entry.content || '', topic: entry.topic || '' })}
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
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">×</button>
            <h3 className="text-xl font-semibold mb-2">{getHeading(selectedEntry.topic, selectedEntry.content)}</h3>
            <p className="mt-2">{selectedEntry.content}</p>
            {selectedEntry.imagePath && (
              <img src={`http://localhost:8080/api/diary/media/${selectedEntry.imagePath}`} alt="Diary Image" className="mt-2 max-w-xs" />
            )}
            {selectedEntry.videoPath && (
              <video controls className="mt-2 max-w-xs">
                <source src={`http://localhost:8080/api/diary/media/${selectedEntry.videoPath}`} />
              </video>
            )}
            {selectedEntry.audioPath && (
              <audio controls className="mt-2">
                <source src={`http://localhost:8080/api/diary/media/${selectedEntry.audioPath}`} />
              </audio>
            )}
            <p className="text-gray-600 text-sm mt-2">{new Date(selectedEntry.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}
      {editEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-lg sm:max-w-md md:max-w-xl lg:max-w-2xl relative max-h-96 sm:max-h-80 md:max-h-96 overflow-y-auto">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">×</button>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">Edit Entry</h3>
            <form onSubmit={handleUpdate} className="space-y-4 p-2">
              <div>
                <label className="block text-sm sm:text-base mb-1">Topic:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded text-sm sm:text-base"
                  value={editEntry.topic || ''}
                  onChange={(e) => setEditEntry({ ...editEntry, topic: e.target.value })}
                  placeholder="Enter a topic (optional)"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base mb-1">Content:</label>
                <textarea
                  className="w-full p-2 border rounded text-sm sm:text-base"
                  rows="4"
                  value={editEntry.content || ''}
                  onChange={(e) => setEditEntry({ ...editEntry, content: e.target.value })}
                  placeholder="Write your diary entry..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base mb-1">Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditEntry({ ...editEntry, image: e.target.files[0] })}
                  className="w-full p-2 border rounded text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base mb-1">Video:</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setEditEntry({ ...editEntry, video: e.target.files[0] })}
                  className="w-full p-2 border rounded text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base mb-1">Audio:</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setEditEntry({ ...editEntry, audio: e.target.files[0] })}
                  className="w-full p-2 border rounded text-sm sm:text-base"
                />
              </div>
              <button
                type="submit"
                className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm sm:text-base ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Update Entry'}
              </button>
            </form>
            {error && <p className="text-red-500 mt-2 text-sm sm:text-base">{error}</p>}
          </div>
        </div>
      )}
      {error && !editEntry && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default ViewEntries;