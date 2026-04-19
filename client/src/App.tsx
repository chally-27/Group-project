import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { PatientPage } from './pages/PatientPage';
import { NursePage } from './pages/NursePage';
import { HistoryPage } from './pages/HistoryPage';
import { EducationPage } from './pages/EducationPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <div className="min-h-screen bg-[#fafdf8] dark:bg-gray-900 transition-colors">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        <Routes>
          <Route path="/" element={<PatientPage />} />
          <Route path="/nurse" element={<NursePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
