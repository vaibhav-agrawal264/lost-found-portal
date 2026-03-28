import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MessagesPage() {

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/conversations/all`,
          { withCredentials: true }
        );
        setConversations(res.data);
      } catch (err) {
        setError("Unable to load conversations.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Your Messages</h2>

      {loading && <p>Loading conversations...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && conversations.length === 0 && (
        <p>No conversations yet.</p>
      )}

      {conversations.map((conv) => (
        <div
          key={conv._id}
          onClick={() => navigate(`/chat/${conv._id}`)}
          className="cursor-pointer border rounded p-4 mb-3 hover:bg-gray-50 flex justify-between items-center"
        >
          <div>
            <p className="mb-1 text-lg">
              <span className="font-bold text-gray-800">{conv.item?.title || "Untitled item"}</span>
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-600">Chat with:</span> {conv.otherUser || "Unknown User"}
            </p>
          </div>
          
          {conv.unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ml-4">
              {conv.unreadCount} New
            </span>
          )}
        </div>
      ))}

    </div>
  );
}