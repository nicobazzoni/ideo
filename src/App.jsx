import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import LoginForm from "./components/LoginForm";
import HomePage from "./pages/HomePage";
import IdeaForm from "./pages/IdeaForm"; // Import your IdeaForm component

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error.message}</div>;

  return (
    <Router>
      {user ? (
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/post" element={<IdeaForm />} />
        </Routes>
      ) : (
        <LoginForm />
      )}
    </Router>
  );
};

export default App;