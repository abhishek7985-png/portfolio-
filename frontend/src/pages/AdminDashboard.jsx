import API, { IMAGE_URL } from "../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

export default function AdminDashboard() {
  const [tab, setTab] = useState("inquiries");
  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState({});
  const [editProfile, setEditProfile] = useState({});
  const [profileImg, setProfileImg] = useState(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
    liveLink: "",
    githubLink: "",
    category: "Web",
    image: null,
  });
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "",
    category: "Frontend",
  });
  const [reply, setReply] = useState({ id: "", text: "" });
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) return nav("/admin");
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [i, p, s, pr] = await Promise.all([
        API.get("/inquiry"),
        API.get("/project"),
        API.get("/skill"),
        API.get("/profile"),
      ]);
      setInquiries(i.data);
      setProjects(p.data);
      setSkills(s.data);
      setProfile(pr.data);
      setEditProfile(pr.data);
    } catch {
      localStorage.removeItem("token");
      nav("/admin");
    }
  };

  const notify = (m) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 3000);
  };

  // ---- PROJECTS ----
  const addProject = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(newProject).forEach((k) => {
      if (newProject[k] !== null) fd.append(k, newProject[k]);
    });
    try {
      await API.post("/project", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewProject({
        title: "",
        description: "",
        technologies: "",
        liveLink: "",
        githubLink: "",
        category: "Web",
        image: null,
      });
      notify("✅ Project added!");
      loadAll();
    } catch {
      notify("❌ Failed to add");
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await API.delete(`/project/${id}`);
    notify("🗑️ Deleted");
    loadAll();
  };

  const addSkill = async (e) => {
    e.preventDefault();
    await API.post("/skill", newSkill);
    setNewSkill({ name: "", level: "", category: "Frontend" });
    notify("✅ Skill added!");
    loadAll();
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Delete skill?")) return;
    await API.delete(`/skill/${id}`);
    loadAll();
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm("Delete inquiry?")) return;
    await API.delete(`/inquiry/${id}`);
    loadAll();
  };

  const sendReply = async (id) => {
    if (!reply.text.trim()) return notify("❌ Write reply first");
    try {
      await API.post(`/inquiry/${id}/reply`, { replyText: reply.text });
      notify("✅ Reply sent via email!");
      setReply({ id: "", text: "" });
      loadAll();
    } catch {
      notify("❌ Email failed — check .env credentials");
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(editProfile).forEach((k) => fd.append(k, editProfile[k] || ""));
    if (profileImg) fd.append("profileImage", profileImg);
    await API.put("/profile", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    notify("✅ Profile updated!");
    setProfileImg(null);
    loadAll();
  };

  const logout = () => {
    localStorage.removeItem("token");
    nav("/admin");
  };

  const S = {
    background: "#0a0a0f",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #22222e",
    color: "white",
    width: "100%",
    marginBottom: "12px",
    outline: "none",
  };
  const B = {
    padding: "10px 20px",
    background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  };
  const D = {
    padding: "6px 14px",
    background: "#ef4444",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    fontSize: "13px",
  };
  const CARD = {
    background: "#14141c",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #22222e",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "white",
        padding: "30px",
      }}
    >
      {msg && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#6366f1",
            padding: "12px 22px",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          {msg}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>🎛️ Admin Dashboard</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <a href="/" target="_blank" style={{ ...B, background: "#22222e" }}>
            👁️ View Site
          </a>
          <button onClick={logout} style={{ ...B, background: "#ef4444" }}>
            Logout
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        {[
          { k: "inquiries", l: `📩 Inquiries (${inquiries.length})` },
          { k: "projects", l: `🚀 Projects (${projects.length})` },
          { k: "skills", l: `💡 Skills (${skills.length})` },
          { k: "profile", l: "👤 Profile" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            style={{
              padding: "12px 22px",
              background: tab === t.k ? "#6366f1" : "#14141c",
              border: "1px solid #22222e",
              borderRadius: "10px",
              color: "white",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* INQUIRIES TAB */}
      {tab === "inquiries" && (
        <div>
          {inquiries.length === 0 && (
            <p style={{ color: "#666" }}>No inquiries yet.</p>
          )}
          {inquiries.map((i) => (
            <div key={i._id} style={{ ...CARD, marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: "#6366f1", marginBottom: "8px" }}>
                    {i.subject}
                  </h3>
                  <p
                    style={{
                      color: "#888",
                      fontSize: "14px",
                      marginBottom: "10px",
                    }}
                  >
                    <b>From:</b> {i.name} —{" "}
                    <a href={`mailto:${i.email}`} style={{ color: "#8b5cf6" }}>
                      {i.email}
                    </a>
                  </p>
                  <p style={{ marginBottom: "10px", lineHeight: "1.6" }}>
                    {i.message}
                  </p>
                  <small style={{ color: "#555" }}>
                    {new Date(i.createdAt).toLocaleString()}
                  </small>
                  {i.status === "replied" && (
                    <div
                      style={{
                        marginTop: "15px",
                        padding: "12px",
                        background: "rgba(34,197,94,0.1)",
                        borderLeft: "3px solid #22c55e",
                        borderRadius: "6px",
                      }}
                    >
                      <b style={{ color: "#22c55e" }}>✅ Replied:</b>
                      <p
                        style={{
                          color: "#aaa",
                          fontSize: "14px",
                          marginTop: "5px",
                        }}
                      >
                        {i.reply}
                      </p>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginLeft: "20px",
                  }}
                >
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      background:
                        i.status === "replied"
                          ? "#22c55e"
                          : i.status === "read"
                            ? "#eab308"
                            : "#6366f1",
                      textAlign: "center",
                    }}
                  >
                    {i.status}
                  </span>
                  <button onClick={() => deleteInquiry(i._id)} style={D}>
                    Delete
                  </button>
                </div>
              </div>

              {reply.id === i._id ? (
                <div style={{ marginTop: "20px" }}>
                  <textarea
                    value={reply.text}
                    onChange={(e) =>
                      setReply({ ...reply, text: e.target.value })
                    }
                    placeholder="Write your reply..."
                    rows="4"
                    style={{ ...S, resize: "vertical" }}
                  ></textarea>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => sendReply(i._id)} style={B}>
                      Send Reply ✉️
                    </button>
                    <button
                      onClick={() => setReply({ id: "", text: "" })}
                      style={{ ...B, background: "#22222e" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReply({ id: i._id, text: "" })}
                  style={{ ...B, marginTop: "15px" }}
                >
                  Reply via Email
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS TAB */}
      {tab === "projects" && (
        <div>
          <div style={CARD}>
            <h2 style={{ marginBottom: "20px" }}>➕ Add New Project</h2>
            <form onSubmit={addProject}>
              <input
                style={S}
                placeholder="Project Title"
                required
                value={newProject.title}
                onChange={(e) =>
                  setNewProject({ ...newProject, title: e.target.value })
                }
              />
              <textarea
                style={{ ...S, resize: "vertical" }}
                rows="3"
                placeholder="Description"
                required
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
              <input
                style={S}
                placeholder="Technologies (comma separated: React, Node, MongoDB)"
                value={newProject.technologies}
                onChange={(e) =>
                  setNewProject({ ...newProject, technologies: e.target.value })
                }
              />
              <input
                style={S}
                placeholder="Live Demo Link (https://...)"
                value={newProject.liveLink}
                onChange={(e) =>
                  setNewProject({ ...newProject, liveLink: e.target.value })
                }
              />
              <input
                style={S}
                placeholder="GitHub Link (https://...)"
                value={newProject.githubLink}
                onChange={(e) =>
                  setNewProject({ ...newProject, githubLink: e.target.value })
                }
              />
              <input
                style={S}
                placeholder="Category (Web / App / Other)"
                value={newProject.category}
                onChange={(e) =>
                  setNewProject({ ...newProject, category: e.target.value })
                }
              />
              <label
                style={{ display: "block", marginBottom: "8px", color: "#888" }}
              >
                Project Image:
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) =>
                  setNewProject({ ...newProject, image: e.target.files[0] })
                }
                style={{ marginBottom: "15px", color: "#ccc" }}
              />
              <button type="submit" style={B}>
                Add Project
              </button>
            </form>
          </div>

          <h2 style={{ margin: "40px 0 20px" }}>All Projects</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
              gap: "18px",
            }}
          >
            {projects.map((p) => (
              <div key={p._id} style={CARD}>
                {p.image && (
                  <img
                    src={`http://localhost:5000${p.image}`}
                    alt={p.title}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}
                <h4 style={{ marginTop: "12px" }}>{p.title}</h4>
                <p style={{ color: "#888", fontSize: "13px", margin: "8px 0" }}>
                  {p.description?.slice(0, 80)}...
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {p.liveLink && (
                    <a
                      href={p.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "12px", color: "#6366f1" }}
                    >
                      🔗 Live
                    </a>
                  )}
                  {p.githubLink && (
                    <a
                      href={p.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "12px", color: "#6366f1" }}
                    >
                      💻 Code
                    </a>
                  )}
                </div>
                <button
                  onClick={() => deleteProject(p._id)}
                  style={{ ...D, marginTop: "12px" }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SKILLS TAB */}
      {tab === "skills" && (
        <div>
          <div style={CARD}>
            <h2 style={{ marginBottom: "20px" }}>➕ Add New Skill</h2>
            <form onSubmit={addSkill}>
              <input
                style={S}
                placeholder="Skill Name (e.g. React.js)"
                required
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
              />
              <input
                style={S}
                type="number"
                placeholder="Level (0-100)"
                min="0"
                max="100"
                required
                value={newSkill.level}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, level: e.target.value })
                }
              />
              <input
                style={S}
                placeholder="Category (Frontend / Backend / Database / Tools)"
                value={newSkill.category}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, category: e.target.value })
                }
              />
              <button type="submit" style={B}>
                Add Skill
              </button>
            </form>
          </div>

          <h2 style={{ margin: "40px 0 20px" }}>All Skills</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
              gap: "15px",
            }}
          >
            {skills.map((sk) => (
              <div key={sk._id} style={CARD}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h4>{sk.name}</h4>
                  <span style={{ color: "#6366f1", fontWeight: "700" }}>
                    {sk.level}%
                  </span>
                </div>
                <p style={{ color: "#666", fontSize: "12px", margin: "5px 0" }}>
                  {sk.category}
                </p>
                <div
                  style={{
                    background: "#22222e",
                    height: "6px",
                    borderRadius: "5px",
                    overflow: "hidden",
                    margin: "10px 0",
                  }}
                >
                  <div
                    style={{
                      width: `${sk.level}%`,
                      height: "100%",
                      background: "linear-gradient(90deg,#6366f1,#ec4899)",
                    }}
                  ></div>
                </div>
                <button
                  onClick={() => deleteSkill(sk._id)}
                  style={{ ...D, marginTop: "10px" }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {tab === "profile" && (
        <div style={CARD}>
          <h2 style={{ marginBottom: "20px" }}>👤 Edit Profile</h2>
          <form onSubmit={updateProfile}>
            <input
              style={S}
              placeholder="Full Name"
              value={editProfile.name || ""}
              onChange={(e) =>
                setEditProfile({ ...editProfile, name: e.target.value })
              }
            />
            <input
              style={S}
              placeholder="Title (e.g. Full Stack MERN Developer)"
              value={editProfile.title || ""}
              onChange={(e) =>
                setEditProfile({ ...editProfile, title: e.target.value })
              }
            />
            <textarea
              style={{ ...S, resize: "vertical" }}
              rows="3"
              placeholder="Bio"
              value={editProfile.bio || ""}
              onChange={(e) =>
                setEditProfile({ ...editProfile, bio: e.target.value })
              }
            />
            <input
              style={S}
              placeholder="Email"
              value={editProfile.email || ""}
              onChange={(e) =>
                setEditProfile({ ...editProfile, email: e.target.value })
              }
            />
            <input
              style={S}
              placeholder="Phone"
              value={editProfile.phone || ""}
              onChange={(e) =>
                setEditProfile({ ...editProfile, phone: e.target.value })
              }
            />
            <input
              style={S}
              placeholder="Location"
              value={editProfile.location || ""}
              onChange={(e) =>
                setEditProfile({ ...editProfile, location: e.target.value })
              }
            />
            <input
              style={S}
              placeholder="GitHub URL"
              value={editProfile.github || ""}
              onChange={(e) =>
                setEditProfile({ ...editProfile, github: e.target.value })
              }
            />
            <input
              style={S}
              placeholder="LinkedIn URL"
              value={editProfile.linkedin || ""}
              onChange={(e) =>
                setEditProfile({ ...editProfile, linkedin: e.target.value })
              }
            />
            <input
              style={S}
              placeholder="Twitter URL"
              value={editProfile.twitter || ""}
              onChange={(e) =>
                setEditProfile({ ...editProfile, twitter: e.target.value })
              }
            />
            <label
              style={{ display: "block", marginBottom: "8px", color: "#888" }}
            >
              Profile Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImg(e.target.files[0])}
              style={{ marginBottom: "15px", color: "#ccc" }}
            />
            {profile.profileImage && (
              <img
                src={`http://localhost:5000${profile.profileImage}`}
                alt="current"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "15px",
                }}
              />
            )}
            <button type="submit" style={B}>
              Update Profile
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
