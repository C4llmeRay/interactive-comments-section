import { BrowserRouter as Router, Route, Routes, Navigate  } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import UserComments from "./Components/UserComments";
import Profile from "./Components/Profile";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import CommentSection from "./Components/CommentSection";
import Notification from "./Components/Notification";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/login" element={<Login />} />
            <Route path="/commentSection" element={<CommentSection />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/userComments" element={<UserComments />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/*" element={<Navigate to="/" />} />

          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
