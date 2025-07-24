import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import AddEntry from './components/AddEntry';
import ViewEntries from './components/ViewEntries';

function NavigationBar() {
  return (
    <nav className="bg-dark-pastel-purple-text p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Diary</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:text-pastel-purple-bg ">Home</Link>
          <Link to="/add" className="hover:text-pastel-purple-bg">Add Entry</Link>
          <Link to="/view" className="hover:text-pastel-purple-bg">View Entries</Link>
        </div>
      </div>
    </nav>
  );
}

function MenuPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-bg via-pastel-purple-bg to-lavender-bg flex items-center justify-center p-6">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-dark-pastel-purple-text mb-12 animate-pulse">Welcome to My Diary!</h2>
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
          <Link
            to="/add"
            className="block bg-muted-purple-text text-white px-6 py-3 rounded-lg mb-4 hover:bg-dark-pastel-purple-text transition duration-200"
          >
            Add Entry
          </Link>
          <Link
            to="/view"
            className="block bg-muted-purple-text text-white px-6 py-3 rounded-lg hover:bg-dark-pastel-purple-text transition duration-200"
          >
            View Entries
          </Link>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const showNav = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-lavender-bg">
      {showNav && <NavigationBar />}
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/add" element={<AddEntry />} />
          <Route path="/view" element={<ViewEntries />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;