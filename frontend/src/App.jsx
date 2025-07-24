
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import AddEntry from './components/AddEntry';
import ViewEntries from './components/ViewEntries';

function NavigationBar() {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">MyDiary</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/add" className="hover:underline">Add Entry</Link>
          <Link to="/view" className="hover:underline">View Entries</Link>
        </div>
      </div>
    </nav>
  );
}

function MenuPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-white flex items-center justify-center p-6">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 animate-pulse">Welcome to MyDiary!</h2>
        <div className="bg-white p-8 rounded-lg shadow-2xl  w-full max-w-md">
          <Link
            to="/add"
            className="block bg-blue-500 text-white px-6 py-3 rounded-lg mb-4 hover:bg-blue-600 transition duration-200"
          >
            Add Entry
          </Link>
          <Link
            to="/view"
            className="block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200"
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
    <div className="min-h-screen bg-gray-100">
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
