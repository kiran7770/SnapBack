import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // External CSS file

function Home() {
  const [mockups, setMockups] = useState([]);
  const [stories, setStories] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/mockups")
      .then((res) => setMockups(res.data.slice(0, 3)))
      .catch(() => alert("Failed to load mockups"));

    axios
      .get("http://localhost:5000/api/stories")
      .then((res) => setStories(res.data.slice(0, 3)))
      .catch(() => alert("Failed to load stories"));
  }, []);

  return (
    <div className="home-container">
      {/* Hero */}
      <header className="hero">
        <h1>Welcome to SnapBack</h1>
        <p>
          Shape the future of social media by voting, commenting, and sharing
          your ideas!
        </p>
        {!token && (
          <div className="hero-buttons">
            <Link to="/login" className="btn primary">
              Login
            </Link>
            <Link to="/register" className="btn secondary">
              Register
            </Link>
          </div>
        )}
      </header>

      {/* Info */}
      <section className="info">
        <h2>Why SnapBack?</h2>
        <p>
          SnapBack is a user-first platform where you help decide what features
          social media should have. Through mockups, stories, and votes, your
          voice drives better digital design.
        </p>
      </section>

      {/* Mockup Previews */}
      <section className="mockup-preview">
        <h2>Featured Mockups</h2>
        <div className="mockup-list">
          {mockups.map((m) => (
            <div className="mockup-card" key={m.id}>
              <img src={`http://localhost:5000${m.image_url}`} alt={m.title} />
              <h3>{m.title}</h3>
              <p className="note">Login to vote or comment</p>
            </div>
          ))}
        </div>
      </section>

      {/* User Stories */}
      <section className="stories-preview">
        <h2>What People Are Saying</h2>
        <ul className="story-list">
          {stories.map((s, index) => (
            <li key={index} className="story-card">
              <p className="quote">"{s.story_text}"</p>
              <p className="feature-label">Feature: {s.title}</p>
              <p className="story-date">
                {new Date(s.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      {!token && (
        <section className="cta">
          <h2>Want to participate?</h2>
          <p>
            <Link to="/login">Login</Link> or{" "}
            <Link to="/register">Register</Link> to start voting and sharing
            your story.
          </p>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} SnapBack Project | Built for MMD901
        </p>
      </footer>
    </div>
  );
}

export default Home;
