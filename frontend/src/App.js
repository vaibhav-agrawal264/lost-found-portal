import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostItem from "./pages/PostItem";
import ItemDetail from "./pages/ItemDetail";
import ChatPage from "./pages/ChatPage";
function App() {
  return (
    <Router>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post-item" element={<ProtectedRoute>
          <PostItem />
        </ProtectedRoute>} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
      </Routes>

    </Router>
  );
}

export default App;