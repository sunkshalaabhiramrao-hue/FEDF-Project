import React from 'react';

export default function Admin({ rooms, history }) {
  return (
    <div className="card">
      <h3>Live Hotel Property Matrix</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Room</th>
            <th>Type</th>
            <th>Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(r => (
            <tr key={r.number}>
              <td><strong>#{r.number}</strong></td>
              <td>{r.type}</td>
              <td>₹{r.price}</td>
              <td><span className={`badge ${r.status === 'Available' ? 'badge-good' : 'badge-bad'}`}>{r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: '30px' }}>System Logs</h3>
      <div className="history-log">
        {history.map((h, i) => (
          <div key={i} className="log-item"><span className="log-time">[{h.time}]</span> {h.action}</div>
        ))}
      </div>
    </div>
  );
}