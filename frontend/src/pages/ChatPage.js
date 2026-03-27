import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io(process.env.REACT_APP_API_URL, { withCredentials: true });

function ChatPage() {

  const { conversationId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef();

  // ✅ Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/messages/${conversationId}`,
        { withCredentials: true }
      );
      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Main useEffect (fixed dependencies)
  useEffect(() => {

    if (!conversationId) return;

    fetchMessages();

    socket.emit("joinConversation", conversationId);

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };

  }, [conversationId]);

  // ✅ Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Mark as read when messages change and conversation is open
  useEffect(() => {
    const markAsRead = async () => {
      if (!conversationId || messages.length === 0) return;

      const hasUnreadOthers = messages.some(
        (m) => m.sender?._id !== localStorage.getItem("userId") // Rough check
      );

      try {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/messages/mark-read/${conversationId}`,
          {},
          { withCredentials: true }
        );
        window.dispatchEvent(new Event("updateUnreadCount"));
      } catch (err) {
        console.log(err);
      }
    };
    
    markAsRead();
  }, [messages.length, conversationId]);

  // ✅ Send message
  const sendMessage = async () => {

    if (!text) return;

    try {

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/messages`,
        {
          conversationId,
          text
        },
        { withCredentials: true }
      );

      const message = res.data;

      socket.emit("sendMessage", {
        conversationId,
        ...message
      });

      setMessages((prev) => [...prev, message]);
      setText("");

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="p-8">

      <h2 className="text-2xl font-bold mb-6">Chat</h2>

      <div className="border rounded p-4 h-96 overflow-y-scroll mb-4">

        {messages.map((msg) => (

          <div key={msg._id} className="mb-2">

            <span className="font-semibold">{msg.sender?.name}</span>:

            <span className="ml-2">{msg.text}</span>

          </div>

        ))}

        {/* ✅ Scroll anchor */}
        <div ref={bottomRef}></div>

      </div>

      <div className="flex gap-2">

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>

      </div>

    </div>

  );

}

export default ChatPage;