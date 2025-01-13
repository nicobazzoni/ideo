import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Feed = () => {
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThoughts = async () => {
      const thoughtsRef = collection(db, "ideas");
      const q = query(thoughtsRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedThoughts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setThoughts(fetchedThoughts);
        setLoading(false);
      });

      return () => unsubscribe(); // Clean up the listener
    };

    fetchThoughts();
  }, []);

  if (loading) return <div>Loading feed...</div>;

  if (thoughts.length === 0) {
    return <div>No thoughts yet. Be the first to post!</div>;
  }

  return (
    <div className=" p-1 mx-auto grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {thoughts.map((thought) => (
        <motion.div
          key={thought.id}
          className="relative flex flex-col items-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Thought Bubble */}
          <div className="relative bg-gray-100 opacity-0.5 text-gray-800 p-4 rounded-lg shadow-lg max-w-sm text-center">
            <p className="font-bold text-xs">{thought.userName}</p>
            <p>{thought.content}</p>
            <Link
        to={`/post/${thought.id}`}
        className="text-blue-500  mt-2 block"
      >
      +
      </Link>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full h-4 w-4 bg-gray-100 rotate-45"></span>
          </div>
         

          {/* Profile Picture */}
          <img
            src={thought.userPhoto || "/default-avatar.png"}
            alt={thought.userName || "Anonymous"}
            className="w-16 h-16 rounded-full border shadow-lg"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Feed;