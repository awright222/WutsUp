import { useEffect, useState } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

function ChatRoom({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
    });
    setNewMessage("");
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}><strong>{msg.user}: </strong>{msg.text}</p>
        ))}
      </div>
      <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatRoom;
