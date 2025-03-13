import { useState } from "react";
import { auth } from "./firebaseConfig";
import ChatRoom from "./ChatRoom";
import Friends from "./Friends";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import './chatdash.css';

function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="app-container">
      {user ? (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
          <div className="main-content">
            <Friends user={user} setSelectedFriend={setSelectedFriend} />
            <ChatRoom user={user} selectedFriend={selectedFriend} />
          </div>
        </>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
}

export default App;