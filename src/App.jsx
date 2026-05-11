import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Report from './pages/Report';
import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Sabse pehle Login page khulega */}
        <Route path="/" element={<Login />} /> 
        
        {/* 2. Grievance Report karne wala page (User Side) */}
        <Route path="/report" element={<Report />} /> 
        
        {/* 3. Admin Dashboard (BMC Officer Side) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 4. Feedback Routes (Citizen Feedback Loop) */}
        
        {/* Pehla Route: Jab user Sidebar se bina ID ke "Give Feedback" par click karega */}
        <Route path="/feedback" element={<Feedback />} />

        {/* Dusra Route: Jab user ke paas direct link ho ID ke sath (Jaise /feedback/101) */}
        <Route path="/feedback/:id" element={<Feedback />} />

      </Routes>
    </Router>
  );
}

export default App;