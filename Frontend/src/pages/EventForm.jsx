import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as eventApi from "../api/event";
import bgImg from "../assets/1.png";

// Data for the dependent dropdowns
const categoryMap = {
  "🎭 Cultural": ["Dance", "Music", "Drama / Theatre", "Literature / Poetry", "Art & Exhibitions", "Traditional / Folk"],
  "🏆 Sports": ["Cricket", "Football", "Basketball", "Esports / Gaming", "Athletics", "Adventure / Outdoor"],
  "💻 Technology": ["Hackathons", "Workshops", "Conferences", "Web3 / AI / ML", "Startups & Innovation", "Robotics / IoT"],
  "❤️ Causes": ["Charity / Fundraisers", "Environment & Sustainability", "Social Awareness", "Health & Wellness", "Volunteering", "Education Drives"],
  "🎬 Entertainment": ["Movies / Screenings", "Comedy Shows", "Concerts", "Festivals", "Nightlife / Parties", "Celebrity Meets"],
  "💼 Business": ["Networking Events", "Investor Meets", "Career Fairs", "Leadership Summits", "Product Launches", "Workshops / Trainings"],
  "🕉️ Spirituality": ["Meditation / Yoga", "Religious Gatherings", "Retreats", "Spiritual Talks", "Community Service", "Festivals"]
};

