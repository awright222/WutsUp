import { useState, useEffect, useRef } from "react";
import { auth } from "./firebaseConfig";
import ChatRoom from "./ChatRoom";
import Friends from "./Friends";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import './chatdash.css';

function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Ref to detect clicks outside the sidebar
  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null);

  // Sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error signing in:", error);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !mainContentRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <div className="app-container">
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
      
      {user ? (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
          
          <div className="main-content" ref={mainContentRef}>
            <button onClick={toggleSidebar}>Toggle Sidebar</button>
            
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
              <button>Home</button>
              <button>Settings</button>
              {/* Add more sidebar links as needed */}
            </div>
            
            <div className="card">
              <Friends user={user} setSelectedFriend={setSelectedFriend} />
            </div>
            
            <div className="card">
              <ChatRoom user={user} selectedFriend={selectedFriend} />
            </div>
          </div>
        </>
      ) : (
        <>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <button className="sign-in-button" onClick={signInWithGoogle}>
              Sign in with Google
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default App;
