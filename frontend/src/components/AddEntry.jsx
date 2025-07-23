import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddEntry() {
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    console.log('Submitting formData:', { topic, content, imageName: image?.name, videoName: video?.name, audioName: audio?.name });

    try {
      await axios.post('http://localhost:8080/api/diary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Entry saved');
      navigate('/view');
    } catch (error) {
      console.error('Error creating entry:', { message: error.message, status: error.response?.status, data: error.response?.data });
      setError(`Failed to save entry. Status: ${error.response?.status || 'Unknown'}, Message: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Add New Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div>
          <label className="block mb-1">Content:</label>
          <textarea
            className="w-full p-2 border rounded"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your diary entry..."
            required
          />
        </div>
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
  );
}

export default AddEntry;