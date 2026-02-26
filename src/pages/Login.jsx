// src/pages/Login.jsx
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import logo from "../assets/StreamList1.png"; // reuse existing logo
import "../cart/cart.css";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthed } = useAuth();

  React.useEffect(() => {
    if (isAuthed) navigate("/", { replace: true });
  }, [isAuthed, navigate]);

  return (
    <section className="login-page">
      <div className="login-card">

        <img
          src={logo}
          alt="StreamList Logo"
          className="login-logo"
        />

        <h1 className="login-title">EZTechMovie Secure Login</h1>

        <p className="login-subtitle">
          Sign in with Google to access the application.
        </p>

        <div className="login-google-wrap">
          <GoogleLogin
            theme="filled_black"
            size="large"
            shape="pill"
            text="signin_with"
            logo_alignment="left"
            onSuccess={(credentialResponse) => {
              const payload = parseJwt(credentialResponse.credential);
              if (!payload) {
                alert("Google Sign In returned an invalid credential.");
                return;
              }

              login({
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
              });

              navigate("/", { replace: true });
            }}
            onError={() => {
              alert("Google Sign In failed. Please try again.");
            }}
          />
        </div>

        <p className="login-footnote">
          Access is limited to approved test users during development.
        </p>

      </div>
    </section>
  );
}