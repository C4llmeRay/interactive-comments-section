import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../api";
import '../Styles/Login.css'

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function toSignup() {
    navigate("/signup");
  }

  function handleLogin() {
    login(email, password)
      .then(({ data }) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/comments");
        } else {
          alert(data.msg);
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  }

  return (
    <div className="signup-login-container">
      <h1 className="app-title">LOGIN</h1>
      <div className="input-button-container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="signup-login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
      <p className="info-text">
        If you do not have an account{" "}
        <a className="signup-login-anchor" onClick={toSignup}>
          Signup Here
        </a>
      </p>
    </div>
  );
}

export default Login;
