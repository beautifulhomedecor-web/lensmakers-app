// Prescription Management System — Prompt 8 of 10
// Storing, viewing, adding, uploading, and using eye prescriptions
const { useState, useMemo } = React;

let INITIAL_PRESCRIPTIONS = [
  {
    id: 'rx-1',
    name: 'lensmakers Clinical Record — Khammam',
    patientName: 'Rahul Verma',
    ageGender: '28 / Male',
    mobile: '9030317333',
    doctor: 'Dr. Srinivas Rao, Chief Optometrist',
    clinic: 'lensmakers — Jami Banda Road, Opp. New Arogya Hospital, Khammam - 507001',
    issuedDate: '2026-06-20',
    validUntil: '2028-06-20',
    status: 'Valid',
    od: { sph: '-2.50', cyl: '-0.75', axis: '180', add: '+1.25' },
    os: { sph: '-2.25', cyl: '-0.50', axis: '175', add: '+1.25' },
    pd: '63mm (Single PD)',
    distVision: '6/6 (Normal)',
    nearVision: 'N6 (Clear)',
    recommendations: ['Blue Cut Lens', 'Anti-Glare Coating'],
    notes: 'Recommended Blue Cut anti-glare lenses for daily screen comfort.',
    uploadPreview: null
  },
  {
    id: 'rx-2',
    name: 'lensmakers Glaucoma & Vision Check',
    patientName: 'Sneha Reddy',
    ageGender: '34 / Female',
    mobile: '9030317333',
    doctor: 'Dr. K. Lakshmi, MD Ophthalmology',
    clinic: 'lensmakers Flagship Clinic, Khammam',
    issuedDate: '2025-08-10',
    validUntil: '2027-08-10',
    status: 'Valid',
    od: { sph: '-1.75', cyl: '-1.50', axis: '90', add: '0.00' },
    os: { sph: '-1.50', cyl: '-1.25', axis: '85', add: '0.00' },
    pd: 'R: 31.5mm / L: 31.5mm (Dual PD)',
    distVision: '6/6',
    nearVision: 'N6',
    recommendations: ['Progressive Lens', 'Anti-Glare Coating'],
    notes: 'Mild astigmatism corrected. Zeiss DriveSafe coating advised.',
    uploadPreview: null
  },
  {
    id: 'rx-3',
    name: 'lensmakers Annual Eye Test — Old Rx',
    patientName: 'Vijay Kumar',
    ageGender: '45 / Male',
    mobile: '9030317333',
    doctor: 'Dr. S. K. Verma',
    clinic: 'lensmakers Optical Diagnostics, Khammam',
    issuedDate: '2023-01-15',
    validUntil: '2025-01-15',
    status: 'Expired',
    od: { sph: '-1.25', cyl: '0.00', axis: '0', add: '0.00' },
    os: { sph: '-1.00', cyl: '0.00', axis: '0', add: '0.00' },
    pd: '62mm',
    distVision: '6/9',
    nearVision: 'N8',
    recommendations: ['Single Vision'],
    notes: 'Previous prescription. Replaced by June 2026 update.',
    uploadPreview: null
  }
];

