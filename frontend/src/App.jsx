import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/diary');
      console.log('Fetched entries:', response.data);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);
    if (video) formData.append('video', video);
    if (audio) formData.append('audio', audio);

    try {
      await axios.post('http://localhost:8080/api/diary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setContent('');
      setImage(null);
      setVideo(null);
      setAudio(null);
      await fetchEntries();
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">MyDiary</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">New Entry</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-2 border rounded"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your diary entry..."
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Entry
          </button>
        </form>
      </div>
      <h2 className="text-xl font-semibold mb-2">Diary Entries</h2>
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="border p-4 rounded">
            <p className="text-gray-600 text-sm">
              {new Date(entry.createdAt).toLocaleString()}
            </p>
            <p className="mt-2">{entry.content}</p>
            {entry.imagePath && (
              <img
                src={`http://localhost:8080/api/diary/media/${entry.imagePath}`}
                alt="Diary Image"
                className="mt-2 max-w-xs"
              />
            )}
            {entry.videoPath && (
              <video controls className="mt-2 max-w-xs">
                <source
                  src={`http://localhost:8080/api/diary/media/${entry.videoPath}`}
                />
              </video>
            )}
            {entry.audioPath && (
              <audio controls className="mt-2">
                <source
                  src={`http://localhost:8080/api/diary/media/${entry.audioPath}`}
                />
              </audio>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;