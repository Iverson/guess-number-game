import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { GamePage } from './game';

function App() {
  return (
    <div className="dark:bg-zinc-900 min-h-full">
      <BrowserRouter>
        <Routes>
          <Route path="/game" element={<GamePage />} />
          <Route path="*" element={<Navigate to="/game" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
