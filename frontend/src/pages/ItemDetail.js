import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function ItemDetail() {

  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {

    axios
      .get("http://localhost:5000/api/auth/check", {
        withCredentials: true
      })
      .then((res) => {
        setCurrentUser(res.data.userId);
      })
      .catch(() => { });

    axios
      .get(`http://localhost:5000/api/items/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => console.log(err));

  }, [id]);

  if (!item) {
    return <div className="p-8">Loading...</div>;
  }

  const handleResolve = async () => {

    try {

      await axios.put(
        `http://localhost:5000/api/items/${item._id}/resolve`,
        {},
        { withCredentials: true }
      );

      alert("Item marked as resolved");

      window.location.reload();

    } catch (error) {

      alert("Error resolving item");

    }

  };

  const handleDelete = async () => {

    const confirmDelete = window.confirm("Are you sure you want to delete this item?");

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/items/${item._id}`,
        { withCredentials: true }
      );

      alert("Item deleted successfully");

      window.location.href = "/";

    } catch (error) {

      alert("Error deleting item");

    }

  };

  const startChat = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/conversations",
        {
          itemId: item._id,
          ownerId: item.user
        },
        { withCredentials: true }
      );

      const conversationId = res.data._id;

      navigate(`/chat/${conversationId}`);

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <div className="p-8 max-w-3xl mx-auto">

      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt="item"
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}

      <h1 className="text-3xl font-bold mb-4">
        {item.title}
      </h1>

      <p className="text-gray-600 mb-4">
        {item.description}
      </p>

      <p><b>Category:</b> {item.category}</p>
      <p><b>Location:</b> {item.location}</p>
      <p><b>Type:</b> {item.type}</p>
      {currentUser === item.user && item.status !== "resolved" && (

        <button
          onClick={handleResolve}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Mark as Resolved
        </button>

      )}
      {currentUser === item.user && (

        <button
          onClick={handleDelete}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete Item
        </button>

      )}
      {currentUser !== item.user && (

        <button
          onClick={startChat}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Chat with Owner
        </button>

      )}
    </div>
  );
}

export default ItemDetail;