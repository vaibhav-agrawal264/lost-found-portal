import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostItem from "./pages/PostItem";
import ItemDetail from "./pages/ItemDetail";
import ChatPage from "./pages/ChatPage";
import MessagesPage from "./pages/MessagesPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post-item" element={<ProtectedRoute>
          <PostItem />
        </ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="/messages" element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        } />
          </Routes>
        </main>

        <footer className="bg-slate-800 py-8 text-center mt-auto shadow-inner relative overflow-hidden border-t border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-80"></div>
          <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
            <p className="text-slate-300 font-medium tracking-wide">
              Designed & Built by{" "}
              <span className="font-bold text-blue-400 tracking-wider ml-1 hover:text-blue-300 transition cursor-default">
                Vaibhav Agrawal
              </span>
            </p>
            <p className="text-xs text-slate-500 font-semibold tracking-widest uppercase">
              Lost & Found Portal &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;