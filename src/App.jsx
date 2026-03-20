import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TimetableProvider } from './context/TimetableContext';
import Navbar from './components/Navbar';
import TodayView from './components/TodayView';
import TimetableView from './components/TimetableView';
import ThreeBackground from './components/ThreeBackground';
import './App.css';

function App() {
  return (
    <TimetableProvider>
      <BrowserRouter>
        {/* Full-page Three.js animated background */}
        <ThreeBackground />

        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<TodayView />} />
              <Route path="/timetable" element={<TimetableView />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TimetableProvider>
  );
}

export default App;
