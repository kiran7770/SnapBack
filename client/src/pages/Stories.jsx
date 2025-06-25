import axios from "axios";
import { useEffect, useState } from "react";
import "./Stories.css";

function Stories() {
  const [mockups, setMockups] = useState([]);
  const [selectedMockup, setSelectedMockup] = useState("");
  const [storyText, setStoryText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [storyList, setStoryList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/mockups")
      .then((res) => setMockups(res.data));
    axios
      .get("http://localhost:5000/api/stories")
      .then((res) => setStoryList(res.data));
  }, [submitted]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first.");
    const user_id = JSON.parse(atob(token.split(".")[1])).id;

    if (!storyText || !selectedMockup) {
      alert("Please write a story and select a mockup.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/stories", {
        user_id,
        mockup_id: selectedMockup,
        story_text: storyText,
      });
      setSubmitted(!submitted);
      setStoryText("");
      setSelectedMockup("");
    } catch (err) {
      alert("Error submitting story.");
    }
  };

  return (
    <div className="story-container">
      <h2 className="story-heading">Share Your Story</h2>

      <select
        className="story-select"
        value={selectedMockup}
        onChange={(e) => setSelectedMockup(e.target.value)}
      >
        <option value="">Select a Feature</option>
        {mockups.map((m) => (
          <option key={m.id} value={m.id}>
            {m.title}
          </option>
        ))}
      </select>

      <textarea
        placeholder="How would you use this feature? Tell us your thoughts!"
        className="story-textarea"
        rows={4}
        value={storyText}
        onChange={(e) => setStoryText(e.target.value)}
      />

      <button onClick={handleSubmit} className="btn submit-btn">
        Submit Story
      </button>

      <h3 className="story-subheading">Submitted Stories</h3>
      <ul className="story-list">
        {storyList.map((s, index) => (
          <li key={index} className="story-card">
            <p className="story-text">"{s.story_text}"</p>
            <p className="story-meta">Feature: {s.title}</p>
            <p className="story-date">
              Posted: {new Date(s.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Stories;
