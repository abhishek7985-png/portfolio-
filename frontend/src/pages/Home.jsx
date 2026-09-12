import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import "../styles/Home.css";

const API = "http://localhost:5000/api";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/profile`).then((r) => setProfile(r.data));
    axios.get(`${API}/project`).then((r) => setProjects(r.data));
    axios.get(`${API}/skill`).then((r) => setSkills(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/inquiry`, form);
      setStatus("✅ Message sent! I will reply soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("❌ Something went wrong. Try again.");
    }
    setLoading(false);
    setTimeout(() => setStatus(""), 4000);
  };

  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="home">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="container nav-inner">
          <h2 className="logo">
            {profile.name?.split(" ")[0] || "Port"}
            <span>folio</span>
          </h2>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#skills">Skills</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
          {/* 👇 ADMIN BUTTON */}
          <button
            className="admin-btn"
            onClick={() => navigate("/admin")}
            title="Admin Login"
          >
            🔐 Admin
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="container hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="greet">👋 Hello, I'm</p>
            <h1>{profile.name || "Your Name"}</h1>
            <h3>
              {profile.title || "Full Stack"} <span>Developer</span>
            </h3>
            <p className="desc">
              {profile.bio ||
                "I build modern, responsive and scalable web applications."}
            </p>
            <div className="hero-btns">
              <a href="#contact" className="btn primary">
                Hire Me 🚀
              </a>
              <a href="#projects" className="btn outline">
                View Work
              </a>
            </div>
            <div className="socials">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer">
                  <FaGithub />
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <FaLinkedin />
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noreferrer">
                  <FaTwitter />
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`}>
                  <FaEnvelope />
                </a>
              )}
            </div>
          </motion.div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glow-circle"></div>
            {profile.profileImage && (
              <img
                src={`http://localhost:5000${profile.profileImage}`}
                alt="profile"
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section">
        <div className="container">
          <h2 className="section-title">
            About <span>Me</span>
          </h2>
          <div className="about-grid">
            <div className="about-text">
              <p>
                {profile.bio ||
                  "Passionate MERN stack developer specialized in building scalable web apps with modern technologies."}
              </p>
              <div className="info-list">
                {profile.email && (
                  <div>
                    <FaEnvelope /> {profile.email}
                  </div>
                )}
                {profile.phone && (
                  <div>
                    <FaPhone /> {profile.phone}
                  </div>
                )}
                {profile.location && (
                  <div>
                    <FaMapMarkerAlt /> {profile.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section">
        <div className="container">
          <h2 className="section-title">
            My <span>Skills</span>
          </h2>
          {Object.keys(grouped).map((cat) => (
            <div key={cat} className="skill-group">
              <h3 className="skill-category">{cat}</h3>
              <div className="skills-grid">
                {grouped[cat].map((s) => (
                  <motion.div
                    key={s._id}
                    className="skill-card"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="skill-head">
                      <h4>{s.name}</h4>
                      <span>{s.level}%</span>
                    </div>
                    <div className="bar">
                      <div style={{ width: `${s.level}%` }}></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section">
        <div className="container">
          <h2 className="section-title">
            My <span>Projects</span>
          </h2>
          <div className="projects-grid">
            {projects.map((p) => (
              <motion.div
                key={p._id}
                className="project-card"
                whileHover={{ y: -8 }}
              >
                {p.image && (
                  <div className="project-img">
                    <img
                      src={`http://localhost:5000${p.image}`}
                      alt={p.title}
                    />
                  </div>
                )}
                <div className="project-info">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="tech-tags">
                    {p.technologies?.map((t, i) => (
                      <span key={i}>{t}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    {p.liveLink && (
                      <a
                        href={p.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="link-btn"
                      >
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    )}
                    {p.githubLink && (
                      <a
                        href={p.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="link-btn"
                      >
                        <FaGithub /> Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="container">
          <h2 className="section-title">
            Get In <span>Touch</span>
          </h2>
          <p className="contact-sub">
            Have a project in mind? Let's work together!
          </p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="row">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <textarea
              rows="6"
              placeholder="Tell me about your project..."
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            ></textarea>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Sending..." : "Send Message ✉️"}
            </button>
            {status && <p className="status">{status}</p>}
          </form>
        </div>
      </section>

      <footer className="bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          ```
          {/* Main Footer */}
          <div className="py-12 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Profile */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg">
                  {(profile.name || "A").charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    {profile.name || "Abhishek Mishra"}
                  </h2>

                  <p className="text-sm text-blue-400">Full Stack Developer</p>
                </div>
              </div>

              <p className="text-slate-400 leading-7 max-w-lg">
                I build modern, responsive and scalable web applications using
                MERN Stack and PHP/Laravel. Passionate about creating clean user
                experiences and solving real-world problems through technology.
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mt-5">
                {["React", "Node.js", "MongoDB", "PHP", "Laravel", "MySQL"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs
                       bg-slate-900 border border-slate-800
                       text-slate-400"
                    >
                      {tech}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* Links */}
            <div className="md:flex md:justify-end">
              <div>
                <h3 className="text-lg font-semibold mb-5">Let's Connect</h3>

                <div className="space-y-3">
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-slate-400
                       hover:text-white transition-all duration-200"
                    >
                      <span
                        className="w-9 h-9 rounded-lg bg-slate-900
                             border border-slate-800
                             flex items-center justify-center"
                      >
                        <i className="fab fa-github"></i>
                      </span>

                      <span>GitHub</span>
                    </a>
                  )}

                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-slate-400
                       hover:text-white transition-all duration-200"
                    >
                      <span
                        className="w-9 h-9 rounded-lg bg-slate-900
                             border border-slate-800
                             flex items-center justify-center"
                      >
                        <i className="fab fa-linkedin-in"></i>
                      </span>

                      <span>LinkedIn</span>
                    </a>
                  )}

                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-3 text-slate-400
                       hover:text-white transition-all duration-200"
                    >
                      <span
                        className="w-9 h-9 rounded-lg bg-slate-900
                             border border-slate-800
                             flex items-center justify-center"
                      >
                        <i className="fas fa-envelope"></i>
                      </span>

                      <span>{profile.email}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Bottom Footer */}
          <div
            className="border-t border-slate-800 py-5
                flex flex-col sm:flex-row
                items-center justify-between gap-3"
          >
            <p className="text-sm text-slate-500 text-center sm:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="text-slate-300">
                {profile.name || "Abhishek Mishra"}
              </span>
              . All rights reserved.
            </p>

            <p className="text-sm text-slate-500">
              Built with <span className="text-red-400">♥</span> using MERN &
              PHP
            </p>
          </div>
          ```
        </div>
      </footer>
    </div>
  );
}
