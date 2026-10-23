import './App.css';
import Dashboard from './pages/Dashbard';
import { TranscriptionHistory } from './pages/TranscriptionHistory';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<TranscriptionHistory />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
