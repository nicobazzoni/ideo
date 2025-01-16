import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Import toast
import "react-toastify/dist/ReactToastify.css"; // ✅ Import CSS for toastify

const IdeaForm = () => {
  const [ideaName, setIdeaName] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!ideaName || !content) {
        setError("Idea name and content are required.");
        toast.error("⚠️ Idea name and content are required!", { transition: toast.TYPE.FLIP });
        setLoading(false);
        return;
      }

      // Get current user
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to submit an idea.");
        toast.error("🚨 You must be logged in to submit an idea.", { transition: toast.TYPE.BOUNCE });
        setLoading(false);
        return;
      }

      let attachmentURL = null;

      // Upload file to Firebase Storage if attachment exists
      if (attachment) {
        const storageRef = ref(storage, `attachments/${user.uid}/${attachment.name}`);
        const snapshot = await uploadBytes(storageRef, attachment);
        attachmentURL = await getDownloadURL(snapshot.ref);
      }

      // Prepare data for Firestore
      const ideaData = {
        ideaName,
        content,
        userPhoto: user.photoURL || "/default-avatar.png",
        userName: user.displayName || "Anonymous",
        userId: user.uid,
        createdAt: Timestamp.now(),
        symbiosis: [],
        likes: [],
        attachment: attachmentURL, // Store Firebase Storage URL
      };

      // Save to Firestore
      const ideasRef = collection(db, "ideas");
      await addDoc(ideasRef, ideaData);

      // Success message
      toast.success("✅ Your idea was posted successfully!", {
      
        autoClose: 3000,
        style: { background: "#28a745", color: "#fff", fontWeight: "bold", borderRadius: "8px" },
      });

      // Reset form
      setIdeaName("");
      setContent("");
      setAttachment(null);
      setError("");

      // Redirect to home page
      navigate("/");
    } catch (err) {
      console.error("Error submitting idea:", err);
      setError("Failed to submit your idea. Please try again.");
      toast.error("🚨 Failed to submit your idea. Please try again.", {
       
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Share Your Idea</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Idea Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Idea Name</label>
        <input
          type="text"
          value={ideaName}
          onChange={(e) => setIdeaName(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter the title of your idea"
        />
      </div>

      {/* Content */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Describe your idea in detail"
          rows="4"
        ></textarea>
      </div>

      {/* Attachment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>
        <input
          type="file"
          onChange={(e) => setAttachment(e.target.files[0])}
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full p-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Idea"}
      </button>
    </form>
  );
};

export default IdeaForm;