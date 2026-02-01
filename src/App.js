import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TodoApp from "./pages/TodoApp";
import { useState } from "react";
import './App.css'; // ou './index.css' selon où tu as mis le CSS

// Force rebuild on Vercel

function App() {
  // ✅ token persistant
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const ProtectedRoute = ({ children }) => {
    if (!token) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TodoApp token={token} logout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={<Login setToken={setToken} />}
      />

      <Route
        path="/register"
        element={<Register />}
      />
    </Routes>
  );
}

export default App;
