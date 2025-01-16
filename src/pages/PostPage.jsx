import { useParams } from "react-router-dom";
import { doc, getDoc,deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getDownloadURL, ref,deleteObject } from "firebase/storage";
import { storage,auth } from "../firebase";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LikeButton from "../components/LikeButton";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [isOwner, setIsOwner] = useState(false)
  const user = auth.currentUser; 
  console.log(user)
  
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "ideas", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          if (data.attachmentPath) {
            const attachmentURL = await getDownloadURL(ref(storage, data.attachmentPath));
            data.attachment = attachmentURL;
          }

          setPost(data);

          // ✅ Check if the logged-in user is the post owner
          setIsOwner(user && data.userId === user.uid);
        } else {
          console.log("No such post!");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const postRef = doc(db, "ideas", id);

      // ✅ Delete attachment from Firebase Storage (if exists)
      if (post.attachmentPath) {
        const attachmentRef = ref(storage, post.attachmentPath);
        await deleteObject(attachmentRef);
      }

      // ✅ Delete post from Firestore
      await deleteDoc(postRef);

      alert("Post deleted successfully.");
      navigate("/"); // Redirect to home after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };


  if (loading) return <div>Loading post...</div>;

  if (!post) return <div>Post not found</div>;

return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl text-center">
      {/* User Image */}
      <img className="rounded-full mx-auto w-20 h-20" src={post.userPhoto} alt="User" />
      
      {/* Title */}
      <h1 className="text-2xl font-bold mt-4">{post.ideaName}</h1>

      {/* Image Attachment */}
      <img
        src={post.attachment || '/PLANE2.png'}
        alt={post.title || "Post Image"}
        className="w-full h-76 rounded my-4 object-cover"
        onError={(e) => (e.target.src = "/PLANE2.png")}
      />

      {/* Post Content */}
      <p className="text-gray-700">{post.content}</p>

      {/* Post Metadata */}
      <p className="text-sm text-gray-500 mt-4">
        Posted by <span className="font-bold "> {post.userName || "Anonymous"} on{" "}</span>
        {new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}
      </p>
      <LikeButton postId={id} />
      {isOwner && (
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-600"
        >
          Delete Post
        </button>
      )}

      {/* Back Button */}
      <div className="flex justify-center mt-4">
        <button className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300" onClick={() => navigate("/")}>
          Go Back Home
        </button>
      </div>
    </div>
  </div>
);
}

export default PostPage;