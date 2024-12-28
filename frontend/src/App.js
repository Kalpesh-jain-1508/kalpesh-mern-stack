import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerRegistration from './Components/CustomerRegistration.js';
import AdminRegistration from './Components/AdminRegistration.js';
import AdminLogin from './Components/AdminLogin.js';
import VerificationPage from './Components/VerificationPage.js';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<CustomerRegistration />} />
          <Route path="/admin-registration" element={<AdminRegistration />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/verify/:token" element={<VerificationPage />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
