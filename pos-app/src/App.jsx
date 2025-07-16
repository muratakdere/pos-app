import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <ConditionalHeader />
      {/* TOAST CONTAINER */}
      <ToastContainer
        position="top-right"
        autoClose={2000} // 3 saniyede otomatik kapanır
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Light/dark/colored
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

const ConditionalHeader = () => {
  const location = useLocation();
  const noHeaderRoutes = ["/", "/login", "/register"];

  if (noHeaderRoutes.includes(location.pathname)) {
    return null;
  }

  return <Header />;
};

export default App;
