import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import StatCard from "../components/StatCard";
import { fetchStats, fetchNotices, fetchMessages } from "../api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    courses: 0,
    notices: 0,
    messages: 0,
    newMessages: 0,
  });
  const [recentNotices, setRecentNotices] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, noticesData, messagesData] = await Promise.all([
          fetchStats().catch(() => ({ courses: 0, notices: 0, messages: 0, newMessages: 0 })),
          fetchNotices().catch(() => []),
          fetchMessages().catch(() => []),
        ]);

        setStats(statsData);
        setRecentNotices(Array.isArray(noticesData) ? noticesData.slice(0, 5) : []);
        setRecentMessages(Array.isArray(messagesData) ? messagesData.slice(0, 5) : []);
      } catch (err) {
        console.error("Dashboard failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <>
      <TopBar title="Overview" />

      <div className="dashboard-content">
        {loading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner" />
            <p>Loading dashboard metrics…</p>
          </div>
        ) : (
          <>
            <div className="stat-grid">
              <StatCard
                variant="blue"
                icon="📢"
                value={stats.notices}
                label="Published Notices"
              />
              <StatCard
                variant="amber"
                icon="🎓"
                value={stats.courses}
                label="Academic Courses"
              />
              <StatCard
                variant="teal"
                icon="✉️"
                value={stats.messages}
                label="Total Enquiries"
              />
              <StatCard
                variant={stats.newMessages > 0 ? "red" : "blue"}
                icon="📬"
                value={stats.newMessages}
                label="Pending Inquiries"
              />
            </div>

            <div className="dashboard-panels">
              {/* Recent Notices Panel */}
              <div className="dashboard-panel">
                <h3 className="panel-title">Recent Announcements</h3>
                {recentNotices.length === 0 ? (
                  <p className="panel-empty">No notices published yet.</p>
                ) : (
                  <ul className="panel-list">
                    {recentNotices.map((notice) => (
                      <li key={notice._id} className="panel-list-item">
                        <span
                          className={`notice-badge notice-badge--${(notice.category || "general").toLowerCase()}`}
                        >
                          {notice.category || "General"}
                        </span>
                        <span className="panel-list-text" title={notice.title}>
                          {notice.pinned && "📌 "}
                          {notice.title}
                        </span>
                        <span className="panel-list-date">
                          {new Date(notice.publishedAt || notice.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Recent Messages Panel */}
              <div className="dashboard-panel">
                <h3 className="panel-title">Recent Enquiries</h3>
                {recentMessages.length === 0 ? (
                  <p className="panel-empty">No enquiries received yet.</p>
                ) : (
                  <ul className="panel-list">
                    {recentMessages.map((msg) => (
                      <li key={msg._id} className="panel-list-item">
                        <span
                          className={`status-dot status-dot--${msg.status || "new"}`}
                          title={`Status: ${msg.status || "new"}`}
                        />
                        <span className="panel-list-text" title={msg.name}>
                          {msg.name}
                        </span>
                        <span className="panel-list-sub" title={msg.course || msg.email}>
                          {msg.course || msg.email}
                        </span>
                        <span className="panel-list-date">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
