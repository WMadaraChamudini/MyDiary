import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Diary = ({ token, setToken }) => {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/diary/entries', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEntries();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    if (media) formData.append('media', media);

    try {
      await axios.post('http://localhost:8080/api/diary/entry', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setContent('');
      setMedia(null);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">My Diary</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your diary entry..."
          className="w-full p-2 border rounded h-32"
        />
        <input
          type="file"
          onChange={(e) => setMedia(e.target.files[0])}
          className="my-2"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Entry
        </button>
      </div>
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white p-4 rounded shadow">
            <p>{entry.content}</p>
            {entry.mediaUrl && (
              <img src={`http://localhost:8080${entry.mediaUrl}`} alt="Media" className="mt-2 max-w-xs" />
            )}
            <p className="text-gray-500 text-sm">{new Date(entry.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Diary;