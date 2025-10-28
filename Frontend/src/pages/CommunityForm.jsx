import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as commApi from "../api/community";
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

export default function CommunityForm() {
  const navigate = useNavigate();

  // State for image previews and the large modal view
  const [previewLogo, setPreviewLogo] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [modalImage, setModalImage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    contact: "",
    address: "",
    email: "",
    logo: null,
    image: null,
    description: "",
    sub_category: "",
    in_charge: "",
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
    if (!file) return;

    const url = URL.createObjectURL(file);
    if (name === "logo") {
      if (previewLogo) URL.revokeObjectURL(previewLogo);
      setPreviewLogo(url);
    }
    if (name === "image") {
      if (previewImage) URL.revokeObjectURL(previewImage);
      setPreviewImage(url);
    }

    setForm(prev => ({ ...prev, [name]: file }));
  };

  const handleSocialChange = (platform, value) => {
    setForm(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "social_links") {
          formData.append(key, JSON.stringify(value));
        } else if (value) {
          formData.append(key, value);
        }
      });

      await commApi.createCommunity(formData);
      navigate("/communities");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create community");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cf-section">
      <style>{`
        :root {
          --royal-red: #7A133D;
          --heritage-red: #C62039;
          --royal-gold: #D2A857;
          --royal-cream: #FFF9F2;
          --sage: #8BBAA1;
          --teal: #056675;
        }
        .cf-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url(${bgImg}), linear-gradient(135deg, rgba(210,168,87,0.7), rgba(139,186,161,0.7), rgba(5,102,117,0.7));
          background-size: cover;
          background-position: center;
          padding: 2rem 1rem;
          font-family: "Merriweather", "Georgia", serif;
        }
        .cf-card {
          width: 100%;
          max-width: 40rem;
          background: #abdfc461;
          border-radius: 1.25rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          padding: 2rem 1.75rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .cf-header {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
        }
        .back-btn {
          background: none;
          border: none;
          color: var(--heritage-red);
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          margin-right: 1rem;
          transition: color 0.2s;
        }
        .back-btn:hover {
          color: var(--teal);
        }
        .cf-title {
          font-size: 2.25rem;
          font-weight: 900;
          color: var(--heritage-red);
        }
        .cf-field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--royal-red);
        }
        .cf-field input,
        .cf-field select,
        .cf-field textarea {
          border: 2px solid transparent;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.9rem;
          resize: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .cf-field input:focus,
        .cf-field select:focus,
        .cf-field textarea:focus {
          border-color: var(--royal-gold);
          outline: none;
          box-shadow: 0 0 0 3px rgba(210,168,87,0.35);
        }
        .cf-error {
          grid-column: 1 / -1;
          color: #b91c1c; text-align: center; font-weight: 600; font-size: 0.875rem;
        }
        .cf-btn {
          grid-column: 1 / -1;
          background: var(--heritage-red);
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.6rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }
        .cf-btn:hover { background: var(--royal-red); }
        .cf-btn:disabled { opacity: 0.6; cursor: default; }
        .cf-full { grid-column: 1 / -1; }
        
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
          .cf-card { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <form className="cf-card" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="cf-header">
            <button type="button" className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h2 className="cf-title">Add Community</h2>
        </div>

        {[
          ["name", "Name"],
          ["contact", "Contact"],
          ["address", "Address"],
          ["email", "Email"],
          ["in_charge", "In-charge"]
        ].map(([key, label]) => (
          <label key={key} className="cf-field">
            {label}
            <input name={key} value={form[key]} onChange={handleChange} required />
          </label>
        ))}

        <label className="cf-field">
            Category
            <select name="category" value={form.category} onChange={handleChange} required>
                <option value="" disabled>Select a category</option>
                {Object.keys(categoryMap).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </label>

        <label className="cf-field">
            Sub-category
            <select
                name="sub_category"
                value={form.sub_category}
                onChange={handleChange}
                required
                disabled={!form.category}
            >
                <option value="" disabled>Select a sub-category</option>
                {form.category && categoryMap[form.category].map(subCat => (
                    <option key={subCat} value={subCat}>{subCat}</option>
                ))}
            </select>
        </label>

        <label className="cf-field cf-full">
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} required />
        </label>

        <div className="cf-field cf-full">
          <label>Social Links</label>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <input
                  placeholder="Instagram URL"
                  value={form.social_links.instagram}
                  onChange={(e) => handleSocialChange("instagram", e.target.value)}
              />
              <input
                  placeholder="Website URL"
                  value={form.social_links.website}
                  onChange={(e) => handleSocialChange("website", e.target.value)}
              />
          </div>
        </div>

        <label className="cf-field">
          Logo Upload
          <div className="file-upload-wrapper">
            <label htmlFor="logo" className="file-input-label">Choose File</label>
            <input id="logo" type="file" name="logo" className="file-input-hidden" accept="image/*" onChange={handleFileChange} required/>
            {previewLogo && <button type="button" className="view-btn" onClick={() => setModalImage(previewLogo)}>View</button>}
          </div>
        </label>
        
        <label className="cf-field">
          Banner Image Upload
          <div className="file-upload-wrapper">
            <label htmlFor="image" className="file-input-label">Choose File</label>
            <input id="image" type="file" name="image" className="file-input-hidden" accept="image/*" onChange={handleFileChange} required/>
            {previewImage && <button type="button" className="view-btn" onClick={() => setModalImage(previewImage)}>View</button>}
          </div>
        </label>

        {error && <p className="cf-error cf-full">{error}</p>}

        <button type="submit" disabled={loading} className="cf-btn cf-full">
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