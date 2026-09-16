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
              {/* Recent Announcements Panel */}
              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3 className="panel-title">Recent Announcements</h3>
                  <span className="panel-counter">{recentNotices.length} latest</span>
                </div>

                {recentNotices.length === 0 ? (
                  <p className="panel-empty">No notices published yet.</p>
                ) : (
                  <ul className="announcements-feed">
                    {recentNotices.map((notice) => (
                      <li key={notice._id} className="announcement-item">
                        <div className="announcement-top">
                          <div className="announcement-badge-group">
                            {notice.pinned && (
                              <span className="announcement-pinned-tag">PINNED</span>
                            )}
                            <span
                              className={`notice-badge notice-badge--${(
                                notice.category || "general"
                              ).toLowerCase()}`}
                            >
                              {notice.category || "General"}
                            </span>
                          </div>
                          <span className="announcement-date">
                            {new Date(
                              notice.publishedAt || notice.createdAt
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <h4 className="announcement-title">{notice.title}</h4>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Recent Enquiries Panel */}
              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3 className="panel-title">Recent Enquiries</h3>
                  <span className="panel-counter">{recentMessages.length} latest</span>
                </div>

                {recentMessages.length === 0 ? (
                  <p className="panel-empty">No student enquiries received yet.</p>
                ) : (
                  <ul className="enquiries-feed">
                    {recentMessages.map((msg) => (
                      <li key={msg._id} className="enquiry-item">
                        <div className="enquiry-top">
                          <span className="enquiry-name">
                            <span
                              className={`status-dot status-dot--${msg.status || "new"}`}
                              title={`Status: ${msg.status || "new"}`}
                            />
                            {msg.name}
                          </span>
                          <span className="enquiry-date">
                            {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                        <div className="enquiry-sub">
                          {msg.course && (
                            <span className="enquiry-course-tag">{msg.course}</span>
                          )}
                          <span className="enquiry-contact-info">
                            {msg.email} · {msg.phone}
                          </span>
                        </div>
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
