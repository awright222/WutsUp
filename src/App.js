import { useState } from "react";
import { auth } from "./firebaseConfig";
import ChatRoom from "./ChatRoom";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(auth.currentUser);

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
    <div>
      {user ? (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
          <ChatRoom user={user} />
        </>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
}

export default App;
