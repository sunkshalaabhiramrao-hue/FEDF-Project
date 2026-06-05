import React, { useState } from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import './App.css';

const INITIAL_ROOMS = [
  { number: '101', type: 'Standard', floor: 1, price: 2500, status: 'Available' },
  { number: '102', type: 'Standard', floor: 1, price: 2500, status: 'Occupied' },
  { number: '103', type: 'Deluxe', floor: 1, price: 4500, status: 'Available' },
  { number: '201', type: 'Standard', floor: 2, price: 2500, status: 'Available' },
  { number: '202', type: 'Deluxe', floor: 2, price: 4500, status: 'Available' },
  { number: '203', type: 'Suite', floor: 2, price: 8500, status: 'Available' }
];

export default function App() {
  const [step, setStep] = useState(1); 
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [history, setHistory] = useState([]); 
  const [notification, setNotification] = useState(''); // Toast state
  const [view, setView] = useState('guest'); // Views: 'guest', 'admin', 'profile'

  const [isScanning, setIsScanning] = useState(false);
  const [keyProgress, setKeyProgress] = useState(0); 
  const [isKeySyncing, setIsKeySyncing] = useState(false);

  const [guest, setGuest] = useState({
    name: '',
    email: '',
    nights: 1,
    roomType: 'Standard',
    idFile: null,
    idNumber: '',
    roomNumber: '',
    spaCharges: 0,       
    diningCharges: 0,    
    isKeyActive: false,
    checkoutComplete: false
  });

  // --- Auto-Hiding Toast Notification System ---
  const triggerSystemUpdate = (alertMessage, logAction) => {
    setNotification(alertMessage);
    setHistory(prev => [{ time: new Date().toLocaleTimeString(), action: logAction }, ...prev]);
    
    // Auto-hide the toast after 4 seconds
    setTimeout(() => {
      setNotification('');
    }, 4000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!guest.name || !guest.email) return;
    triggerSystemUpdate(`Check-in Successful! Profile created for ${guest.name}.`, `Registered profile: ${guest.name}`);
    setStep(2);
  };

  const handleIdUploadSimulation = (e) => {
    if (!e.target.files[0]) return;
    const fileName = e.target.files[0].name;
    setIsScanning(true);
    triggerSystemUpdate("Scanning ID Document...", "Started ID Scan");

    setTimeout(() => {
      setIsScanning(false);
      const simulatedPassportNo = "PPT-IND-" + Math.floor(10000 + Math.random() * 90000);
      setGuest(prev => ({ ...prev, idFile: fileName, idNumber: simulatedPassportNo }));
      triggerSystemUpdate(`ID Verified! Saved to Profile.`, `Verified Document ${fileName}`);
    }, 2000);
  };

  const handleSelectRoom = (roomNum) => {
    setGuest({ ...guest, roomNumber: roomNum });
    triggerSystemUpdate(`Room #${roomNum} assigned successfully.`, `Assigned Unit ${roomNum}`);
  };

  const handleKeyHoldStart = () => {
    if (guest.isKeyActive) return;
    setIsKeySyncing(true);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setKeyProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsKeySyncing(false);
        setGuest(prev => ({ ...prev, isKeyActive: true }));
        setRooms(rooms.map(r => r.number === guest.roomNumber ? { ...r, status: 'Occupied' } : r));
        triggerSystemUpdate(`Key Generated! Room #${guest.roomNumber} Unlocked.`, `BLE Key Active`);
      }
    }, 200);
  };

  const handleCheckoutPayment = () => {
    setGuest(prev => ({ ...prev, checkoutComplete: true, isKeyActive: false }));
    setRooms(rooms.map(r => r.number === guest.roomNumber ? { ...r, status: 'Available' } : r));
    triggerSystemUpdate(`Payment confirmed! Invoice compiled and ready for download.`, `Settled account for ${guest.name}`);
    setStep(6);
  };

  // --- Dynamic jsPDF Generator Module ---
  const downloadInvoicePDF = () => {
    const invoiceElement = document.getElementById('invoice-print-area');
    triggerSystemUpdate("Compiling PDF, please wait...", "PDF Generation Started");
    
    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Aetheria_Invoice_${guest.name || 'Guest'}.pdf`);
      triggerSystemUpdate("Invoice PDF Downloaded Successfully!", "Downloaded PDF");
    });
  };

  const resetAllPortalState = () => {
    setGuest({ name: '', email: '', nights: 1, roomType: 'Standard', idFile: null, idNumber: '', roomNumber: '', spaCharges: 0, diningCharges: 0, isKeyActive: false, checkoutComplete: false });
    setSelectedFloor(1);
    setKeyProgress(0);
    setStep(1);
    setView('guest');
    triggerSystemUpdate("Portal reset. Ready for next guest.", "Reset State");
  };

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    // Reset guest state completely
    setGuest({ 
      name: '', email: '', nights: 1, roomType: 'Standard', 
      idFile: null, idNumber: '', roomNumber: '', 
      spaCharges: 0, diningCharges: 0, isKeyActive: false, checkoutComplete: false 
    });
    setStep(1); // Return to step 1
    setView('guest'); // Return to guest view
    triggerSystemUpdate("Session securely cleared.", "User Logout");
  };

  const roomRate = guest.roomType === 'Standard' ? 2500 : guest.roomType === 'Deluxe' ? 4500 : 8500;
  const baseStayCost = guest.nights * roomRate;
  const totalIncidentals = guest.spaCharges + guest.diningCharges;
  const tax = (baseStayCost + totalIncidentals) * 0.12;
  const totalBillAmount = baseStayCost + totalIncidentals + tax;

  return (
    <div className="app-container">
      <header className="app-header">
        <h2 style={{ letterSpacing: '1px' }}>AETHERIA PORTAL</h2>
        <div className="nav-controls">
          <button className={`toggle-btn ${view === 'guest' ? 'active' : ''}`} onClick={() => setView('guest')}>Guest Flow</button>
          <button className={`toggle-btn ${view === 'profile' ? 'active' : ''}`} onClick={() => setView('profile')}>My Profile</button>
          <button className={`toggle-btn ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>Admin Monitor</button>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {notification && (
        <div className="toast-notification">
          ✓ {notification}
        </div>
      )}

      {/* ================= GUEST PROFILE DASHBOARD ================= */}
      {view === 'profile' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h3>👤 Personal Guest Profile</h3>
              <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>
                Welcome to your personalized dashboard, {guest.name || 'Guest'}.
              </p>
            </div>
            
            {/* Log Out / Reset Button (Always visible) */}
            <button 
              onClick={handleLogout} 
              className="action-btn secondary" 
              style={{ background: '#fee2e2', color: '#b91c1c', borderColor: '#fca5a5', padding: '8px 16px', marginTop: '0' }}
            >
              Log Out / Reset
            </button>
          </div>
          
          <div className="profile-grid">
            <div className="profile-section">
              <h4>Current Preferences</h4>
              <p><strong>Room Tier:</strong> {guest.roomType}</p>
              <p><strong>Bed Type:</strong> King (Default)</p>
              <p><strong>Accessibility:</strong> None requested</p>
            </div>
            
            <div className="profile-section">
              <h4>Active Bookings</h4>
              <p><strong>Status:</strong> {guest.roomNumber ? <span className="text-good">Checked In (Room #{guest.roomNumber})</span> : 'Pending Arrival'}</p>
              <p><strong>Duration:</strong> {guest.nights} Night(s)</p>
              <p><strong>Checkout:</strong> {guest.checkoutComplete ? 'Completed' : 'Pending'}</p>
            </div>
            
            <div className="profile-section">
              <h4>Saved ID Details</h4>
              <p><strong>Document:</strong> {guest.idFile || 'None uploaded'}</p>
              <p><strong>ID Ref:</strong> {guest.idNumber || 'Awaiting verification'}</p>
              <p><strong>Status:</strong> {guest.idFile ? '✅ Verified' : '❌ Missing'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADMIN DASHBOARD ================= */}
      {view === 'admin' && (
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
      )}

      {/* ================= GUEST CHECK-IN / CHECK-OUT WIZARD ================= */}
      {view === 'guest' && (
        <div className="guest-flow">
          <div className="stepper">
            {['1. Check-In', '2. ID Scan', '3. Room', '4. Key', '5. Services', '6. Invoice'].map((name, i) => (
              <div key={i} className={`step ${step === i + 1 ? 'current' : ''} ${step > i + 1 ? 'done' : ''}`}>{name}</div>
            ))}
          </div>

          {step === 1 && (
            <div className="card">
              <h3>Module 1: Registration</h3>
              <form onSubmit={handleFormSubmit} className="simple-form">
                <label>Full Name</label>
                <input type="text" required value={guest.name} onChange={e => setGuest({ ...guest, name: e.target.value })} />
                <label>Email</label>
                <input type="email" required value={guest.email} onChange={e => setGuest({ ...guest, email: e.target.value })} />
                <label>Duration of Stay (Nights)</label>
                <input type="number" min="1" value={guest.nights} onChange={e => setGuest({ ...guest, nights: parseInt(e.target.value) || 1 })} />
                <label>Desired Package Tier</label>
                <select value={guest.roomType} onChange={e => setGuest({ ...guest, roomType: e.target.value })}>
                  <option value="Standard">Standard (₹2,500/night)</option>
                  <option value="Deluxe">Deluxe (₹4,500/night)</option>
                  <option value="Suite">Suite (₹8,500/night)</option>
                </select>
                <button type="submit" className="action-btn">Register Stay Profile</button>
              </form>
            </div>
          )}

          {step === 2 && (
             <div className="card text-center">
              <h3>Module 2: Passport Scan</h3>
              <div className="upload-box">
                {guest.idFile ? (
                  <div><h4 className="text-good">✔ Authenticated</h4><p>{guest.idNumber}</p></div>
                ) : (
                  <input type="file" onChange={handleIdUploadSimulation} />
                )}
              </div>
              <div className="btn-row">
                <button className="action-btn secondary" onClick={() => setStep(1)}>Back</button>
                <button className="action-btn" onClick={() => setStep(3)} disabled={!guest.idFile}>Select Room</button>
              </div>
            </div>
          )}

          {step === 3 && (
             <div className="card">
              <h3>Module 3: Room Selection</h3>
              <div className="room-grid">
                {rooms.filter(r => r.type === guest.roomType).map(r => (
                  <div key={r.number} 
                       className={`room-block ${guest.roomNumber === r.number ? 'selected' : ''} ${r.status !== 'Available' ? 'disabled' : ''}`}
                       onClick={() => r.status === 'Available' && handleSelectRoom(r.number)}>
                    <h4>#{r.number}</h4>
                    <p>{r.status}</p>
                  </div>
                ))}
              </div>
              <div className="btn-row" style={{ marginTop: '30px' }}>
                <button className="action-btn secondary" onClick={() => setStep(2)}>Back</button>
                <button className="action-btn" disabled={!guest.roomNumber} onClick={() => setStep(4)}>Confirm & Handshake Key</button>
              </div>
            </div>
          )}

          {step === 4 && (
             <div className="card text-center">
              <h3>Module 4: Digital Key</h3>
              <div className="key-fob" onClick={handleKeyHoldStart}>
                 {isKeySyncing ? '📡 Syncing...' : guest.isKeyActive ? '🔓 Unlocked' : '🔒 Tap to Unlock'}
              </div>
              <div className="btn-row">
                <button className="action-btn secondary" onClick={() => setStep(3)}>Back</button>
                <button className="action-btn pay-btn" onClick={() => setStep(5)} disabled={!guest.isKeyActive}>Proceed to Check-Out Flow →</button>
              </div>
            </div>
          )}

          {/* Upgraded Check-Out Wizard Add-Ons */}
          {step === 5 && (
            <div className="card">
              <h3>Module 5: Room Incidental & Check-Out Review</h3>
              <p>Review your stay duration and simulate adding final room charges before settling your balance.</p>
              
              <div style={{ background: '#e0f2fe', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <strong>Stay Duration Confirmed:</strong> {guest.nights} Night(s) at ₹{roomRate}/night
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="service-card-box" style={{ border: '1px solid #cbd5e1', padding: '15px', borderRadius: '8px' }}>
                  <h4>💆‍♂️ Spa Concierge</h4>
                  <button className="action-btn secondary" style={{ width: '100%', marginBottom: '10px' }} onClick={() => setGuest(prev => ({ ...prev, spaCharges: prev.spaCharges + 3500 }))}>Add Massage (+₹3,500)</button>
                  <div>Current Spa Total: <strong>₹{guest.spaCharges}</strong></div>
                </div>

                <div className="service-card-box" style={{ border: '1px solid #cbd5e1', padding: '15px', borderRadius: '8px' }}>
                  <h4>🍽 Room Service</h4>
                  <button className="action-btn secondary" style={{ width: '100%', marginBottom: '10px' }} onClick={() => setGuest(prev => ({ ...prev, diningCharges: prev.diningCharges + 1400 }))}>Add Dinner (+₹1,400)</button>
                  <div>Current Dining Total: <strong>₹{guest.diningCharges}</strong></div>
                </div>
              </div>

              <div className="btn-row" style={{ marginTop: '30px' }}>
                <button className="action-btn secondary" onClick={() => setStep(4)}>Back to Key</button>
                <button className="action-btn pay-btn" onClick={() => setStep(6)}>Review Final Invoice & Settle</button>
              </div>
            </div>
          )}

          {/* Upgraded PDF Invoice Generator */}
          {step === 6 && (
            <div className="card">
              <h3>Module 6: Verified Check-Out Folio</h3>
              
              {/* ID added for html2canvas to target this specific div */}
              <div id="invoice-print-area" className="invoice-box print-area" style={{ background: 'white', padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border)', paddingBottom: '15px', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ margin: 0, color: 'var(--primary)' }}>AETHERIA GRAND</h2>
                    <p style={{ margin: 0, color: '#64748b' }}>Tax Invoice / Receipt</p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                    <strong>Date:</strong> {new Date().toLocaleDateString()}<br />
                    <strong>Invoice ID:</strong> ATH-2026-REC
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.9rem', marginBottom: '25px' }}>
                  <div>
                    <h5 style={{ margin: '0 0 5px 0', color: '#64748b' }}>BILL TO:</h5>
                    <strong>{guest.name}</strong><br />
                    {guest.email}<br />
                    ID Ref: {guest.idNumber}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h5 style={{ margin: '0 0 5px 0', color: '#64748b' }}>STAY DETAILS:</h5>
                    Room #{guest.roomNumber} ({guest.roomType})<br />
                    {guest.nights} Night(s)
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                      <th style={{ padding: '12px', borderBottom: '2px solid var(--border)' }}>Description</th>
                      <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid var(--border)' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Room Charges ({guest.nights} × ₹{roomRate})</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>₹{baseStayCost.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Spa & Wellness Services</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>₹{guest.spaCharges.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>In-Room Dining</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>₹{guest.diningCharges.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>Taxes & Service Fees (12%)</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', color: '#64748b' }}>₹{tax.toFixed(2)}</td>
                    </tr>
                    <tr style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                      <td style={{ padding: '15px 12px' }}>Total Amount Due</td>
                      <td style={{ padding: '15px 12px', textAlign: 'right', color: 'var(--accent)' }}>₹{totalBillAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="btn-row" style={{ marginTop: '25px' }}>
                {!guest.checkoutComplete ? (
                  <>
                    <button className="action-btn secondary" onClick={() => setStep(5)}>Back to Services</button>
                    <button className="action-btn pay-btn" onClick={handleCheckoutPayment}>💳 Settle Balance & Complete Checkout</button>
                  </>
                ) : (
                  <>
                    {/* Triggers jsPDF dynamic compilation */}
                    <button className="action-btn secondary" onClick={downloadInvoicePDF}>📥 Download Invoice PDF</button>
                    <button className="action-btn" onClick={resetAllPortalState}>Return Home</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}