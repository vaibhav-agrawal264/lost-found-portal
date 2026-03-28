import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io(process.env.REACT_APP_API_URL, { withCredentials: true });

function ChatPage() {

  const { conversationId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/check`, { withCredentials: true })
      .then((res) => setCurrentUserId(res.data.userId))
      .catch((err) => console.log(err));
  }, []);

  const bottomRef = useRef();

  // ✅ Main useEffect (fixed dependencies)
  useEffect(() => {

    if (!conversationId) return;

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
  }, [messages, conversationId]);

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

      <div className="border rounded p-4 h-96 overflow-y-scroll mb-4 bg-gray-50 flex flex-col gap-3">

        {messages.map((msg) => {
          const isMe = msg.sender?._id === currentUserId;
          return (
            <div
              key={msg._id}
              className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                  isMe
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 border rounded-bl-none"
                }`}
              >
                {!isMe && (
                  <p className="text-xs font-bold text-gray-700 mb-1">
                    {msg.sender?.name}
                  </p>
                )}
                <p className="break-words">{msg.text}</p>
              </div>
            </div>
          );
        })}

        {/* ✅ Scroll anchor */}
        <div ref={bottomRef}></div>

      </div>

      <div className="flex gap-2">

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
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