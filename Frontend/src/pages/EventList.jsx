import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as eventApi from "../api/event";
import bgImg from "../assets/1.png";

export default function EventList() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  /* ─── Fetch data on component mount ─── */
  useEffect(() => {
    eventApi.listEvents().then(setRows).catch(err => {
        console.error("Failed to fetch events:", err);
        // Optionally, set an error state here to show in the UI
    });
  }, []);

  /* ─── Event Handlers ─── */
  const handleEdit = (id) => navigate(`/event/${id}/edit`);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await eventApi.deleteEvent(id);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to delete event.");
    }
  };

  const handleAdd = () => navigate("/event/new");

  /* ─── Render UI ─── */
  return (
    <section className="el-section">
      <style>{`
        :root {
          --royal-red: #7A133D;
          --heritage-red: #C62039;
          --royal-gold: #D2A857;
          --royal-cream: #FFF9F2;
          --sage: #8BBAA1;
          --teal: #056675;
        }
        .el-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-image: url(${bgImg}), linear-gradient(135deg, rgba(210,168,87,0.7) 0%, rgba(139,186,161,0.7) 35%, rgba(5,102,117,0.7) 100%);
          background-size: cover;
          background-position: center;
          font-family: "Merriweather", "Georgia", serif;
          padding: 1rem;
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
        .el-card {
          width: 100%;
          max-width: 36rem;
          background: #abdfc461;
          border-radius: 1.25rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          padding: 1.5rem 1rem;
          margin-top: 2rem;
        }
        .el-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .el-header-main {
          display: flex;
          align-items: center;
        }
        .el-title {
          color: var(--heritage-red);
          font-size: 1.75rem;
          font-weight: 900;
        }
        .add-btn {
          background: var(--heritage-red);
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }
        .add-btn:hover {
          background: var(--royal-red);
        }
        .el-table-wrapper {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }
        thead th {
          background-color: rgba(122, 19, 61, 0.1);
          color: var(--royal-red);
          padding: 0.75rem 0.55rem;
          text-align: left;
          font-weight: 700;
        }
        tbody td {
          padding: 0.65rem 0.55rem;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          color: #333;
        }
        tbody tr:last-child td {
            border-bottom: none;
        }
        tbody tr:nth-child(even) {
          background-color: rgba(255, 255, 255, 0.5);
        }
        .el-actions {
          display: flex;
          gap: 0.5rem;
        }
        .el-btn {
          border: none;
          border-radius: 0.35rem;
          padding: 0.3rem 0.6rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s, color 0.15s;
        }
        .el-btn.edit {
          background-color: var(--sage);
          color: #fff;
        }
        .el-btn.edit:hover {
          background-color: var(--teal);
        }
        .el-btn.delete {
          background-color: var(--heritage-red);
          color: #fff;
        }
        .el-btn.delete:hover {
          background-color: var(--royal-red);
        }
        @media (min-width: 768px) {
          .el-card {
            max-width: 56rem; /* Wider card for larger screens */
            padding: 2rem 1.5rem;
          }
          .el-title {
            font-size: 2.25rem;
          }
        }
      `}</style>

      <div className="el-card">
        <div className="el-header">
          <div className="el-header-main">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
              ← Back
            </button>
            <h2 className="el-title">Manage Events</h2>
          </div>
          <button className="add-btn" onClick={handleAdd}>
            + Add New
          </button>
        </div>

        <div className="el-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Location</th>
                <th>Category</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.event_name}</td>
                    <td>{new Date(row.event_date).toLocaleDateString()}</td>
                    <td>{row.location}</td>
                    <td>{row.category}</td>
                    <td>
                      <div className="el-actions">
                        <button
                          className="el-btn edit"
                          onClick={() => handleEdit(row.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="el-btn delete"
                          onClick={() => handleDelete(row.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "1.5rem" }}>
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}