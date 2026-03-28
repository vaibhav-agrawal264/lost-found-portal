import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyItems = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/items/me`, { withCredentials: true });
      setItems(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching items");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const handleResolve = async (e, itemId) => {
    e.stopPropagation();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/items/${itemId}/resolve`, {}, { withCredentials: true });
      alert("Item marked as resolved");
      fetchMyItems(); 
    } catch (error) {
      alert("Error resolving item");
    }
  };

  const handleDelete = async (e, itemId) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/items/${itemId}`, { withCredentials: true });
      alert("Item deleted successfully");
      fetchMyItems(); 
    } catch (error) {
      alert("Error deleting item");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Dashboard</h2>
      
      {items.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">You haven't posted any items yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/item/${item._id}`)}
              className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-xl transition flex flex-col overflow-hidden"
            >
              {item.imageUrl && (
                <div className="relative">
                  <img src={item.imageUrl} alt="item" className="w-full h-48 object-contain bg-white" />
                  <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white rounded-full ${item.type === "lost" ? "bg-red-500" : "bg-green-500"}`}>
                    {item.type.toUpperCase()}
                  </span>
                  {item.status === 'resolved' && (
                    <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white rounded-full bg-gray-600 shadow-sm">
                      RESOLVED
                    </span>
                  )}
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                <div className="text-sm text-gray-500 mt-auto mb-4">
                  <p><span className="font-semibold text-gray-700">Category:</span> {item.category}</p>
                  <p><span className="font-semibold text-gray-700">Status:</span> <span className={`${item.status === 'resolved' ? 'text-green-600 font-bold' : ''}`}>{item.status.toUpperCase()}</span></p>
                </div>
                <div className="flex gap-2 mt-2 pt-4 border-t">
                  {item.status !== "resolved" && (
                    <button
                      onClick={(e) => handleResolve(e, item._id)}
                      className="flex-1 bg-blue-500 text-white py-1.5 rounded hover:bg-blue-600 transition text-sm font-semibold"
                    >
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(e, item._id)}
                    className="flex-1 bg-red-500 text-white py-1.5 rounded hover:bg-red-600 transition text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
