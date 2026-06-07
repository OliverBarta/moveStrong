import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useState } from 'react'

import './App.css'
import TopBar  from './TopBar'
import Resources from './Resources'
import About from './About'
import Home from './Home'
import FindPrograms from './FindPrograms';
import ForProviders from './ForProviders';

function App() {

  return (
      <Router>
      <TopBar /> 
      <main style={{ paddingTop: '70px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/findprograms" element={<FindPrograms />} />
          <Route path="/forproviders" element={<ForProviders />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
