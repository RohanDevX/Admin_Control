import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthCtx } from '../context/AuthContext';
import * as commApi from '../api/community';
import * as eventApi from '../api/event';
import bgImg from "../assets/1.png";

const Dashboard = () => {
  const { user, logout } = useContext(AuthCtx);
  const [stats, setStats] = useState({
    communities: 0,
    events: 0,
    recentCommunities: [],
    recentEvents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [communities, events] = await Promise.all([
          commApi.listCommunities(),
          eventApi.listEvents()
        ]);
        
        setStats({
          communities: communities.length,
          events: events.length,
          recentCommunities: communities.slice(0, 3),
          recentEvents: events.slice(0, 3)
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <style>{`
          .dashboard-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #D2A857 0%, #8BBAA1 35%, #056675 100%);
            font-family: "Merriweather", "Georgia", serif;
            color: #7A133D;
            font-size: 1.2rem;
            font-weight: 600;
          }
        `}</style>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <section className="dashboard-section">
      <style>{`
        :root {
          --royal-red: #7A133D;
          --heritage-red: #C62039;
          --royal-gold: #D2A857;
          --royal-cream: #FFF9F2;
          --sage: #8BBAA1;
          --teal: #056675;
        }

        .dashboard-section {
          min-height: 100vh;
          background-image: url(${bgImg}), linear-gradient(135deg, rgba(210,168,87,0.7) 0%, rgba(139,186,161,0.7) 35%, rgba(5,102,117,0.7) 100%);
          background-size: cover;
          background-position: center;
          font-family: "Merriweather", "Georgia", serif;
          padding: 1rem;
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          background: rgba(255, 249, 242, 0.95);
          border-radius: 1.25rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .welcome-text {
          color: var(--heritage-red);
          font-size: 2rem;
          font-weight: 900;
          margin: 0;
        }

        .user-info {
          color: var(--royal-red);
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0.5rem 0 0 0;
        }

        .logout-btn {
          background: var(--heritage-red);
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.6rem 1.2rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
          font-size: 0.9rem;
        }

        .logout-btn:hover {
          background: var(--royal-red);
          transform: translateY(-2px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--heritage-red);
          margin: 0;
        }

        .stat-label {
          color: var(--royal-red);
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0.5rem 0 0 0;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .action-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          transition: transform 0.2s;
        }

        .action-card:hover {
          transform: translateY(-3px);
        }

        .action-title {
          color: var(--heritage-red);
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 1rem 0;
          text-align: center;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .action-btn {
          display: inline-block;
          background: var(--royal-gold);
          color: #fff;
          text-decoration: none;
          padding: 0.8rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 700;
          text-align: center;
          transition: background 0.15s, transform 0.15s;
          font-size: 0.95rem;
        }

        .action-btn:hover {
          background: #b99143;
          transform: translateY(-2px);
          color: #fff;
        }

        .action-btn.primary {
          background: var(--heritage-red);
        }

        .action-btn.primary:hover {
          background: var(--royal-red);
        }

        .recent-section {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .recent-title {
          color: var(--heritage-red);
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0 0 1rem 0;
          text-align: center;
        }

        .recent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .recent-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .recent-item {
          background: var(--royal-cream);
          border-left: 4px solid var(--royal-gold);
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border-radius: 0 0.5rem 0.5rem 0;
          color: var(--royal-red);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .no-items {
          text-align: center;
          color: var(--royal-red);
          font-style: italic;
          padding: 1rem;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            text-align: center;
          }
          
          .welcome-text {
            font-size: 1.5rem;
          }
          
          .action-buttons {
            gap: 0.5rem;
          }
          
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="welcome-text">Admin Dashboard</h1>
            <p className="user-info">Welcome back, {user?.name || user?.email || 'Admin'}!</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <h2 className="stat-number">{stats.communities}</h2>
            <p className="stat-label">Total Communities</p>
          </div>
          <div className="stat-card">
            <h2 className="stat-number">{stats.events}</h2>
            <p className="stat-label">Total Events</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="action-grid">
          <div className="action-card">
            <h3 className="action-title">Community Management</h3>
            <div className="action-buttons">
              <Link to="/communities" className="action-btn">
                📋 View All Communities
              </Link>
              <Link to="/community/new" className="action-btn primary">
                ➕ Add New Community
              </Link>
            </div>
          </div>

          <div className="action-card">
            <h3 className="action-title">Event Management</h3>
            <div className="action-buttons">
              <Link to="/events" className="action-btn">
                📅 View All Events
              </Link>
              <Link to="/event/new" className="action-btn primary">
                ➕ Add New Event
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Items */}
        <div className="recent-section">
          <h3 className="recent-title">Recent Activity</h3>
          <div className="recent-grid">
            <div>
              <h4 style={{ color: 'var(--royal-red)', margin: '0 0 0.75rem 0', fontWeight: '700' }}>
                Latest Communities
              </h4>
              {stats.recentCommunities.length > 0 ? (
                <ul className="recent-list">
                  {stats.recentCommunities.map((community, index) => (
                    <li key={community.id || index} className="recent-item">
                      {community.name} - {community.category}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-items">No communities yet</p>
              )}
            </div>

            <div>
              <h4 style={{ color: 'var(--royal-red)', margin: '0 0 0.75rem 0', fontWeight: '700' }}>
                Latest Events
              </h4>
              {stats.recentEvents.length > 0 ? (
                <ul className="recent-list">
                  {stats.recentEvents.map((event, index) => (
                    <li key={event.id || index} className="recent-item">
                      {event.event_name} - {event.event_date}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-items">No events yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;