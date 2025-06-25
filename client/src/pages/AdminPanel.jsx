import axios from "axios";
import { useEffect, useState } from "react";
import "./AdminPanel.css";

function AdminPanel() {
  const [mockups, setMockups] = useState([]);
  const [form, setForm] = useState({ title: "", image_url: "", id: null });
  const [file, setFile] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const loadMockups = () => {
    axios
      .get("http://localhost:5000/api/mockups")
      .then((res) => setMockups(res.data))
      .catch(() => alert("Failed to load mockups"));
  };

  useEffect(() => {
    loadMockups();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!form.title) return alert("Title is required.");

    if (isEdit) {
      if (!window.confirm("Do you want to update this mockup?")) return;

      if (file) {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("image", file);

        axios
          .post("http://localhost:5000/api/mockups/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then(() => {
            alert("Mockup updated with new image");
            resetForm();
            loadMockups();
          })
          .catch(() => alert("Update failed"));
      } else {
        axios
          .put(`http://localhost:5000/api/mockups/${form.id}`, {
            title: form.title,
            image_url: form.image_url,
          })
          .then(() => {
            alert("Mockup updated");
            resetForm();
            loadMockups();
          })
          .catch(() => alert("Update failed"));
      }
    } else {
      if (!file) return alert("Image is required.");
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("image", file);

      axios
        .post("http://localhost:5000/api/mockups/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          alert("Mockup added");
          resetForm();
          loadMockups();
        })
        .catch(() => alert("Upload failed"));
    }
  };

  const handleEdit = (mockup) => {
    setForm({
      title: mockup.title,
      image_url: mockup.image_url,
      id: mockup.id,
    });
    setFile(null);
    setIsEdit(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this mockup?")) return;
    axios
      .delete(`http://localhost:5000/api/mockups/${id}`)
      .then(() => {
        alert("Mockup deleted");
        loadMockups();
      })
      .catch(() => alert("Delete failed"));
  };

  const resetForm = () => {
    setForm({ title: "", image_url: "", id: null });
    setFile(null);
    setIsEdit(false);
  };

  return (
    <div className="admin-container">
      <h2 className="admin-heading">🛠 Admin Panel</h2>

      <div className="admin-form">
        <input
          name="title"
          placeholder="Mockup Title"
          value={form.title}
          onChange={handleChange}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {/* Preview selected OR existing image */}
        <div className="image-preview">
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="New preview"
              className="mockup-image"
            />
          ) : isEdit && form.image_url ? (
            <img
              src={`http://localhost:5000${form.image_url}`}
              alt="Current"
              className="mockup-image"
            />
          ) : null}
        </div>

        <button
          onClick={handleSubmit}
          className={isEdit ? "btn warning" : "btn primary"}
        >
          {isEdit ? "Update Mockup" : "Add Mockup"}
        </button>
      </div>

      <h3 className="mockup-section-title">Existing Mockups</h3>
      <ul className="mockup-list">
        {mockups.map((m) => (
          <li key={m.id} className="mockup-item">
            <div className="mockup-info">
              <p className="mockup-title">{m.title}</p>
              <p className="mockup-url">{m.image_url}</p>
              <img
                src={`http://localhost:5000${m.image_url}`}
                alt={m.title}
                className="mockup-image"
              />
            </div>
            <div className="mockup-actions">
              <button onClick={() => handleEdit(m)} className="btn edit">
                Edit
              </button>
              <button onClick={() => handleDelete(m.id)} className="btn delete">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
