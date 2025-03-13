import { useEffect, useState } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from "firebase/firestore";

function ChatRoom({ user, selectedFriend }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedFriend) return;

    const q = query(
      collection(db, "messages"),
      where("participants", "array-contains", user.uid),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedFriend, user.uid]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      participants: [user.uid, selectedFriend.userId],
    });
    setNewMessage("");
  };

  return (
    <div>
      <h2>Chat with {selectedFriend ? selectedFriend.friendEmail : "..."}</h2>
      {loading ? (
        <p>Loading messages...</p>
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