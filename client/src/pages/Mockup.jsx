import axios from "axios";
import { useEffect, useState } from "react";
import "./Mockup.css";

function Mockup() {
  const [mockups, setMockups] = useState([]);
  const [comments, setComments] = useState({});
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/mockups")
      .then((res) => setMockups(res.data))
      .catch(() => alert("Failed to load mockups"));
  }, []);

  const handleCommentChange = (mockupId, text) => {
    setComments({ ...comments, [mockupId]: text });
  };

  const handleVote = async (mockup_id, vote_value, commentOverride = null) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first.");
    const user_id = JSON.parse(atob(token.split(".")[1]))?.id;
    const comment =
      commentOverride !== null ? commentOverride : comments[mockup_id] || "";

    try {
      await axios.post("http://localhost:5000/api/mockups/vote", {
        user_id,
        mockup_id,
        vote_value,
        comment,
      });
      alert("Submitted!");
    } catch (err) {
      alert("Failed to submit");
    }
  };

  const handleSubmitComment = (mockup_id) => {
    const comment = comments[mockup_id];
    if (!comment || comment.trim() === "") {
      alert("Please enter a comment before submitting.");
      return;
    }
    handleVote(mockup_id, "comment_only", comment);
  };

  const handleShare = (mockup) => {
    const shareText = `Check out this feature mockup on SnapBack: ${mockup.title}`;
    const shareUrl = `https://snapback.com/mockup/${mockup.id}`;

    if (navigator.share) {
      navigator
        .share({
          title: mockup.title,
          text: shareText,
          url: shareUrl,
        })
        .catch((err) => console.error("Share failed:", err));
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        shareText + " " + shareUrl
      )}`;
      const instagramMessage = `Check this out on SnapBack!\n${shareUrl}`;
      const youtubePrompt = `#SnapBackFeedback ${shareUrl}`;

      alert(
        `Share:\n\nWhatsApp: ${whatsappUrl}\nInstagram: ${instagramMessage}\nYouTube: ${youtubePrompt}`
      );
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <div className="mockup-container">
      <h2 className="mockup-heading">Mockup Voting</h2>

      <div className="mockup-grid">
        {mockups.map((mockup) => (
          <div key={mockup.id} className="mockup-card">
            <div className="mockup-top-bar">
              <span
                className="eye-icon"
                title="View full image"
                onClick={() =>
                  setModalImage(`http://localhost:5000${mockup.image_url}`)
                }
              >
                👁️
              </span>
            </div>

            <img
              src={`http://localhost:5000${mockup.image_url}`}
              alt={mockup.title}
              className="mockup-image"
            />
            <h3 className="mockup-title">{mockup.title}</h3>

            <div className="vote-buttons">
              <button
                onClick={() => handleVote(mockup.id, "yes")}
                className="btn vote"
              >
                👍 Like
              </button>
              <button
                onClick={() => handleVote(mockup.id, "no")}
                className="btn skip"
              >
                👎 Unlike
              </button>
              <button onClick={() => handleShare(mockup)} className="btn share">
                📤 Share
              </button>
            </div>

            <textarea
              placeholder="Leave a comment..."
              value={comments[mockup.id] || ""}
              onChange={(e) => handleCommentChange(mockup.id, e.target.value)}
              className="comment-box"
              rows={3}
            />

            <button
              className="btn comment"
              onClick={() => handleSubmitComment(mockup.id)}
            >
              Submit Comment
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalImage && (
        <div className="image-modal" onClick={() => setModalImage(null)}>
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setModalImage(null)}>
              ✖
            </button>
            <img src={modalImage} alt="Enlarged" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Mockup;
