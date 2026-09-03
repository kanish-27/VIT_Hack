import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Disputes from './pages/Disputes';
import DisputeDetail from './pages/DisputeDetail';
import Resilience from './pages/Resilience';
import ProtectionHistory from './pages/ProtectionHistory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/disputes" element={<Disputes />} />
        <Route path="/disputes/:id" element={<DisputeDetail />} />
        <Route path="/resilience" element={<Resilience />} />
        <Route path="/protection-history" element={<ProtectionHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
