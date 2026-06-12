import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function GuestFlow({ step, setStep, guest, setGuest, rooms, setRooms, triggerSystemUpdate, resetAllPortalState }) {
  const [isScanning, setIsScanning] = useState(false);
  const [isKeySyncing, setIsKeySyncing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); 
  const [isTabActive, setIsTabActive] = useState(true);

  useEffect(() => {
    if (step !== 6 || guest.checkoutComplete) return;

    const handleVisibilityChange = () => setIsTabActive(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const ticker = setInterval(() => {
      if (!document.hidden) {
        setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1));
      }
    }, 1000);

    return () => {
      clearInterval(ticker);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [step, guest.checkoutComplete]);

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
    if (timeLeft > 0) return;
    setGuest(prev => ({ ...prev, checkoutComplete: true, isKeyActive: false }));
    setRooms(rooms.map(r => r.number === guest.roomNumber ? { ...r, status: 'Available' } : r));
    triggerSystemUpdate(`Payment confirmed! Invoice compiled and ready for download.`, `Settled account for ${guest.name}`);
  };

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

  const roomRate = guest.roomType === 'Standard' ? 2500 : guest.roomType === 'Deluxe' ? 4500 : 8500;
  const baseStayCost = guest.nights * roomRate;
  const totalIncidentals = guest.spaCharges + guest.diningCharges;
  const tax = (baseStayCost + totalIncidentals) * 0.12;
  const totalBillAmount = baseStayCost + totalIncidentals + tax;

  return (
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

      {step === 5 && (
        <div className="card">
          <h3>Module 5: Room Incidental & Check-Out Review</h3>
          <div style={{ background: 'rgba(129, 140, 248, 0.15)', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--border)' }}>
            <strong>Stay Duration Confirmed:</strong> {guest.nights} Night(s) at ₹{roomRate}/night
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="service-card-box" style={{ border: '1px solid var(--border)', padding: '15px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.3)' }}>
              <h4>💆‍♂️ Spa Concierge</h4>
              <button className="action-btn secondary" style={{ width: '100%', marginBottom: '10px' }} onClick={() => setGuest(prev => ({ ...prev, spaCharges: prev.spaCharges + 3500 }))}>Add Massage (+₹3,500)</button>
              <div>Current Spa Total: <strong>₹{guest.spaCharges}</strong></div>
            </div>
            <div className="service-card-box" style={{ border: '1px solid var(--border)', padding: '15px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.3)' }}>
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

      {step === 6 && (
        <div className="card">
          <h3>Module 6: Verified Check-Out Folio</h3>
          {!guest.checkoutComplete && (
            <div style={{
              background: timeLeft > 0 ? (isTabActive ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.15)') : 'rgba(16, 185, 129, 0.15)',
              border: `1px solid ${timeLeft > 0 ? (isTabActive ? '#f59e0b' : '#ef4444') : '#10b981'}`,
              padding: '16px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center'
            }}>
              {timeLeft > 0 ? (
                <div>
                  <strong style={{ color: isTabActive ? '#fbbf24' : '#f87171', display: 'block' }}>
                    {isTabActive ? `⏳ Mandatory Folio Verification: ${timeLeft}s remaining` : '⚠️ Verification Paused: Tab Context Lost'}
                  </strong>
                </div>
              ) : (
                <strong style={{ color: '#34d399' }}>✅ Document Acknowledged. Financial gateway interface active.</strong>
              )}
            </div>
          )}

          <div id="invoice-print-area" className="invoice-box print-area" style={{ background: 'white', padding: '30px', color: '#0f172a', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, color: '#6366f1' }}>AETHERIA GRAND</h2>
                <p style={{ margin: 0, color: '#64748b' }}>Tax Invoice / Receipt</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>Date:</strong> {new Date().toLocaleDateString()}<br />
                <strong>Invoice ID:</strong> ATH-2026-REC
              </div>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Room Charges</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>₹{baseStayCost.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Incidentals & Taxes</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>₹{(totalIncidentals + tax).toFixed(2)}</td>
                </tr>
                <tr style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  <td style={{ padding: '15px 12px' }}>Total Amount Due</td>
                  <td style={{ padding: '15px 12px', textAlign: 'right', color: '#4f46e5' }}>₹{totalBillAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="btn-row" style={{ marginTop: '25px' }}>
            {!guest.checkoutComplete ? (
              <>
                <button className="action-btn secondary" onClick={() => setStep(5)}>Back to Services</button>
                <button className="action-btn pay-btn" onClick={handleCheckoutPayment} disabled={timeLeft > 0}>
                  💳 Settle Balance & Complete Checkout
                </button>
              </>
            ) : (
              <>
                <button className="action-btn secondary" onClick={downloadInvoicePDF}>📥 Download Invoice PDF</button>
                <button className="action-btn" onClick={resetAllPortalState}>Return Home</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}