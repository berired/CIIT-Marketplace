import React, { useState } from 'react';
import './Admin.css';

function Admin() {
  // State to track collapsed panels (true = expanded)
  const [expanded, setExpanded] = useState({
    items: true,
    users: true,
    approvals: true
  });

  const togglePanel = (panel) => {
    setExpanded(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  // Basic CSV Export Logic
  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(obj => Object.values(obj).join(",")).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = [
    { label: 'Total Users', value: '1,240' },
    { label: 'Active Listings', value: '456' },
    { label: 'Pending Reports', value: '12' },
    { label: 'Total Sales', value: '₱12,500' }
  ];

  const itemReports = [
    { id: 1, item: 'Vintage Denim Jacket', reason: 'Prohibited Item', reporter: 'User123', date: 'Mar 12', status: 'Pending' },
    { id: 2, item: 'Calculated FX-991EX', reason: 'Overpriced', reporter: 'StudentA', date: 'Mar 11', status: 'Flagged' },
  ];

  const userReports = [
    { id: 1, user: 'Karl_Marx22', reason: 'Harassment', reporter: 'User88', date: 'Mar 12', status: 'Flagged' },
    { id: 2, user: 'Scammer_Hunter', reason: 'False Reporting', reporter: 'Admin_Bot', date: 'Mar 09', status: 'Pending' },
  ];

  const pendingListings = [
    { id: 1, item: 'MacBook Air M1', price: '₱35,000', seller: 'TechieStudent', date: 'Mar 13', status: 'Pending' },
    { id: 2, item: 'Drawing Table', price: '₱1,200', seller: 'ArkiLife', date: 'Mar 13', status: 'Pending' },
  ];

  return (
    <section className="admin-container">
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--ciit-dark)' }}>Admin Panel</h1>
        <p style={{ color: '#64748b' }}>System overview and moderation tools.</p>
      </header>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3>{stat.label}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Item Moderation Panel */}
      <div className="admin-content-card" style={{ marginBottom: '40px' }}>
        <div className="admin-table-header">
          <div onClick={() => togglePanel('items')} style={{ cursor: 'pointer', flex: 1 }}>
            <h2>{expanded.items ? '▼' : '▶'} Item Moderation</h2>
          </div>
          <button 
            className="admin-btn" 
            style={{ background: 'var(--ciit-accent)', color: 'white', border: 'none' }}
            onClick={() => exportToCSV(itemReports, "item_reports")}
          >
            Export CSV
          </button>
        </div>
        {expanded.items && (
          <div className="admin-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Item Name</th>
                  <th>Reason</th>
                  <th>Reporter</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {itemReports.map((report) => (
                  <tr key={report.id}>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{report.date}</td>
                    <td><strong>{report.item}</strong></td>
                    <td>{report.reason}</td>
                    <td>{report.reporter}</td>
                    <td><span className={`status-badge ${report.status.toLowerCase()}`}>{report.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="admin-btn">View</button>
                        <button className="admin-btn" style={{ color: '#b91c1c' }}>Dismiss</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Moderation Panel */}
      <div className="admin-content-card" style={{ marginBottom: '40px' }}>
        <div className="admin-table-header">
          <div onClick={() => togglePanel('users')} style={{ cursor: 'pointer', flex: 1 }}>
            <h2>{expanded.users ? '▼' : '▶'} User Reports</h2>
          </div>
          <button 
            className="admin-btn" 
            style={{ background: 'var(--ciit-accent)', color: 'white', border: 'none' }}
            onClick={() => exportToCSV(userReports, "user_reports")}
          >
            Export CSV
          </button>
        </div>
        {expanded.users && (
          <div className="admin-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reported User</th>
                  <th>Violation</th>
                  <th>Reporter</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userReports.map((user) => (
                  <tr key={user.id}>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{user.date}</td>
                    <td><strong>{user.user}</strong></td>
                    <td>{user.reason}</td>
                    <td>{user.reporter}</td>
                    <td><span className={`status-badge ${user.status.toLowerCase()}`}>{user.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="admin-btn">Profile</button>
                        <button className="admin-btn" style={{ color: '#b91c1c' }}>Ban</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pending Approvals Panel */}
      <div className="admin-content-card">
        <div className="admin-table-header">
          <div onClick={() => togglePanel('approvals')} style={{ cursor: 'pointer', flex: 1 }}>
            <h2>{expanded.approvals ? '▼' : '▶'} New Listing Approvals</h2>
          </div>
          <button 
            className="admin-btn" 
            style={{ background: 'var(--ciit-accent)', color: 'white', border: 'none' }}
            onClick={() => exportToCSV(pendingListings, "pending_listings")}
          >
            Export CSV
          </button>
        </div>
        {expanded.approvals && (
          <div className="admin-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Listing</th>
                  <th>Price</th>
                  <th>Seller</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingListings.map((listing) => (
                  <tr key={listing.id}>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{listing.date}</td>
                    <td><strong>{listing.item}</strong></td>
                    <td>{listing.price}</td>
                    <td>{listing.seller}</td>
                    <td><span className="status-badge pending">Awaiting</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="admin-btn" style={{ color: '#15803d' }}>Approve</button>
                        <button className="admin-btn" style={{ color: '#b91c1c' }}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Admin;