const PrescriptionScreen = ({ onSelectTab, initialViewMode = 'list' }) => {
  const [viewMode, setViewMode] = useState(initialViewMode); // 'list' | 'add' | 'detail' | 'checkout_demo'
  const [validityFilter, setValidityFilter] = useState('All'); // 'All' | 'Valid' | 'Expiring Soon' | 'Expired'
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [selectedRx, setSelectedRx] = useState(INITIAL_PRESCRIPTIONS[0]);
  const [checkoutSelectedRxId, setCheckoutSelectedRxId] = useState('rx-1');

  // Add Prescription Method Toggle
  const [addMethod, setAddMethod] = useState('manual'); // 'manual' | 'upload'
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMenuRxId, setShowMenuRxId] = useState(null);

  // Manual Form State
  const [rxName, setRxName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [issuedDate, setIssuedDate] = useState('2026-07-04');
  const [validUntil, setValidUntil] = useState('2028-07-04');
  const [pdMode, setPdMode] = useState('single');
  const [pdSingle, setPdSingle] = useState('63');
  const [pdRight, setPdRight] = useState('31.5');
  const [pdLeft, setPdLeft] = useState('31.5');
  const [notes, setNotes] = useState('');

  // Table Inputs
  const [odSph, setOdSph] = useState('-1.50');
  const [odCyl, setOdCyl] = useState('-0.50');
  const [odAxis, setOdAxis] = useState('180');
  const [odAdd, setOdAdd] = useState('0.00');
  const [osSph, setOsSph] = useState('-1.25');
  const [osCyl, setOsCyl] = useState('-0.25');
  const [osAxis, setOsAxis] = useState('175');
  const [osAdd, setOsAdd] = useState('0.00');

  // Unusual value tooltip warning
  const [unusualWarning, setUnusualWarning] = useState(null);

  // Upload Method State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadRxName, setUploadRxName] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered list
  const filteredList = useMemo(() => {
    if (validityFilter === 'All') return prescriptions;
    return prescriptions.filter(item => item.status === validityFilter);
  }, [prescriptions, validityFilter]);

  // Validation on cell blur against Catalog Power Range Limit
  const handleCellBlur = (val, type, eye) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    
    const sphVal = parseFloat(eye === 'os' ? osSph : odSph) || 0;
    const checkSph = type === 'sph' ? num : sphVal;

    if (type === 'sph' && (num < -6.00 || num > 4.00)) {
      setUnusualWarning(`SPH (${val}) is outside standard stock range (Sph -6.00 to +4.00). Custom high-index lab surfacing will be automatically selected.`);
    } else if (type === 'cyl') {
      if (checkSph < -4.00 && checkSph >= -6.00 && (num < -2.00 || num > 2.00)) {
        setUnusualWarning(`CYL (${val}) exceeds stock limit of ±2.00 Cyl for SPH (${checkSph}). (Catalog: Sph -6.00/-2.00 Cyl)`);
      } else if (checkSph >= -4.00 && checkSph <= 0 && (num < -3.00 || num > 3.00)) {
        setUnusualWarning(`CYL (${val}) exceeds stock limit of ±3.00 Cyl for SPH (${checkSph}). (Catalog: -4.00/-3.00)`);
      } else if (checkSph > 0 && checkSph <= 2.00 && (num < -2.00 || num > 2.00)) {
        setUnusualWarning(`CYL (${val}) exceeds stock limit of ±2.00 Cyl for plus SPH (${checkSph}). (Catalog: +2.00/+2.00cyl)`);
      } else if (checkSph > 2.00 && checkSph <= 4.00 && num !== 0) {
        setUnusualWarning(`For SPH above +2.00 (${checkSph}), standard stock is spherical only (upto +4.00 Sph Available). Custom lab surfacing required for Cylinder.`);
      } else if (num < -3.00 || num > 3.00) {
        setUnusualWarning(`CYL (${val}) requires custom lab surfacing.`);
      } else {
        setUnusualWarning(null);
      }
    } else if (type === 'axis' && (num < 0 || num > 180)) {
      setUnusualWarning(`AXIS (${val}) must be between 0 and 180 degrees.`);
    } else {
      setUnusualWarning(null);
    }
  };

  const handleAutoSetValidity = () => {
    const d = new Date(issuedDate);
    d.setFullYear(d.getFullYear() + 2);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setValidUntil(`${yyyy}-${mm}-${dd}`);
    showToast("✓ Valid Until date auto-set to 2 years from issuance!");
  };

  const handleSaveManualRx = () => {
    if (!rxName.trim()) {
      showToast("⚠️ Please enter a Prescription Name (e.g. Dr. Sharma Clinic)");
      return;
    }
    setIsSaving(true);
    showToast("💾 Validating optical parameters & encrypting prescription...");
    setTimeout(() => {
      const newRx = {
        id: `rx-${Date.now()}`,
        name: rxName.trim(),
        doctor: doctorName.trim() ? `Dr. ${doctorName.trim()}` : 'Certified Optometrist',
        clinic: clinicName.trim() || 'Eye Clinic / Hospital',
        issuedDate: issuedDate,
        validUntil: validUntil,
        status: 'Valid',
        od: { sph: odSph || '0.00', cyl: odCyl || '0.00', axis: odAxis || '0', add: odAdd || '0.00' },
        os: { sph: osSph || '0.00', cyl: osCyl || '0.00', axis: osAxis || '0', add: osAdd || '0.00' },
        pd: pdMode === 'single' ? `${pdSingle}mm (Single PD)` : `R: ${pdRight}mm / L: ${pdLeft}mm (Dual PD)`,
        notes: notes.trim() || 'No additional notes recorded.',
        uploadPreview: null
      };
      INITIAL_PRESCRIPTIONS = [newRx, ...INITIAL_PRESCRIPTIONS];
      setPrescriptions(prev => [newRx, ...prev]);
      setIsSaving(false);
      showToast("🎉 Prescription saved! Ready for instant checkout ordering.");
      setViewMode('list');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const handleSaveUploadedRx = () => {
    if (!uploadedFile) {
      showToast("⚠️ Please select or photograph your prescription paper first.");
      return;
    }
    if (!uploadRxName.trim()) {
      showToast("⚠️ Please enter a name for this uploaded prescription.");
      return;
    }
    setIsSaving(true);
    showToast("📤 OCR scanning & securing uploaded document...");
    setTimeout(() => {
      const newRx = {
        id: `rx-${Date.now()}`,
        name: uploadRxName.trim(),
        doctor: 'Doctor Verified via OCR Upload',
        clinic: 'Uploaded Document Record',
        issuedDate: '2026-07-04',
        validUntil: '2028-07-04',
        status: 'Valid',
        od: { sph: '-1.75', cyl: '-0.50', axis: '180', add: '0.00' },
        os: { sph: '-1.50', cyl: '-0.25', axis: '175', add: '0.00' },
        pd: '63mm (Auto-detected)',
        notes: `Uploaded file: ${uploadedFile.name} (${uploadedFile.size})`,
        uploadPreview: uploadedFile.name
      };
      INITIAL_PRESCRIPTIONS = [newRx, ...INITIAL_PRESCRIPTIONS];
      setPrescriptions(prev => [newRx, ...prev]);
      setIsSaving(false);
      showToast("🎉 Uploaded prescription verified and saved!");
      setViewMode('list');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1600);
  };

  const handleDeleteRx = (id, e) => {
    if (e) e.stopPropagation();
    INITIAL_PRESCRIPTIONS = INITIAL_PRESCRIPTIONS.filter(item => item.id !== id);
    setPrescriptions(prev => prev.filter(item => item.id !== id));
    if (selectedRx && selectedRx.id === id) {
      setSelectedRx(null);
      setViewMode('list');
    }
    setShowMenuRxId(null);
    showToast("🗑️ Prescription deleted.");
  };

  const handleSimulateUpload = (type) => {
    showToast(`📷 ${type === 'photo' ? 'Opening device camera...' : 'Opening document browser...'}`);
    setTimeout(() => {
      setUploadedFile({
        name: type === 'photo' ? 'Rx_Photo_Scan_2026.jpg' : 'DrSharma_Prescription_Report.pdf',
        size: type === 'photo' ? '3.2 MB' : '1.8 MB',
        type: type === 'photo' ? 'image' : 'pdf'
      });
      if (!uploadRxName) setUploadRxName("My Prescription Paper 2026");
      showToast("✓ Document attached successfully!");
    }, 800);
  };

  // Share text generator
  const getShareText = (rx) => {
    return `Lens Makers Digital Prescription\n` +
      `Issued: ${rx.issuedDate} | Valid until: ${rx.validUntil}\n` +
      `Doctor: ${rx.doctor} · ${rx.clinic}\n\n` +
      `Right Eye (OD): SPH ${rx.od.sph} / CYL ${rx.od.cyl} / AXIS ${rx.od.axis} / ADD ${rx.od.add}\n` +
      `Left Eye (OS):  SPH ${rx.os.sph} / CYL ${rx.os.cyl} / AXIS ${rx.os.axis} / ADD ${rx.os.add}\n` +
      `PD: ${rx.pd}\n\n` +
      `Notes: ${rx.notes}\n` +
      `Verified by Lens Makers Clinical System.`;
  };

  return (
    <div className="screen-transition-enter" style={{ minHeight: '100vh', paddingBottom: 'calc(72px + env(safe-area-inset-bottom) + 24px)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="lens-toast" style={{ zIndex: 9999 }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SUB-NAV TEST SWITCHER */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '16px var(--screen-padding) 8px', scrollbarWidth: 'none', background: 'rgba(15,21,53,0.9)', position: 'sticky', top: '0', zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {[
          { id: 'list', label: '📋 Saved List', badge: String(prescriptions.length) },
          { id: 'add', label: '➕ Add Prescription', badge: 'NEW' },
          { id: 'checkout_demo', label: '🛒 Checkout Step Demo', badge: 'TEST' }
        ].map((tab) => {
          const isActive = viewMode === tab.id || (viewMode === 'detail' && tab.id === 'list');
          return (
            <button
              key={tab.id}
              type="button"
              style={{
                padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', flexShrink: 0,
                background: isActive ? 'linear-gradient(135deg, #7C4DFF 0%, #FF4D8D 100%)' : 'rgba(27,31,74,0.65)',
                color: isActive ? '#FFFFFF' : '#A0A4C8',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 200ms ease'
              }}
              onClick={() => {
                setShowMenuRxId(null);
                setViewMode(tab.id);
              }}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{ background: isActive ? 'rgba(0,0,0,0.25)' : '#7C4DFF', color: '#FFFFFF', padding: '2px 6px', borderRadius: '999px', fontSize: '9px', fontWeight: '900' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==========================================================================
         SECTION 1: MAIN PRESCRIPTIONS LIST SCREEN
         ========================================================================== */}
      {viewMode === 'list' && (
        <div style={{ padding: '16px var(--screen-padding)' }}>
          {/* Header */}
          <div className="flex-between mb-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => { if (onSelectTab) onSelectTab('profile'); }}
              >
                ←
              </button>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF' }}>My Prescriptions</h1>
            </div>
            <button
              type="button"
              style={{ background: 'transparent', border: 'none', color: '#FF4D8D', fontSize: '15px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => setViewMode('add')}
            >
              <span>+ Add New</span>
            </button>
          </div>

          {/* VALIDITY STATUS TAB ROW */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', scrollbarWidth: 'none' }}>
            {['All', 'Valid', 'Expiring Soon', 'Expired'].map(status => {
              const isSel = validityFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  style={{
                    padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '700',
                    background: isSel ? 'linear-gradient(135deg, #FF4D8D, #C2185B)' : 'rgba(255,255,255,0.05)',
                    color: '#FFFFFF', border: isSel ? 'none' : '1px solid rgba(255,255,255,0.15)', cursor: 'pointer'
                  }}
                  onClick={() => setValidityFilter(status)}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {/* EMPTY STATE */}
          {filteredList.length === 0 ? (
            <div className="glass-card-standard" style={{ padding: '48px 20px', textAlign: 'center', margin: '20px 0' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'rgba(41,182,246,0.15)', border: '2px dashed #29B6F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', margin: '0 auto 16px' }}>
                👁️+
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px' }}>
                No prescriptions saved yet
              </h3>
              <p style={{ fontSize: '14px', color: '#A0A4C8', maxWidth: '280px', margin: '0 auto 24px', lineHeight: '1.5' }}>
                Add your eye prescription to quickly order powered lenses without re-entering details every time.
              </p>
              <button
                type="button"
                className="btn-primary-pill"
                style={{ height: '46px', padding: '0 28px', fontSize: '14px', background: 'linear-gradient(135deg, #FF4D8D, #7C4DFF)' }}
                onClick={() => setViewMode('add')}
              >
                + Add Prescription Now
              </button>
            </div>
          ) : (
            /* PRESCRIPTION CARDS LIST */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredList.map((rx) => {
                const isMenuOpen = showMenuRxId === rx.id;
                return (
                  <div key={rx.id} className="rx-card-cyan" style={{ position: 'relative' }}>
                    {/* TOP ROW */}
                    <div className="flex-between mb-2">
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>👁️ {rx.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* VALIDITY BADGE */}
                        {rx.status === 'Valid' && (
                          <span className="badge-pill badge-green" style={{ padding: '3px 10px', fontSize: '10px' }}>✓ Valid</span>
                        )}
                        {rx.status === 'Expiring Soon' && (
                          <span className="badge-pill badge-expiring" style={{ padding: '3px 10px', fontSize: '10px', borderRadius: '999px' }}>⏳ Expiring Soon</span>
                        )}
                        {rx.status === 'Expired' && (
                          <span className="badge-pill badge-orange" style={{ background: '#EF5350', color: '#FFFFFF', padding: '3px 10px', fontSize: '10px' }}>✕ Expired</span>
                        )}

                        {/* Three Dot Menu Icon */}
                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            style={{ width: '32px', height: '32px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowMenuRxId(isMenuOpen ? null : rx.id);
                            }}
                          >
                            ⋮
                          </button>

                          {/* Menu Sheet Dropdown */}
                          {isMenuOpen && (
                            <div
                              style={{ position: 'absolute', top: '38px', right: '0', width: '180px', background: '#1B1F4A', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '12px', boxShadow: '0 12px 32px rgba(0,0,0,0.6)', zIndex: 100, padding: '6px 0', overflow: 'hidden' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button type="button" className="menu-item-btn" style={{ width: '100%', padding: '10px 14px', textAlign: 'left', background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '13px', cursor: 'pointer', display: 'flex', gap: '8px' }} onClick={() => { setSelectedRx(rx); setViewMode('detail'); setShowMenuRxId(null); }}>
                                <span>👁️ View & Edit Details</span>
                              </button>
                              <button type="button" className="menu-item-btn" style={{ width: '100%', padding: '10px 14px', textAlign: 'left', background: 'transparent', border: 'none', color: '#29B6F6', fontSize: '13px', cursor: 'pointer', display: 'flex', gap: '8px' }} onClick={() => { setSelectedRx(rx); setShowShareModal(true); setShowMenuRxId(null); }}>
                                <span>📤 Share with Doctor</span>
                              </button>
                              <button type="button" className="menu-item-btn" style={{ width: '100%', padding: '10px 14px', textAlign: 'left', background: 'transparent', border: 'none', color: '#43A047', fontSize: '13px', cursor: 'pointer', display: 'flex', gap: '8px' }} onClick={() => { showToast(`📄 Downloading medical PDF report for "${rx.name}"...`); setShowMenuRxId(null); }}>
                                <span>📥 Download PDF</span>
                              </button>
                              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
                              <button type="button" className="menu-item-btn" style={{ width: '100%', padding: '10px 14px', textAlign: 'left', background: 'transparent', border: 'none', color: '#EF5350', fontSize: '13px', cursor: 'pointer', display: 'flex', gap: '8px' }} onClick={(e) => handleDeleteRx(rx.id, e)}>
                                <span>🗑️ Delete Record</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* DATE ROW */}
                    <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#A0A4C8', marginBottom: '14px', flexWrap: 'wrap' }}>
                      <span>📅 Issued: {rx.issuedDate}</span>
                      <span>⏳ Valid until: {rx.validUntil}</span>
                    </div>

                    {/* OPTICAL VALUES TABLE (Glass Inset) */}
                    <div className="rx-table-inset mb-3">
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                        <thead>
                          <tr style={{ fontSize: '11px', color: '#29B6F6', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '6px 4px', textAlign: 'left' }}>EYE</th>
                            <th style={{ padding: '6px 4px' }}>SPH</th>
                            <th style={{ padding: '6px 4px' }}>CYL</th>
                            <th style={{ padding: '6px 4px' }}>AXIS</th>
                            <th style={{ padding: '6px 4px' }}>ADD</th>
                          </tr>
                        </thead>
                        <tbody style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '6px 4px', textAlign: 'left' }}>
                              <span style={{ background: 'linear-gradient(90deg, #0083B0, #00A8E8)', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800', display: 'inline-block' }}>Right (OD)</span>
                            </td>
                            <td style={{ padding: '8px 4px', fontWeight: '800', color: rx.od.sph === '0.00' ? 'rgba(255,255,255,0.35)' : '#FFFFFF' }}>{rx.od.sph}</td>
                            <td style={{ padding: '8px 4px', fontWeight: '800', color: rx.od.cyl === '0.00' ? 'rgba(255,255,255,0.35)' : '#FFFFFF' }}>{rx.od.cyl}</td>
                            <td style={{ padding: '8px 4px', fontWeight: '800', color: rx.od.axis === '0' ? 'rgba(255,255,255,0.35)' : '#FFFFFF' }}>{rx.od.axis}°</td>
                            <td style={{ padding: '8px 4px', fontWeight: '800', color: rx.od.add === '0.00' ? 'rgba(255,255,255,0.35)' : '#FFFFFF' }}>{rx.od.add}</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '6px 4px', textAlign: 'left' }}>
                              <span style={{ background: 'linear-gradient(90deg, #388E3C, #43A047)', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800', display: 'inline-block' }}>Left (OS)</span>
                            </td>
                            <td style={{ padding: '8px 4px', fontWeight: '800', color: rx.os.sph === '0.00' ? 'rgba(255,255,255,0.35)' : '#FFFFFF' }}>{rx.os.sph}</td>
                            <td style={{ padding: '8px 4px', fontWeight: '800', color: rx.os.cyl === '0.00' ? 'rgba(255,255,255,0.35)' : '#FFFFFF' }}>{rx.os.cyl}</td>
                            <td style={{ padding: '8px 4px', fontWeight: '800', color: rx.os.axis === '0' ? 'rgba(255,255,255,0.35)' : '#FFFFFF' }}>{rx.os.axis}°</td>
                            <td style={{ padding: '8px 4px', fontWeight: '800', color: rx.os.add === '0.00' ? 'rgba(255,255,255,0.35)' : '#FFFFFF' }}>{rx.os.add}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* PD & VISION MEASUREMENTS ROW */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '10px', marginBottom: '12px' }}>
                      <div className="flex-between mb-1" style={{ fontSize: '12px' }}>
                        <span style={{ color: '#A0A4C8' }}>PD (Pupillary Distance):</span>
                        <span style={{ color: '#FFFFFF', fontWeight: '800', fontFamily: 'monospace' }}>{rx.pd}</span>
                      </div>
                      {rx.distVision && (
                        <div className="flex-between" style={{ fontSize: '12px' }}>
                          <span style={{ color: '#A0A4C8' }}>Distance / Near Vision:</span>
                          <span style={{ color: '#00E676', fontWeight: '700' }}>{rx.distVision} / {rx.nearVision || 'Normal'}</span>
                        </div>
                      )}
                    </div>

                    {/* LENS RECOMMENDATION PILLS */}
                    {rx.recommendations && rx.recommendations.length > 0 && (
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ fontSize: '10px', color: '#00E5FF', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                          ✓ LENS RECOMMENDATION
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {rx.recommendations.map((rec, i) => (
                            <span key={i} style={{ background: 'rgba(0, 229, 255, 0.12)', border: '1px solid rgba(0, 229, 255, 0.3)', color: '#00E5FF', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '14px' }}>
                              ✓ {rec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DOCTOR & CLINIC FOOTER ROW */}
                    {rx.doctor && (
                      <div style={{ fontSize: '11px', color: '#A0A4C8', marginBottom: '14px', lineHeight: '1.4' }}>
                        <div>👨‍⚕️ <strong style={{ color: '#FFF' }}>{rx.doctor}</strong></div>
                        <div style={{ color: '#A0A4C8' }}>📍 {rx.clinic}</div>
                      </div>
                    )}

                    {/* BOTTOM ACTION ROW */}
                    <div className="flex-between" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn-secondary-pill"
                        style={{ height: '38px', padding: '0 18px', fontSize: '12px', borderColor: '#FF4D8D', color: '#FF4D8D', fontWeight: '800' }}
                        onClick={() => {
                          setCheckoutSelectedRxId(rx.id);
                          showToast(`✓ Prescription "${rx.name}" selected for your next powered lens order!`);
                          setViewMode('checkout_demo');
                        }}
                      >
                        ⚡ Use for Order →
                      </button>
                      <button
                        type="button"
                        style={{ background: 'transparent', border: 'none', color: '#A0A4C8', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => {
                          setSelectedRx(rx);
                          setViewMode('detail');
                        }}
                      >
                        View Full Details →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==========================================================================
         SECTION 2: ADD PRESCRIPTION SCREEN (Manual & Upload)
         ========================================================================== */}
      {viewMode === 'add' && (
        <div style={{ padding: '16px var(--screen-padding)' }}>
          {/* Header */}
          <div className="flex-between mb-4">
            <button
              type="button"
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setViewMode('list')}
            >
              ←
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF' }}>Add Eye Prescription</h1>
            <span style={{ width: '36px' }} />
          </div>

          {/* METHOD TOGGLE (Segmented Control) */}
          <div style={{ display: 'flex', background: 'rgba(27,31,74,0.8)', borderRadius: '999px', padding: '4px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '24px' }}>
            {[
              { id: 'manual', label: '✏️ Enter Manually' },
              { id: 'upload', label: '📷 Upload Photo/PDF' }
            ].map(m => {
              const isSel = addMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: '999px', fontSize: '13px', fontWeight: '800',
                    background: isSel ? 'linear-gradient(135deg, #FF4D8D, #C2185B)' : 'transparent',
                    color: isSel ? '#FFFFFF' : '#A0A4C8', border: 'none', cursor: 'pointer', transition: 'all 250ms var(--spring-bezier)'
                  }}
                  onClick={() => setAddMethod(m.id)}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* ==========================================================================
             METHOD A: MANUAL ENTRY FORM
             ========================================================================== */}
          {addMethod === 'manual' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Prescription Name + Suggestion Pills */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '6px' }}>
                  PRESCRIPTION NAME *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sharma Clinic — March 2026"
                  value={rxName}
                  onChange={(e) => setRxName(e.target.value)}
                  style={{ width: '100%', height: '48px', padding: '0 16px', borderRadius: '12px', background: 'rgba(27,31,74,0.8)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                  {['My Prescription', 'Right Eye Focus', 'Dr. Sharma 2026', 'Apollo Optical'].map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      style={{ padding: '4px 10px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#A0A4C8', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      onClick={() => setRxName(sug)}
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Doctor & Clinic */}
              <div className="grid-2" style={{ gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '6px' }}>👨‍⚕️ DOCTOR NAME (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="Dr. Ananya Sharma"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '10px', background: 'rgba(27,31,74,0.8)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '6px' }}>🏥 CLINIC / HOSPITAL</label>
                  <input
                    type="text"
                    placeholder="AIOC Advanced Vision"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '10px', background: 'rgba(27,31,74,0.8)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Dates Row + Auto-Set Link */}
              <div className="grid-2" style={{ gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '6px' }}>📅 DATE ISSUED</label>
                  <input
                    type="date"
                    value={issuedDate}
                    onChange={(e) => setIssuedDate(e.target.value)}
                    style={{ width: '100%', height: '44px', padding: '0 10px', borderRadius: '10px', background: 'rgba(27,31,74,0.8)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <div className="flex-between mb-1">
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8' }}>⏳ VALID UNTIL</label>
                    <span style={{ fontSize: '10px', color: '#FF4D8D', cursor: 'pointer', textDecoration: 'underline', fontWeight: '700' }} onClick={handleAutoSetValidity}>
                      + Set 2Y Auto
                    </span>
                  </div>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    style={{ width: '100%', height: '44px', padding: '0 10px', borderRadius: '10px', background: 'rgba(27,31,74,0.8)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '13px' }}
                  />
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#6B6E9A', marginTop: '-10px' }}>Most optometry prescriptions are valid for 1-2 years from date of assessment.</div>

              {/* UNUSUAL VALUE WARNING TOOLTIP */}
              {unusualWarning && (
                <div style={{ background: 'rgba(251,192,45,0.15)', border: '1.5px solid #FBC02D', padding: '12px', borderRadius: '10px', color: '#FBC02D', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', animation: 'fadeIn 200ms ease' }}>
                  <span>⚠️</span>
                  <span>{unusualWarning}</span>
                </div>
              )}

              {/* OPTICAL VALUES TABLE-INPUT (Core Data) */}
              <div className="glass-card-standard" style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>👓 Optical Correction Parameters</span>
                  <span style={{ fontSize: '11px', color: '#29B6F6' }}>Monospace Grid</span>
                </h3>

                {/* POWER RANGE SPECIFICATION BANNER FROM CATALOG */}
                <div style={{ background: 'linear-gradient(135deg, rgba(255,122,48,0.15) 0%, rgba(41,182,246,0.12) 100%)', border: '1px solid rgba(255,122,48,0.3)', borderRadius: '8px', padding: '8px 12px', marginBottom: '12px', fontSize: '11px', color: '#FF7A30', display: 'flex', alignItems: 'center', gap: '8px', lineHeight: '1.4' }}>
                  <span style={{ fontSize: '14px' }}>📏</span>
                  <div>
                    <span style={{ fontWeight: '800', color: '#FFFFFF' }}>POWER RANGE LIMIT:</span>{' '}
                    <span>Sph -6.00/-2.00 Cyl, +2.00/+2.00 Cyl, upto +4.00 Sph Available, -4.00/-3.00 Cyl</span>
                  </div>
                </div>

                <div className="rx-table-inset">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ fontSize: '11px', color: '#29B6F6', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '6px', textAlign: 'left', width: '28%' }}>EYE</th>
                        <th style={{ padding: '6px', width: '18%' }}>SPH</th>
                        <th style={{ padding: '6px', width: '18%' }}>CYL</th>
                        <th style={{ padding: '6px', width: '18%' }}>AXIS</th>
                        <th style={{ padding: '6px', width: '18%' }}>ADD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Right Eye OD Row */}
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '8px 4px', fontSize: '12px', fontWeight: '800', color: '#29B6F6' }}>Right Eye (OD)</td>
                        <td style={{ padding: '6px 2px' }}>
                          <input type="text" className="rx-cell-input" placeholder="0.00" value={odSph} onChange={(e) => setOdSph(e.target.value)} onBlur={(e) => handleCellBlur(e.target.value, 'sph', 'od')} />
                        </td>
                        <td style={{ padding: '6px 2px' }}>
                          <input type="text" className="rx-cell-input" placeholder="0.00" value={odCyl} onChange={(e) => setOdCyl(e.target.value)} onBlur={(e) => handleCellBlur(e.target.value, 'cyl', 'od')} />
                        </td>
                        <td style={{ padding: '6px 2px' }}>
                          <input type="text" className="rx-cell-input" placeholder="0" value={odAxis} onChange={(e) => setOdAxis(e.target.value)} onBlur={(e) => handleCellBlur(e.target.value, 'axis', 'od')} />
                        </td>
                        <td style={{ padding: '6px 2px' }}>
                          <input type="text" className="rx-cell-input" placeholder="0.00" value={odAdd} onChange={(e) => setOdAdd(e.target.value)} />
                        </td>
                      </tr>
                      {/* Left Eye OS Row */}
                      <tr>
                        <td style={{ padding: '8px 4px', fontSize: '12px', fontWeight: '800', color: '#FF4D8D' }}>Left Eye (OS)</td>
                        <td style={{ padding: '6px 2px' }}>
                          <input type="text" className="rx-cell-input" placeholder="0.00" value={osSph} onChange={(e) => setOsSph(e.target.value)} onBlur={(e) => handleCellBlur(e.target.value, 'sph', 'os')} />
                        </td>
                        <td style={{ padding: '6px 2px' }}>
                          <input type="text" className="rx-cell-input" placeholder="0.00" value={osCyl} onChange={(e) => setOsCyl(e.target.value)} onBlur={(e) => handleCellBlur(e.target.value, 'cyl', 'os')} />
                        </td>
                        <td style={{ padding: '6px 2px' }}>
                          <input type="text" className="rx-cell-input" placeholder="0" value={osAxis} onChange={(e) => setOsAxis(e.target.value)} onBlur={(e) => handleCellBlur(e.target.value, 'axis', 'os')} />
                        </td>
                        <td style={{ padding: '6px 2px' }}>
                          <input type="text" className="rx-cell-input" placeholder="0.00" value={osAdd} onChange={(e) => setOsAdd(e.target.value)} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PD (Pupillary Distance) Section */}
              <div className="glass-card-standard" style={{ padding: '16px' }}>
                <div className="flex-between mb-3">
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>📏 Pupillary Distance (PD)</span>
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '999px', padding: '2px' }}>
                    <button
                      type="button"
                      style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '700', background: pdMode === 'single' ? '#7C4DFF' : 'transparent', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                      onClick={() => setPdMode('single')}
                    >
                      Single PD
                    </button>
                    <button
                      type="button"
                      style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '700', background: pdMode === 'dual' ? '#7C4DFF' : 'transparent', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                      onClick={() => setPdMode('dual')}
                    >
                      Dual PD (R/L)
                    </button>
                  </div>
                </div>

                {pdMode === 'single' ? (
                  <div>
                    <input
                      type="number"
                      placeholder="63"
                      value={pdSingle}
                      onChange={(e) => setPdSingle(e.target.value)}
                      style={{ width: '100%', height: '44px', padding: '0 14px', borderRadius: '10px', background: 'rgba(27,31,74,0.8)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', fontSize: '14px', fontFamily: 'monospace' }}
                    />
                    <div style={{ fontSize: '11px', color: '#6B6E9A', marginTop: '6px' }}>Average adult PD is 60mm – 65mm. Measured between centers of pupils.</div>
                  </div>
                ) : (
                  <div className="grid-2" style={{ gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '10px', color: '#A0A4C8', display: 'block', marginBottom: '4px' }}>RIGHT EYE (R-PD)</label>
                      <input type="number" placeholder="31.5" value={pdRight} onChange={(e) => setPdRight(e.target.value)} style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '10px', background: 'rgba(27,31,74,0.8)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', fontSize: '14px', fontFamily: 'monospace' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', color: '#A0A4C8', display: 'block', marginBottom: '4px' }}>LEFT EYE (L-PD)</label>
                      <input type="number" placeholder="31.5" value={pdLeft} onChange={(e) => setPdLeft(e.target.value)} style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '10px', background: 'rgba(27,31,74,0.8)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', fontSize: '14px', fontFamily: 'monospace' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '6px' }}>📝 ADDITIONAL NOTES (OPTIONAL)</label>
                <textarea
                  placeholder="e.g. Recommended Zeiss DuraVision coating, or special lens thinning preference..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', height: '76px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(27,31,74,0.8)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '13px', outline: 'none', resize: 'none' }}
                />
              </div>

              {/* Sticky Save CTA */}
              <div style={{ position: 'sticky', bottom: '16px', zIndex: 20, marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn-primary-pill w-100"
                  style={{ height: '54px', fontSize: '16px', fontWeight: '900', background: 'linear-gradient(135deg, #FF4D8D, #7C4DFF)', boxShadow: '0 8px 24px rgba(255,77,141,0.5)' }}
                  disabled={isSaving}
                  onClick={handleSaveManualRx}
                >
                  <span>{isSaving ? '⌛ Encrypting & Saving Record...' : '💾 Save Prescription Record →'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ==========================================================================
             METHOD B: UPLOAD PHOTO / PDF METHOD
             ========================================================================== */}
          {addMethod === 'upload' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {!uploadedFile ? (
                /* LARGE DASHED DROPZONE */
                <div className="rx-dropzone" onClick={() => handleSimulateUpload('photo')}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', fontSize: '42px', marginBottom: '14px' }}>
                    <span>📷</span>
                    <span style={{ fontSize: '24px', color: 'rgba(255,255,255,0.2)' }}>|</span>
                    <span>📄</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
                    Tap to upload or photograph prescription
                  </h3>
                  <p style={{ fontSize: '12px', color: '#A0A4C8', marginBottom: '20px' }}>
                    Supports JPG, PNG, or PDF hospital reports · Max 10MB
                  </p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="btn-primary-pill"
                      style={{ height: '40px', padding: '0 20px', fontSize: '12px' }}
                      onClick={(e) => { e.stopPropagation(); handleSimulateUpload('photo'); }}
                    >
                      📸 Take Photo
                    </button>
                    <button
                      type="button"
                      className="btn-secondary-pill"
                      style={{ height: '40px', padding: '0 20px', fontSize: '12px', borderColor: '#29B6F6', color: '#29B6F6' }}
                      onClick={(e) => { e.stopPropagation(); handleSimulateUpload('file'); }}
                    >
                      📁 Upload PDF File
                    </button>
                  </div>
                </div>
              ) : (
                /* THUMBNAIL PREVIEW STATE */
                <div className="glass-card-glow-cyan" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
                      {uploadedFile.type === 'image' ? '🖼️' : '📄'}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>{uploadedFile.name}</div>
                      <div style={{ fontSize: '12px', color: '#43A047', fontWeight: '700', marginTop: '2px' }}>✓ OCR Scanned ({uploadedFile.size})</div>
                      <button
                        type="button"
                        style={{ background: 'transparent', border: 'none', color: '#29B6F6', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer', padding: '0', marginTop: '4px' }}
                        onClick={() => showToast(`📄 Opening full-screen document viewer for "${uploadedFile.name}"...`)}
                      >
                        👁️ Preview Document
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{ width: '32px', height: '32px', borderRadius: '16px', background: 'rgba(244,67,54,0.2)', border: 'none', color: '#FF5252', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setUploadedFile(null)}
                    title="Remove File"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Prescription Name field appears after upload */}
              {uploadedFile && (
                <div style={{ animation: 'slideInDown 300ms var(--spring-bezier)' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '6px' }}>
                    GIVE THIS PRESCRIPTION A NAME *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Sharma Clinic — March 2026"
                    value={uploadRxName}
                    onChange={(e) => setUploadRxName(e.target.value)}
                    style={{ width: '100%', height: '48px', padding: '0 16px', borderRadius: '12px', background: 'rgba(27,31,74,0.8)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
                  />
                  <div style={{ fontSize: '11px', color: '#6B6E9A', marginTop: '6px' }}>We automatically extracted OD/OS parameters from your document using AI OCR.</div>

                  <button
                    type="button"
                    className="btn-primary-pill w-100"
                    style={{ height: '50px', fontSize: '15px', fontWeight: '800', boxShadow: '0 0 20px rgba(255,77,141,0.5)' }}
                    onClick={handleSaveManualRx}
                  >
                    💾 Verify & Save Prescription →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==========================================================================
         SECTION 3: PRESCRIPTION DETAIL VIEW (Section 3 of Prompt 8)
         ========================================================================== */}
      {viewMode === 'detail' && selectedRx && (
        <div style={{ padding: '16px var(--screen-padding)' }}>
          {/* Header */}
          <div className="flex-between mb-3">
            <button
              type="button"
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setViewMode('list')}
            >
              ←
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>Prescription Details</h1>
            <button
              type="button"
              style={{ padding: '6px 12px', borderRadius: '999px', background: 'rgba(255,77,141,0.15)', border: '1px solid #FF4D8D', color: '#FF4D8D', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
              onClick={() => { setViewMode('add'); showToast("✏️ Entering edit mode for this record..."); }}
            >
              Edit
            </button>
          </div>

          <div className="rx-card-cyan mb-4">
            <div className="flex-between mb-2">
              <span className="hero-heading" style={{ fontSize: '20px' }}>{selectedRx.name}</span>
              <span className={`badge-pill ${selectedRx.status === 'Valid' ? 'badge-green' : selectedRx.status === 'Expiring Soon' ? 'badge-expiring' : 'badge-orange'}`}>
                {selectedRx.status === 'Valid' ? '✓ Valid' : selectedRx.status === 'Expiring Soon' ? '⏳ Expiring Soon' : '✕ Expired'}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: '700', marginBottom: '2px' }}>{selectedRx.doctor}</div>
            <div style={{ fontSize: '12px', color: '#A0A4C8', marginBottom: '14px' }}>{selectedRx.clinic}</div>

            {/* PATIENT INFO HEADER ROW */}
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px 14px', borderRadius: '12px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex-between mb-2" style={{ fontSize: '13px' }}>
                <span style={{ color: '#A0A4C8' }}>👤 Patient Name:</span>
                <strong style={{ color: '#FFF' }}>{selectedRx.patientName || 'Rahul Verma'}</strong>
              </div>
              <div className="flex-between mb-2" style={{ fontSize: '13px' }}>
                <span style={{ color: '#A0A4C8' }}>🎂 Age / Gender:</span>
                <strong style={{ color: '#FFF' }}>{selectedRx.ageGender || '28 / Male'}</strong>
              </div>
              <div className="flex-between" style={{ fontSize: '13px' }}>
                <span style={{ color: '#A0A4C8' }}>📞 Mobile Number:</span>
                <strong style={{ color: '#00E5FF', fontFamily: 'monospace' }}>{selectedRx.mobile || '9030317333'}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#A0A4C8', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span>📅 Issued: <strong style={{ color: '#FFF' }}>{selectedRx.issuedDate}</strong></span>
              <span>⏳ Valid until: <strong style={{ color: '#FFF' }}>{selectedRx.validUntil}</strong></span>
            </div>

            <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#29B6F6', uppercase: 'true', letterSpacing: '1px', marginBottom: '8px' }}>
              OPTICAL CORRECTION TABLE
            </h4>
            <div className="rx-table-inset mb-4">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                <thead>
                  <tr style={{ fontSize: '11px', color: '#29B6F6', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '6px', textAlign: 'left' }}>EYE</th>
                    <th style={{ padding: '6px' }}>SPH</th>
                    <th style={{ padding: '6px' }}>CYL</th>
                    <th style={{ padding: '6px' }}>AXIS</th>
                    <th style={{ padding: '6px' }}>ADD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '6px 4px', textAlign: 'left' }}>
                      <span style={{ background: 'linear-gradient(90deg, #0083B0, #00A8E8)', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800', display: 'inline-block' }}>Right (OD)</span>
                    </td>
                    <td style={{ padding: '8px 4px', fontWeight: '800', color: selectedRx.od.sph === '0.00' ? 'rgba(255,255,255,0.35)' : '#FFF' }}>{selectedRx.od.sph}</td>
                    <td style={{ padding: '8px 4px', fontWeight: '800', color: selectedRx.od.cyl === '0.00' ? 'rgba(255,255,255,0.35)' : '#FFF' }}>{selectedRx.od.cyl}</td>
                    <td style={{ padding: '8px 4px', color: selectedRx.od.axis === '0' ? 'rgba(255,255,255,0.35)' : '#FFF' }}>{selectedRx.od.axis}°</td>
                    <td style={{ padding: '8px 4px', fontWeight: '800', color: selectedRx.od.add === '0.00' ? 'rgba(255,255,255,0.35)' : '#FFF' }}>{selectedRx.od.add}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 4px', textAlign: 'left' }}>
                      <span style={{ background: 'linear-gradient(90deg, #388E3C, #43A047)', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800', display: 'inline-block' }}>Left (OS)</span>
                    </td>
                    <td style={{ padding: '8px 4px', fontWeight: '800', color: selectedRx.os.sph === '0.00' ? 'rgba(255,255,255,0.35)' : '#FFF' }}>{selectedRx.os.sph}</td>
                    <td style={{ padding: '8px 4px', fontWeight: '800', color: selectedRx.os.cyl === '0.00' ? 'rgba(255,255,255,0.35)' : '#FFF' }}>{selectedRx.os.cyl}</td>
                    <td style={{ padding: '8px 4px', color: selectedRx.os.axis === '0' ? 'rgba(255,255,255,0.35)' : '#FFF' }}>{selectedRx.os.axis}°</td>
                    <td style={{ padding: '8px 4px', fontWeight: '800', color: selectedRx.os.add === '0.00' ? 'rgba(255,255,255,0.35)' : '#FFF' }}>{selectedRx.os.add}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid-2 mb-3" style={{ gap: '12px', fontSize: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px' }}>
                <span style={{ color: '#A0A4C8', display: 'block', fontSize: '10px', fontWeight: '700' }}>PUPILLARY DISTANCE</span>
                <span style={{ color: '#FFF', fontWeight: '800', fontSize: '14px' }}>{selectedRx.pd}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px' }}>
                <span style={{ color: '#A0A4C8', display: 'block', fontSize: '10px', fontWeight: '700' }}>DISTANCE / NEAR VISION</span>
                <span style={{ color: '#00E676', fontWeight: '800', fontSize: '13px' }}>{selectedRx.distVision || '6/6'} / {selectedRx.nearVision || 'N6'}</span>
              </div>
            </div>

            {/* LENS RECOMMENDATIONS BADGES */}
            {selectedRx.recommendations && selectedRx.recommendations.length > 0 && (
              <div style={{ background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.25)', padding: '12px', borderRadius: '10px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#00E5FF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                  ✓ CLINICAL LENS RECOMMENDATION
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedRx.recommendations.map((rec, i) => (
                    <span key={i} style={{ background: '#00E5FF', color: '#0F1535', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '14px' }}>
                      ✓ {rec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedRx.notes && (
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px', borderLeft: '3px solid #FF4D8D', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#FF4D8D', marginBottom: '4px' }}>CLINICAL NOTES</div>
                <div style={{ fontSize: '12px', color: '#FFFFFF', lineHeight: '1.4' }}>{selectedRx.notes}</div>
              </div>
            )}

            {selectedRx.scanFile && (
              <div style={{ background: 'rgba(41,182,246,0.1)', border: '1px solid rgba(41,182,246,0.3)', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>📎</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#FFFFFF' }}>Attached Document Scan</div>
                    <div style={{ fontSize: '10px', color: '#29B6F6' }}>{selectedRx.scanFile}</div>
                  </div>
                </div>
                <button type="button" style={{ padding: '6px 12px', borderRadius: '999px', background: '#29B6F6', border: 'none', color: '#0F1535', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }} onClick={() => alert(`🔍 Opening full-screen zoom preview of medical OCR scan: ${selectedRx.scanFile}`)}>
                  View Scan
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn-primary-pill"
                style={{ flex: 1, height: '46px', fontSize: '14px', background: 'linear-gradient(135deg, #29B6F6, #0288D1)', boxShadow: '0 0 16px rgba(41,182,246,0.4)' }}
                onClick={() => {
                  showToast(`⚡ Selected "${selectedRx.name}" for your order!`);
                  setTimeout(() => { if (onSelectTab) onSelectTab('cart'); }, 1000);
                }}
              >
                ⚡ Use for Next Order
              </button>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn-secondary-pill"
                style={{ flex: 1, height: '44px', fontSize: '12px', borderColor: '#29B6F6', color: '#29B6F6' }}
                onClick={() => setShowShareModal(true)}
              >
                📤 Share with Doctor
              </button>
              <button
                type="button"
                className="btn-secondary-pill"
                style={{ flex: 1, height: '44px', fontSize: '12px', borderColor: '#43A047', color: '#43A047' }}
                onClick={() => showToast(`📥 Downloading signed medical PDF for "${selectedRx.name}"...`)}
              >
                📥 Download PDF
              </button>
            </div>
          </div>

          {/* CATALOG POWER RANGE INFO */}
          <div style={{ background: 'linear-gradient(135deg, rgba(255,122,48,0.15) 0%, rgba(41,182,246,0.12) 100%)', border: '1px solid rgba(255,122,48,0.3)', borderRadius: '8px', padding: '8px 12px', marginBottom: '16px', fontSize: '11px', color: '#FF7A30', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>📏</span>
            <div>
              <span style={{ fontWeight: '800', color: '#FFFFFF' }}>SUPPORTED CATALOG RANGE:</span>{' '}
              <span>Sph -6.00/-2.00 Cyl, +2.00/+2.00cyl, upto +4.00 Sph Available, -4.00/-3.00</span>
            </div>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginBottom: '12px' }}>
            Select Which Prescription to Apply:
          </h3>

          {/* Selectable Radio-Style Prescription Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {prescriptions.map((rx) => {
              const isSel = checkoutSelectedRxId === rx.id;
              return (
                <div
                  key={rx.id}
                  className="glass-card-standard"
                  style={{
                    padding: '16px', cursor: 'pointer', position: 'relative',
                    border: isSel ? '2px solid #FF4D8D' : '1px solid rgba(255,255,255,0.12)',
                    background: isSel ? 'rgba(255,77,141,0.08)' : 'transparent',
                    transform: isSel ? 'scale(1.01)' : 'scale(1)', transition: 'all 200ms ease'
                  }}
                  onClick={() => {
                    setCheckoutSelectedRxId(rx.id);
                    showToast(`✓ Switched to "${rx.name}" for this order!`);
                  }}
                >
                  <div className="flex-between mb-1">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '10px', border: `2px solid ${isSel ? '#FF4D8D' : '#A0A4C8'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isSel && <div style={{ width: '10px', height: '10px', borderRadius: '5px', background: '#FF4D8D' }} />}
                      </div>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF' }}>{rx.name}</span>
                    </div>
                    {isSel && (
                      <span className="badge-pill badge-green" style={{ background: '#FF4D8D', color: '#FFF' }}>SELECTED ✓</span>
                    )}
                  </div>

                  <div style={{ paddingLeft: '28px', fontSize: '12px', color: '#A0A4C8' }}>
                    <div style={{ fontFamily: 'monospace', color: '#29B6F6', fontWeight: '700', margin: '4px 0' }}>
                      OD: SPH {rx.od.sph} / CYL {rx.od.cyl}  |  OS: SPH {rx.os.sph} / CYL {rx.os.cyl}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B6E9A' }}>Issued: {rx.issuedDate} · {rx.doctor}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MISSING PRESCRIPTION ALERT DEMO CARD */}
          <div className="glass-card-glow-cyan mb-4" style={{ padding: '18px', border: '1.5px solid #FBC02D', background: 'rgba(251,192,45,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF' }}>Need a new prescription for this order?</span>
            </div>
            <p style={{ fontSize: '12px', color: '#A0A4C8', marginBottom: '14px', lineHeight: '1.4' }}>
              You can add a new paper scan or book a free online clinical eye test without losing your cart items!
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-primary-pill"
                style={{ flex: 1, height: '40px', fontSize: '12px', background: 'linear-gradient(135deg, #FF4D8D, #7C4DFF)' }}
                onClick={() => setViewMode('add')}
              >
                + Add New Rx Now
              </button>
              <button
                type="button"
                className="btn-secondary-pill"
                style={{ flex: 1, height: '40px', fontSize: '12px', borderColor: '#43A047', color: '#43A047' }}
                onClick={() => { if (onSelectTab) onSelectTab('eyetest'); }}
              >
                👁️ Free Eye Test
              </button>
            </div>
          </div>

          {/* Sticky Checkout Proceed CTA */}
          <div style={{ position: 'sticky', bottom: '16px', zIndex: 20 }}>
            <button
              type="button"
              className="btn-primary-pill w-100"
              style={{ height: '56px', fontSize: '16px', fontWeight: '900', background: 'linear-gradient(135deg, #43A047, #2E7D32)', boxShadow: '0 8px 28px rgba(67,160,71,0.5)' }}
              onClick={() => {
                showToast("🔒 Verifying optical parameters with lens lab & proceeding to payment...");
                setTimeout(() => {
                  if (onSelectTab) onSelectTab('cart');
                }, 1500);
              }}
            >
              <span>🚀 Confirm Prescription & Continue to Payment →</span>
            </button>
          </div>
        </div>
      )}

      {/* ==========================================================================
         SHARE WITH DOCTOR MODAL SHEET
         ========================================================================== */}
      {showShareModal && selectedRx && (
        <div className="modal-backdrop screen-transition-enter" style={{ zIndex: 200 }} onClick={() => setShowShareModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ padding: '24px var(--screen-padding) 30px', maxHeight: '80vh', overflowY: 'auto', borderTop: '2px solid #29B6F6', boxShadow: '0 -20px 60px rgba(41,182,246,0.4)' }}>
            <div className="flex-between mb-3">
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📤 Share with Optometrist / Doctor</span>
              </h2>
              <button type="button" style={{ width: '30px', height: '30px', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFFFFF', cursor: 'pointer' }} onClick={() => setShowShareModal(false)}>
                ✕
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#A0A4C8', marginBottom: '14px' }}>
              Clean formatted medical summary ready for WhatsApp, Email, or Clinical SMS:
            </p>

            {/* Formatted Text Box */}
            <div style={{ background: 'rgba(15,21,53,0.9)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(41,182,246,0.4)', fontFamily: 'monospace', fontSize: '12px', color: '#29B6F6', whiteSpace: 'pre-line', lineHeight: '1.5', marginBottom: '20px' }}>
              {getShareText(selectedRx)}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-primary-pill"
                style={{ flex: 1, height: '48px', fontSize: '14px', fontWeight: '800', background: 'linear-gradient(135deg, #29B6F6, #0288D1)' }}
                onClick={() => {
                  navigator.clipboard ? navigator.clipboard.writeText(getShareText(selectedRx)) : null;
                  showToast("📋 Formatted medical summary copied to clipboard!");
                  setShowShareModal(false);
                }}
              >
                📋 Copy Text Summary
              </button>
              <button
                type="button"
                className="btn-secondary-pill"
                style={{ flex: 1, height: '48px', fontSize: '14px', borderColor: '#FF4D8D', color: '#FF4D8D', fontWeight: '800' }}
                onClick={() => {
                  showToast("💬 Opening WhatsApp / Native Share Sheet...");
                  setShowShareModal(false);
                }}
              >
                💬 Send via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

window.PrescriptionScreen = PrescriptionScreen;
