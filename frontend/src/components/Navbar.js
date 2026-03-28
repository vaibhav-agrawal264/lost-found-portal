import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function Navbar() {

  //const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/messages/unread/count`,
        { withCredentials: true }
      );
      setUnreadCount(res.data.count);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/check`, {
        withCredentials: true
      })
      .then(() => {
        setIsAuthenticated(true);
        fetchUnreadCount();
      })
      .catch(() => setIsAuthenticated(false));

  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = io(process.env.REACT_APP_API_URL, { withCredentials: true });

    socket.on("newMessageNotification", () => {
      fetchUnreadCount();
    });

    const handleLocalRead = () => {
      fetchUnreadCount();
    };

    window.addEventListener("updateUnreadCount", handleLocalRead);

    return () => {
      socket.disconnect();
      window.removeEventListener("updateUnreadCount", handleLocalRead);
    };
  }, [isAuthenticated]);

  const handleLogout = async () => {

    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );

    window.location.reload();

  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-end items-center">

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
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>

            <Link
              to="/messages"
              className="text-gray-700 hover:text-blue-600 relative"
            >
              Messages
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
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