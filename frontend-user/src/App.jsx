import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import LoanTypes from "./pages/loans/LoanTypes";
import LoanApply from "./pages/loans/LoanApply";
import LoanConfirmation from "./pages/loans/LoanConfirmation";
import LoanDecision from "./pages/loans/LoanDecision";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoanTypes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/loan/apply" element={<LoanApply />} />
          <Route path="/loan/confirm" element={<LoanConfirmation />} />
          <Route path="/loan/decision" element={<LoanDecision />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
