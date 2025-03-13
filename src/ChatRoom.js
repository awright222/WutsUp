import { useEffect, useState } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

function ChatRoom({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true); // Optional: Show loading indicator

  // Fetch messages in real-time
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false); // Once data is fetched, set loading to false
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return; // Don't send empty messages
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName, // Store the name of the user sending the message
    });
    setNewMessage(""); // Clear the message input
  };

  return (
    <div>
      <h2>Chat Room</h2>
      {loading ? (
        <p>Loading messages...</p> // Optional loading message
      ) : (
        <div>
          {messages.map((msg) => (
            <p key={msg.id}>
              <strong>{msg.user}: </strong>{msg.text}
            </p>
          ))}
        </div>
      )}

      <div>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatRoom;
