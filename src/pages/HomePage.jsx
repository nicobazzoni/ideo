import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";
import Feed from "../components/Feed"; // Import the Feed component
import { signOut } from "firebase/auth";
const HomePage = () => {
  const [userData, setUserData] = useState(null);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.log("No user data found in Firestore.");
        }
      }
    };

    fetchUserData();
  }, []);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="bg-gradient-to-b m-4 from-blue-50 to-white min-h-screen flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-blue-300 overflow-hidden shadow-lg mx-auto">
          <img
            src={userData.photoURL || "/default-avatar.png"}
            alt={userData.displayName || "Anonymous"}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
          Welcome, {userData.displayName}!
        </h1>
        <p className="text-gray-600 text-lg">
          A place to share your thoughts and connect with others.
        </p>
      </div>
      <button
          onClick={handleLogout}
          className=" absolute top-0 right-0 p-1 mx-1 mt-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>

      {/* Call-to-Action Section */}
      <div className="mt-12 flex flex-col items-center space-y-4">
        <Link to="/post" className="button">
          Post a Thought
        </Link>
       
      </div>

      {/* Feed Section */}
      <div className="mt-12 w-full max-w-3xl">
        <Feed />
      </div>

      {/* Footer Section */}
      <div className="mt-auto w-full text-center py-6 bg-gray-100">
        <p className="text-gray-500">
          Powered by <span className="font-semibold text-blue-500">Your App</span>.
        </p>
      </div>
    </div>
  );
};

export default HomePage;