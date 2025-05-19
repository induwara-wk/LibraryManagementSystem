import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        {/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Library Management System</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Books</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add">Add Book</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav> */}

        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/add" element={<AddBook />} />
          <Route path="/edit/:id" element={<EditBook />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;