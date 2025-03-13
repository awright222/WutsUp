import { auth, provider } from "./firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";

function Auth({ setUser }) {
  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div>
      <h2>Welcome to WutsUp!</h2>
      <button onClick={signIn}>Sign in with Google</button>
    </div>
  );
}

export default Auth;
