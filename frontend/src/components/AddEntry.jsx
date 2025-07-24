import React, { useState } from 'react';
import axios from 'axios';

function AddEntry() {
  const [entry, setEntry] = useState({ topic: '', content: '', image: null, video: null, audio: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const safeContent = entry.content || '';
    if (!safeContent.trim()) {
      setError('Content is required');
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('content', safeContent);
    if (entry.topic?.trim()) formData.append('topic', entry.topic);
    if (entry.image) formData.append('image', entry.image);
    if (entry.video) formData.append('video', entry.video);
    if (entry.audio) formData.append('audio', entry.audio);
    console.log('Submitting formData:', {
      topic: entry.topic,
      content: safeContent,
      imageName: entry.image?.name,
      videoName: entry.video?.name,
      audioName: entry.audio?.name
    });

    try {
      await axios.post('http://localhost:8080/api/diary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Entry added');
      setEntry({ topic: '', content: '', image: null, video: null, audio: null });
    } catch (error) {
      console.error('Error adding entry:', { message: error.message, status: error.response?.status, data: error.response?.data });
      setError(`Failed to add entry. Status: ${error.response?.status || 'Unknown'}, Message: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-dark-pastel-purple-text">Add New Entry</h2>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm sm:text-base mb-1 text-dark-pastel-purple-text">Topic:</label>
          <input
            type="text"
            className="w-full p-2 border border-muted-purple-bg rounded text-sm sm:text-base"
            value={entry.topic}
            onChange={(e) => setEntry({ ...entry, topic: e.target.value })}
            placeholder="Enter a topic (optional)"
          />
        </div>
        <div>
          <label className="block text-sm sm:text-base mb-1 text-dark-pastel-purple-text">Content:</label>
          <textarea
            className="w-full p-2 border border-muted-purple-bg rounded text-sm sm:text-base"
            rows="4"
            value={entry.content}
            onChange={(e) => setEntry({ ...entry, content: e.target.value })}
            placeholder="Write your diary entry..."
            required
          />
        </div>
        <div>
          <label className="block text-sm sm:text-base mb-1 text-dark-pastel-purple-text">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEntry({ ...entry, image: e.target.files[0] })}
            className="w-full p-2 border border-muted-purple-bg rounded text-sm sm:text-base"
          />
        </div>
        <div>
          <label className="block text-sm sm:text-base mb-1 text-dark-pastel-purple-text">Video:</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setEntry({ ...entry, video: e.target.files[0] })}
            className="w-full p-2 border border-muted-purple-bg rounded text-sm sm:text-base"
          />
        </div>
        <div>
          <label className="block text-sm sm:text-base mb-1 text-dark-pastel-purple-text">Audio:</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setEntry({ ...entry, audio: e.target.files[0] })}
            className="w-full p-2 border border-muted-purple-bg rounded text-sm sm:text-base"
          />
        </div>
        <button
          type="submit"
          className={`bg-dark-pastel-purple-tex text-white px-4 py-2 rounded hover:bg-dark-pastel-purple-text text-sm sm:text-base ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Add Entry'}
        </button>
        {error && <p className="text-dark-pastel-purple-text mt-2 text-sm sm:text-base">{error}</p>}
      </form>
    </div>
  );
}

export default AddEntry;