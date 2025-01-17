import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user details in Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          lastLogin: new Date(),
        },
        { merge: true }
      );

      toast.success(`👋 Welcome back, ${user.displayName || "Guest"}!`, {
        position: "top-right",
        autoClose: 3000,
      });
      console.log("User signed in and saved to Firestore:", user);
    } catch (err) {
      console.error("Error during Google Sign-In:", err);
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/ideo.png')" }} // ✅ Set Background
    >
      <div className="max-w-sm w-full bg-white p-6 rounded-lg shadow-md bg-opacity-90">
        <h1 className="text-xl font-bold mb-4 text-center">Welcome to Ideo</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          onClick={handleGoogleSignIn}
          className={`w-full p-2 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-400 hover:bg-green-400"
          }`}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In with Google"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;