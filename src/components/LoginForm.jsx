import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";
import { toast } from "react-toastify"; // ✅ Import toast
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
        { merge: true } // Avoid overwriting existing data
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
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Sign In</h1>
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleGoogleSignIn}
        className={`w-full p-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
        }`}
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In with Google"}
      </button>
    </div>
  );
};

export default LoginForm;