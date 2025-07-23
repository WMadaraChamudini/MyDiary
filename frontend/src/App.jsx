import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AddEntry from './components/AddEntry';
import ViewEntries from './components/ViewEntries';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <h1 className="text-2xl font-bold">MyDiary</h1>
            <div className="space-x-4">
              <Link to="/" className="hover:underline">Menu</Link>
              <Link to="/add" className="hover:underline">Add Entry</Link>
              <Link to="/view" className="hover:underline">View Entries</Link>
            </div>
          </div>
        </nav>
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<h2 className="text-xl font-semibold">Welcome to MyDiary! Use the menu to navigate.</h2>} />
            <Route path="/add" element={<AddEntry />} />
            <Route path="/view" element={<ViewEntries />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;