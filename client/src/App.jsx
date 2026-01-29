import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LandingPage from './pages/LandingPage';
import TaskPortal from './pages/TaskPortal'; 

// --- DYNAMIC API CONFIGURATION ---
// Ye line .env se URL uthayegi, agar .env nahi mila toh localhost use karegi
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {user ? (
        // Pura user object bhej rahe hain jisme email hota hai
        // API_URL bhi bhej diya taaki TaskPortal ko pata ho kahan request bhejni hai
        <TaskPortal user={user} apiUrl={API_URL} />
      ) : (
        <LandingPage />
      )}
    </div>
  );
}

export default App;