import { useState, useEffect } from "react";
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "../firebase";
import { FaThumbsUp } from "react-icons/fa";

const LikeButton = ({ postId }) => {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchLikes = async () => {
      if (!postId) return;

      const postRef = doc(db, "ideas", postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const postData = postSnap.data();
        setLikes(postData.likes || []);
        setLiked(postData.likes?.some((like) => like.userId === user?.uid) || false);
      }
    };

    fetchLikes();
  }, [postId, user]);

  const handleLike = async () => {
    if (!user) {
      alert("You must be logged in to like a post!");
      return;
    }

    const postRef = doc(db, "ideas", postId);
    const userLikeData = {
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      userPhoto: user.photoURL || "/default-avatar.png",
    };

    const updatedLikes = liked
      ? arrayRemove(userLikeData) // Remove like
      : arrayUnion(userLikeData); // Add like

    try {
      await updateDoc(postRef, { likes: updatedLikes });
      setLiked(!liked);
      setLikes((prev) =>
        liked ? prev.filter((like) => like.userId !== user.uid) : [...prev, userLikeData]
      );
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleLike}
        className={`flex items-center space-x-2 p-2 rounded-md ${
          liked ? "text-blue-500" : "text-gray-500 hover:text-blue-400"
        }`}
      >
        <FaThumbsUp size={20} />
        <span>{likes.length}</span>
      </button>

      {/* Show user avatars of those who liked */}
      {likes.length > 0 && (
        <div className="mt-2 flex -space-x-2">
          {likes.slice(0, 5).map((like, index) => (
            <img
              key={index}
              src={like.userPhoto}
              alt={like.userName}
              className="w-8 h-8 rounded-full border border-white shadow"
              title={like.userName}
            />
          ))}
          {likes.length > 5 && <span className="ml-2 text-sm text-gray-500">+{likes.length - 5} more</span>}
        </div>
      )}
    </div>
  );
};

export default LikeButton;