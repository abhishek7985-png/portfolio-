import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      nav("/admin/dashboard");
    } catch {
      setErr("Invalid credentials");
    }
  };

  const s = {
    width: "100%",
    padding: "13px",
    marginBottom: "15px",
    background: "#0a0a0f",
    border: "1px solid #22222e",
    borderRadius: "8px",
    color: "white",
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#14141c",
          padding: "40px",
          borderRadius: "15px",
          width: "380px",
          border: "1px solid #22222e",
        }}
      >
        <h2 style={{ marginBottom: "8px", textAlign: "center" }}>
          🔐 Admin Login
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "25px",
            fontSize: "14px",
          }}
        >
          Only for portfolio owner
        </p>
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={s}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={s}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "13px",
            background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Login
        </button>
        {err && (
          <p
            style={{ color: "#ef4444", marginTop: "10px", textAlign: "center" }}
          >
            {err}
          </p>
        )}
      </form>
    </div>
  );
}
