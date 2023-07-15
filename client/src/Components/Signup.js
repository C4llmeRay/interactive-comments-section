import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signup } from "../api";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function toLogin() {
    navigate("/login");
  }

  function handleSignup() {
    signup(name, email, username, password)
      .then(({ data }) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/");
        } else {
          alert(data.msg);
        }
      })
      .catch((error) => {
        console.error("Error signing up:", error);
      });
  }

  return (
    <div className="signup-login-container">
      <h1 className="app-title">Comment Section</h1>
      <div className="input-button-container">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="signup-login-btn" onClick={handleSignup}>
          Signup
        </button>
      </div>
      <p className="info-text">
        If you have an account{" "}
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" className="signup-login-anchor" onClick={toLogin}>
      Login
      </a>
      </p>
    </div>
  );
}

export default Signup;

