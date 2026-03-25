import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function Navbar() {

  //const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/check`, {
        withCredentials: true
      })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));

  }, []);

  const handleLogout = async () => {

    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );

    window.location.reload();

  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

      <h1 className="text-xl font-bold text-blue-600">
        Lost & Found
      </h1>

      <div className="flex gap-6">

        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>

        <Link to="/post-item" className="text-gray-700 hover:text-blue-600">
          Post Item
        </Link>

        {!isAuthenticated && (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>

            <Link to="/register" className="text-gray-700 hover:text-blue-600">
              Register
            </Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <Link
              to="/messages"
              className="text-gray-700 hover:text-blue-600"
            >
              Messages
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;