import { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

function Friends({ user, setSelectedFriend }) {
  const [friends, setFriends] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      const q = query(collection(db, "friends"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      setFriends(querySnapshot.docs.map(doc => doc.data()));
    };

    fetchFriends();
  }, [user]);

  const addFriend = async () => {
    if (email.trim() === "") return;
    await addDoc(collection(db, "friends"), {
      userId: user.uid,
      friendEmail: email,
    });
    setEmail("");
  };

  return (
    <div className="friends-panel">
      <h2>Friends</h2>
      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter friend's email"
        />
        <button onClick={addFriend}>Add Friend</button>
      </div>
      <div>
        <h3>Your Friends</h3>
        <ul>
          {friends.map((friend, index) => (
            <li key={index} onClick={() => setSelectedFriend(friend)}>
              <img src={friend.profilePicture} alt={friend.friendEmail} />
              {friend.friendEmail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Friends;