import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import LoginForm from "./components/LoginForm";
import HomePage from "./pages/HomePage";
import IdeaForm from "./pages/IdeaForm";
import PostPage from "./pages/PostPage"; // Import PostPage for dynamic routing

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <LoginForm />;
};

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error.message}</div>;

  return (
    <Router>
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