import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchItems = async () => {
      setLoadingMore(page > 1);
      try {

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/items/all?page=${page}&limit=9`);

        if (page === 1) {
          setItems(res.data.items);
        } else {
          setItems(prev => [...prev, ...res.data.items]);
        }
        setTotalPages(res.data.totalPages);
        setLoading(false);
        setLoadingMore(false);

      } catch (error) {

        console.log("Error fetching items");
        setLoading(false);
        setLoadingMore(false);

      }

    };

    fetchItems();

  }, [page]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading items...
      </div>
    );
  }

  const filteredItems = items
    .filter((item) => {
      const q = search.toLowerCase();
      return (
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q)
      );
    })
    .filter((item) =>
      filter === "all" ? true : item.type === filter
    );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Lost & Found Items
      </h2>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">

        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("found")}
          className={`px-4 py-2 rounded ${filter === "found" ? "bg-green-500 text-white" : "bg-green-200"
            }`}
        >
          Found
        </button>

        <button
          onClick={() => setFilter("lost")}
          className={`px-4 py-2 rounded ${filter === "lost" ? "bg-red-500 text-white" : "bg-red-200"
            }`}
        >
          Lost
        </button>

      </div>

      {/* Empty State */}
      {filteredItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No items found
        </div>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredItems.map((item) => (

            <div
              key={item._id}
              onClick={() => navigate(`/item/${item._id}`)}
              className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-xl transition"
            >

              {item.imageUrl && (
                <div className="relative">

                  <img
                    src={item.imageUrl}
                    alt="item"
                    className="w-full h-48 object-contain bg-white"
                  />

                  <span
                    className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white rounded-full ${item.type === "lost" ? "bg-red-500" : "bg-green-500"
                      }`}
                  >
                    {item.type.toUpperCase()}
                  </span>

                </div>
              )}

              <div className="p-5">

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="text-sm text-gray-500">

                  <p>
                    <span className="font-semibold text-gray-700">
                      Category:
                    </span>{" "}
                    {item.category}
                  </p>

                  <p>
                    <span className="font-semibold text-gray-700">
                      Location:
                    </span>{" "}
                    {item.location}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* Pagination Load More */}
      {!loading && page < totalPages && (
        <div className="text-center mt-10">
          <button
            onClick={() => setPage(page + 1)}
            disabled={loadingMore}
            className={`px-6 py-2 rounded shadow-md font-semibold ${loadingMore ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

    </div>
  );
}

export default Home;