import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<PostForm />} />
        <Route path="/posts" element={<PostList />} />
      </Routes>
    </Router>
  );
};

export default App;
