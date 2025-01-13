import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";
import { useState, useEffect } from "react";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, [id]);

  if (loading) return <div>Loading post...</div>;

  if (!post) return <div>Post not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <img
        src={post.attachment || '/PLANE2.png'  }
        alt={post.title || "Post Image"}
        className="w-full h-auto rounded my-4 "
        onError={(e) => (e.target.src = "/PLANE2.png")}
      />
      <p className="text-gray-700">{post.content}</p>
      <p className="text-sm text-gray-500 mt-4">
        Posted by {post.userName || "Anonymous"} on{" "}
        {new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}
      </p>
    </div>
  );
};

export default PostPage;