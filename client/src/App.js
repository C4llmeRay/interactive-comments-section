import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Comments from "./Components/Comments"
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import UserComments from "./Components/UserComments";
import Profile from "./Components/Profile";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import CommentSection from "./Components/CommentSection";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/commentSection" element={<CommentSection />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/userComments" element={<UserComments />} />
            <Route path="/profile" element={<Profile />} />

          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