export default function EventForm() {
  const navigate = useNavigate();
  
  const [previewImage, setPreviewImage] = useState("");
  const [modalImage, setModalImage] = useState(null);

  const [form, setForm] = useState({
    event_name: "",
    event_date: "",
    event_time: "",
    cost: "",
    event_image: "",
    location: "",
    contact: "",
    category: "",
    sub_category: "",
    status: "Upcoming",
    priority: "Low",
    create_at: new Date().toISOString(),
    social_links: {
      instagram: "",
      website: ""
    }
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    // If the category is changed, reset the sub_category
    if (name === "category") {
      setForm(prev => ({
        ...prev,
        category: value,
        sub_category: "" // Reset on category change
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = e => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
        setForm(prev => ({ ...prev, [name]: file }));
        if (previewImage) URL.revokeObjectURL(previewImage);
        setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSocialChange = (platform, value) => {
    setForm(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [platform]: value }
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      
      const payload = {
        ...form,
        priority: form.priority === 'High'
      };

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "social_links") {
          formData.append(key, JSON.stringify(value));
        } else if (value) {
          formData.append(key, value);
        }
      });
      await eventApi.createEvent(formData);
      navigate("/events");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ef-section">
      <style>{`
        :root {
          --royal-red: #7A133D;
          --heritage-red: #C62039;
          --royal-gold: #D2A857;
          --royal-cream: #FFF9F2;
          --sage: #8BBAA1;
          --teal: #056675;
        }
        .ef-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url(${bgImg}), linear-gradient(135deg, rgba(210,168,87,0.7), rgba(139,186,161,0.7), rgba(5,102,117,0.7));
          background-size: cover;
          background-position: center;
          padding: 1rem;
          font-family: "Merriweather", "Georgia", serif;
        }
        .ef-card {
          width: 100%;
          max-width: 24rem;
          background: #abdfc461;
          border-radius: 1.25rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          padding: 1.75rem 1.25rem;
          display: grid;
          gap: 1rem;
        }
        .ef-title { text-align: left; font-size: 1.75rem; font-weight: 900; color: var(--heritage-red); }
        .ef-header { display: flex; align-items: center; margin-bottom: 1rem; }
        .ef-field { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.875rem; font-weight: 600; color: var(--royal-red); }
        .ef-field input, .ef-field select { border: 2px solid transparent; border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.9rem; transition: border-color 0.2s, box-shadow 0.2s; }
        .ef-field input:focus, .ef-field select:focus { border-color: var(--royal-gold); outline: none; box-shadow: 0 0 0 3px rgba(210,168,87,0.35); }
        .ef-error { color: #b91c1c; text-align: center; font-weight: 600; font-size: 0.875rem; }
        .ef-btn { background: var(--heritage-red); color: #fff; border: none; border-radius: 0.5rem; padding: 0.6rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
        .ef-btn:hover { background: var(--royal-red); }
        .ef-btn:disabled { opacity: 0.6; cursor: default; }
        .back-btn { background: none; border: none; color: var(--heritage-red); font-weight: 700; font-size: 1rem; cursor: pointer; margin-right: 1rem; transition: color 0.2s; }
        .back-btn:hover { color: var(--teal); }

        /* File Upload & Modal Styles */
        .file-upload-wrapper { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.25rem; }
        .file-input-hidden { display: none; }
        .file-input-label { background-color: var(--sage); color: white; padding: 0.5rem 0.8rem; border-radius: 0.5rem; cursor: pointer; font-weight: 600; transition: background-color 0.2s; white-space: nowrap; }
        .file-input-label:hover { background-color: var(--teal); }
        .view-btn { background-color: var(--royal-gold); color: #fff; border: none; border-radius: 0.4rem; padding: 0.4rem 0.7rem; font-size: 0.8rem; cursor: pointer; transition: background-color 0.2s; }
        .view-btn:hover { background-color: #b99143; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 5px 15px rgba(0,0,0,0.3); text-align: center; }
        .modal-content img { max-width: 80vw; max-height: 80vh; display: block; margin-bottom: 1rem; }
        .modal-close-btn { background: var(--heritage-red); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; }

        @media (min-width: 640px) {
          .ef-card { max-width: 40rem; padding: 2rem 1.75rem; grid-template-columns: repeat(2, 1fr); }
          .ef-title { font-size: 2.25rem; }
          .ef-header, .ef-full { grid-column: span 2; }
        }
      `}</style>

      <form className="ef-card" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="ef-header">
          <button type="button" className="back-btn" onClick={() => navigate("/events")}>← Back</button>
          <h2 className="ef-title">Add Event</h2>
        </div>

        {[
            { name: "event_name", label: "Event Name", type: "text" },
            { name: "event_date", label: "Event Date", type: "date" },
            { name: "event_time", label: "Event Time", type: "time" },
            { name: "cost", label: "Cost (INR)", type: "number" },
            { name: "location", label: "Location", type: "text" },
            { name: "contact", label: "Contact", type: "tel" },
        ].map(({ name, label, type }) => (
          <label key={name} className="ef-field">
            {label}
            <input name={name} type={type} value={form[name]} onChange={handleChange} required />
          </label>
        ))}

        {/* --- DYNAMIC CATEGORY DROPDOWNS --- */}
        <label className="ef-field">
            Category
            <select name="category" value={form.category} onChange={handleChange} required>
                <option value="" disabled>Select a category</option>
                {Object.keys(categoryMap).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </label>

        <label className="ef-field">
            Sub-category
            <select
                name="sub_category"
                value={form.sub_category}
                onChange={handleChange}
                required
                disabled={!form.category} // Disabled until a category is chosen
            >
                <option value="" disabled>Select a sub-category</option>
                {form.category && categoryMap[form.category].map(subCat => (
                    <option key={subCat} value={subCat}>{subCat}</option>
                ))}
            </select>
        </label>
        {/* --- END DYNAMIC DROPDOWNS --- */}

        <label className="ef-field">
            Status
            <select name="status" value={form.status} onChange={handleChange} required>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
            </select>
        </label>

        <label className="ef-field">
            Priority
            <select name="priority" value={form.priority} onChange={handleChange} required>
                <option value="Low">Low</option>
                <option value="High">High</option>
            </select>
        </label>

        <div className="ef-field ef-full">
          <label>Social Links</label>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <input placeholder="Instagram URL" value={form.social_links.instagram} onChange={(e) => handleSocialChange("instagram", e.target.value)} />
              <input placeholder="Website URL" value={form.social_links.website} onChange={(e) => handleSocialChange("website", e.target.value)} />
          </div>
        </div>

        <label className="ef-field ef-full">
          Event Image Upload
            <div className="file-upload-wrapper">
              <label htmlFor="event_image" className="file-input-label">Choose File</label>
              <input id="event_image" type="file" name="event_image" className="file-input-hidden" accept="image/*" onChange={handleFileChange} required />
              {previewImage && <button type="button" className="view-btn" onClick={() => setModalImage(previewImage)}>View</button>}
            </div>
        </label>

        {error && <p className="ef-error ef-full">{error}</p>}

        <button type="submit" disabled={loading} className="ef-btn ef-full">
          {loading ? "Saving…" : "Save"}
        </button>
      </form>

      {modalImage && (
        <div className="modal-overlay" onClick={() => setModalImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="Large preview" />
            <button className="modal-close-btn" onClick={() => setModalImage(null)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}