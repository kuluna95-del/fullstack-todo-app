// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Récupère le token depuis le localStorage
  const token = localStorage.getItem("token");

  // Si pas de token, redirige vers la page login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Sinon, affiche le composant enfant (ex: TodoApp)
  return children;
}

export default ProtectedRoute;
