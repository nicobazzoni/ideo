import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import LoginForm from "./components/LoginForm";
import HomePage from "./pages/HomePage";
import IdeaForm from "./pages/IdeaForm";
import PostPage from "./pages/PostPage"; // Import PostPage for dynamic routing
import { ToastContainer } from "react-toastify"; // ✅ Import ToastContainer
import "react-toastify/dist/ReactToastify.css";
const ProtectedRoute = ({ user, children }) => {
  return user ? children : <LoginForm />;
};

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error.message}</div>;

  return (
    <Router>
       <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <HomePage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post"
          element={
            <ProtectedRoute user={user}>
              <IdeaForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute user={user}>
              <PostPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;