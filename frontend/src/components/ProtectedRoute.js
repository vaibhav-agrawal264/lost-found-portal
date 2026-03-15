import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function ProtectedRoute({ children }) {

  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {

    axios
      .get("http://localhost:5000/api/auth/check", {
        withCredentials: true
      })
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false));

  }, []);

  if (authenticated === null) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;