import {Routes, Route, BrowserRouter as Router} from "react-router-dom";
import React from 'react';
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App;