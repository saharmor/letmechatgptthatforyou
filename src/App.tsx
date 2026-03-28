import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AISitePage from './pages/AISitePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chatgpt" element={<AISitePage providerId="chatgpt" />} />
      <Route path="/claude" element={<AISitePage providerId="claude" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
