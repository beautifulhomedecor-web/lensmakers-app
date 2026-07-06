// Complete Authentication Flow Component — Prompt 3 of 10
// Studio-Grade Apple Liquid Glass UI, Spring Physics, Full OTP & Password Reset Suites
const { useState, useEffect, useRef } = React;

const AuthModal = ({ onLoginSuccess, onExploreGuest }) => {
  // Navigation View State: 'login' | 'signup' | 'otp' | 'forgot' | 'reset-confirm' | 'reset-password'
  const [view, setView] = useState('login');
  const [activeTab, setActiveTab] = useState('login'); // For segmented control

  // Form Fields State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup Fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Validation & Error States (on blur)
  const [loginError, setLoginError] = useState(null);
  const [signupErrors, setSignupErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Submission Status: 'idle' | 'loading' | 'success' | 'error'
  const [submitStatus, setSubmitStatus] = useState('idle');

  // OTP Verification State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const otpInputRefs = useRef([]);

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // OTP Timer Countdown
  useEffect(() => {
    let interval = null;
    if (view === 'otp' && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [view, otpTimer]);

  // Handle Tab Switch with animation
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setView(tab);
    setSubmitStatus('idle');
    setLoginError(null);
    setSignupErrors({});
  };

  // Auto-format India mobile number (space after 5 digits)
  const handleMobileChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 10);
    if (val.length > 5) {
      val = val.slice(0, 5) + ' ' + val.slice(5);
    }
    setMobileNumber(val);
  };

  // Password Strength Calculation
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };

  const strengthScore = getPasswordStrength(signupPassword || loginPassword);
  const strengthLabels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#EF5350', '#EF5350', '#FF7A30', '#FFB300', '#43A047'];

  // Field Blur Validation
  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const errors = { ...signupErrors };

    if (field === 'fullName') {
      if (fullName.trim().length < 2 || !fullName.trim().includes(' ')) {
        errors.fullName = 'Please enter both first and last name';
      } else {
        delete errors.fullName;
      }
    }
    if (field === 'signupEmail') {
      if (!signupEmail.includes('@') || !signupEmail.includes('.')) {
        errors.signupEmail = 'Please enter a valid email address';
      } else {
        delete errors.signupEmail;
      }
    }
    if (field === 'confirmPassword') {
      if (confirmPassword !== signupPassword) {
        errors.confirmPassword = 'Passwords do not match';
      } else {
        delete errors.confirmPassword;
      }
    }
    setSignupErrors(errors);
  };

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword) {
      setLoginError('Invalid email or password. Please try again.');
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 600);
      return;
    }
    setSubmitStatus('loading');
    setLoginError(null);

    setTimeout(() => {
      setSubmitStatus('success');
      setTimeout(() => {
        const userData = { name: loginIdentifier.includes('@') ? 'Alex Rivera' : 'VIP Member', email: loginIdentifier, member: true };
        localStorage.setItem('lensmakers_token', 'jwt_token_demo_999');
        localStorage.setItem('lensmakers_user', JSON.stringify(userData));
        if (onLoginSuccess) onLoginSuccess(userData);
      }, 380);
    }, 1200);
  };

  // Handle Signup Submit
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !signupEmail || !mobileNumber || !signupPassword || !termsAgreed) {
      setSignupErrors({ general: 'Please fill all fields and accept Terms of Service.' });
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 600);
      return;
    }
    setSubmitStatus('loading');
    setTimeout(() => {
      setSubmitStatus('idle');
      setView('otp');
      setOtpTimer(30);
    }, 1000);
  };

  // Handle OTP Digit Input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Paste handling
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      pasted.forEach((digit, idx) => {
        if (idx < 6) newOtp[idx] = digit;
      });
      setOtp(newOtp);
      if (pasted.length === 6) {
        verifyOtpSubmit(newOtp.join(''));
      } else if (otpInputRefs.current[pasted.length]) {
        otpInputRefs.current[pasted.length].focus();
      }
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setOtpError(false);

    // Auto-focus next
    if (digit && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }

    // Auto-submit on last digit
    if (index === 5 && digit) {
      const fullCode = newOtp.join('');
      verifyOtpSubmit(fullCode);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpInputRefs.current[index - 1]) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const verifyOtpSubmit = (codeToVerify) => {
    const code = codeToVerify || otp.join('');
    if (code === '000000') {
      // Demo error state
      setOtpError(true);
      showToast('❌ Invalid verification code. Try 123456');
      setTimeout(() => {
        setOtp(['', '', '', '', '', '']);
        setOtpError(false);
        if (otpInputRefs.current[0]) otpInputRefs.current[0].focus();
      }, 500);
      return;
    }
    setSubmitStatus('loading');
    setTimeout(() => {
      setSubmitStatus('success');
      showToast('🎉 Number verified! Welcome to Lens Makers.');
      setTimeout(() => {
        const userData = { name: fullName || 'New Member', phone: '+91 ' + mobileNumber, member: true };
        localStorage.setItem('lensmakers_token', 'jwt_token_demo_new');
        localStorage.setItem('lensmakers_user', JSON.stringify(userData));
        if (onLoginSuccess) onLoginSuccess(userData);
      }, 380);
    }, 1200);
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setTimeout(() => {
      setSubmitStatus('idle');
      setView('reset-confirm');
    }, 1000);
  };

  // Handle Reset Password Submit
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setTimeout(() => {
      setSubmitStatus('success');
      showToast('🔒 Password updated successfully! Please sign in.');
      setTimeout(() => {
        setSubmitStatus('idle');
        setView('login');
        setActiveTab('login');
      }, 500);
    }, 1000);
  };

  // Render Spinner vs Checkmark inside buttons
  const renderBtnContent = (label) => {
    if (submitStatus === 'loading') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF', animation: 'spinSlow 0.8s infinite linear' }} />
          <span>Please wait...</span>
        </div>
      );
    }
    if (submitStatus === 'success') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#FFFFFF', fontWeight: '800' }}>
          <span style={{ fontSize: '18px' }}>✓</span>
          <span>Success! Redirecting...</span>
        </div>
      );
    }
    return <span>{label}</span>;
  };

  return (
    <div className="auth-container screen-transition-enter">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="lens-toast">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AMBIENT BACKGROUND GLOW BLOBS */}
      <div className="ambient-blobs-container" style={{ pointerEvents: 'none' }}>
        <div className="ambient-blob-1" style={{ width: '450px', height: '450px', top: '10%', left: '15%' }} />
        <div className="ambient-blob-2" style={{ width: '400px', height: '400px', bottom: '15%', right: '10%' }} />
      </div>

      <div className="auth-card-wrapper">
        {/* TOP SECTION: Pulsing Logo & Welcome Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', position: 'relative' }}>
            {/* Pulsing Pink Glow behind Icon */}
            <div 
              className="pulse-glow-circle" 
              style={{ position: 'absolute', width: '80px', height: '80px', top: '-10px', zIndex: 0, opacity: 0.6 }} 
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <window.Logo size={52} />
            </div>
          </div>

          {view === 'login' && (
            <>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.5px' }}>Welcome back</h1>
              <p style={{ fontSize: '14px', color: '#A0A4C8', marginTop: '6px' }}>Sign in to your account to continue</p>
            </>
          )}
          {view === 'signup' && (
            <>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.5px' }}>Create Account</h1>
              <p style={{ fontSize: '14px', color: '#A0A4C8', marginTop: '6px' }}>Join Lens Makers Club for 3D Try-On & perks</p>
            </>
          )}
          {view === 'otp' && (
            <>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF' }}>Verify your number</h1>
              <p style={{ fontSize: '13px', color: '#A0A4C8', marginTop: '6px' }}>
                We sent a 6-digit code to +91 {mobileNumber ? mobileNumber.slice(-5).padStart(11, 'X ') : 'XXXXX XXXXX'}
              </p>
              <span 
                style={{ color: '#FF4D8D', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'inline-block', marginTop: '6px' }}
                onClick={() => setView('signup')}
              >
                Change number
              </span>
            </>
          )}
          {(view === 'forgot' || view === 'reset-confirm' || view === 'reset-password') && (
            <>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF' }}>Password Recovery</h1>
              <p style={{ fontSize: '13px', color: '#A0A4C8', marginTop: '6px' }}>Securely reset your account password</p>
            </>
          )}
        </div>

        {/* TAB TOGGLE (Only shown in Login / Signup views) */}
        {(view === 'login' || view === 'signup') && (
          <div className="auth-segmented-control">
            <div 
              className="auth-segment-slider"
              style={{ left: activeTab === 'login' ? '6px' : 'calc(50% - 0px)' }}
            />
            <button
              type="button"
              className={`auth-segment-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('login')}
            >
              Log In
            </button>
            <button
              type="button"
              className={`auth-segment-btn ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('signup')}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* ==========================================================================
           VIEW 1: LOGIN FORM
           ========================================================================== */}
        {view === 'login' && (
          <div className="glass-card-elevated fade-up-item" style={{ padding: '28px 22px' }}>
            <form onSubmit={handleLoginSubmit}>
              {/* Field 1: Email or Phone */}
              <div className="glass-input-wrapper mb-3" style={{ position: 'relative' }}>
                <i data-lucide="mail" style={{ position: 'absolute', left: '16px', top: '16px', width: '18px', height: '18px', color: '#A0A4C8', zIndex: 2 }} />
                <input
                  type="text"
                  className={`glass-input ${submitStatus === 'error' && !loginIdentifier ? 'error' : ''}`}
                  style={{ paddingLeft: '48px', width: '100%' }}
                  placeholder="Email or mobile number"
                  value={loginIdentifier}
                  inputMode={/^\d+$/.test(loginIdentifier) ? 'numeric' : 'text'}
                  onChange={(e) => {
                    setLoginError(null);
                    setLoginIdentifier(e.target.value);
                  }}
                />
              </div>

              {/* Field 2: Password */}
              <div className="glass-input-wrapper mb-1" style={{ position: 'relative' }}>
                <i data-lucide="lock" style={{ position: 'absolute', left: '16px', top: '16px', width: '18px', height: '18px', color: '#A0A4C8', zIndex: 2 }} />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  className={`glass-input ${submitStatus === 'error' && !loginPassword ? 'error' : ''}`}
                  style={{ paddingLeft: '48px', paddingRight: '48px', width: '100%' }}
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginError(null);
                    setLoginPassword(e.target.value);
                  }}
                />
                <button
                  type="button"
                  style={{ position: 'absolute', right: '14px', top: '14px', background: 'transparent', border: 'none', color: '#A0A4C8', cursor: 'pointer', zIndex: 2 }}
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  <i data-lucide={showLoginPassword ? 'eye-off' : 'eye'} style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              {/* Forgot Password Link */}
              <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                <span
                  style={{ fontSize: '12px', color: '#FF4D8D', fontWeight: '700', cursor: 'pointer' }}
                  onClick={() => setView('forgot')}
                >
                  Forgot Password?
                </span>
              </div>

              {/* Error Message Below */}
              {loginError && (
                <div style={{ color: '#EF5350', fontSize: '13px', fontWeight: '600', marginBottom: '16px', textAlign: 'center', animation: 'toastPop 200ms ease' }}>
                  ⚠️ {loginError}
                </div>
              )}

              {/* Primary Log In CTA */}
              <button
                type="submit"
                className="btn-primary-pill"
                style={{
                  width: '100%', height: '54px', fontSize: '16px', fontWeight: '800',
                  pointerEvents: submitStatus !== 'idle' ? 'none' : 'auto',
                  animation: submitStatus === 'error' ? 'shakeOscillation 300ms ease' : 'none'
                }}
              >
                {renderBtnContent('Log In')}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '26px 0', gap: '14px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: '12px', color: '#A0A4C8', fontWeight: '600' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* Social Login Row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <button 
                  type="button" 
                  className="social-btn-circle"
                  onClick={() => showToast('Connecting to Google Auth...')}
                >
                  <span style={{ fontSize: '20px', fontWeight: '900', background: 'linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>G</span>
                </button>
                <span style={{ fontSize: '10px', color: '#A0A4C8', display: 'block', marginTop: '6px', fontWeight: '600' }}>Google</span>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button 
                  type="button" 
                  className="social-btn-circle"
                  onClick={() => showToast('Connecting to Apple ID...')}
                >
                  <i data-lucide="apple" style={{ width: '22px', height: '22px', color: '#FFFFFF' }} />
                </button>
                <span style={{ fontSize: '10px', color: '#A0A4C8', display: 'block', marginTop: '6px', fontWeight: '600' }}>Apple</span>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button 
                  type="button" 
                  className="social-btn-circle"
                  onClick={() => showToast('Connecting to Facebook...')}
                >
                  <span style={{ fontSize: '22px', fontWeight: '900', color: '#1877F2' }}>f</span>
                </button>
                <span style={{ fontSize: '10px', color: '#A0A4C8', display: 'block', marginTop: '6px', fontWeight: '600' }}>Facebook</span>
              </div>
            </div>

            {/* Bottom Switch to Signup */}
            <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '18px' }}>
              <span style={{ fontSize: '13px', color: '#A0A4C8' }}>Don't have an account? </span>
              <span
                style={{ fontSize: '13px', color: '#FF4D8D', fontWeight: '700', cursor: 'pointer' }}
                onClick={() => handleTabSwitch('signup')}
              >
                Sign Up
              </span>
            </div>

            {/* Continue as Guest */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                className="btn-secondary-pill"
                style={{ width: '100%', height: '42px', fontSize: '13px' }}
                onClick={() => {
                  if (onExploreGuest) onExploreGuest();
                }}
              >
                <span>Continue as Guest</span>
                <span style={{ color: '#A0A4C8' }}>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ==========================================================================
           VIEW 2: SIGN UP FORM
           ========================================================================== */}
        {view === 'signup' && (
          <div className="glass-card-elevated fade-up-item" style={{ padding: '26px 22px' }}>
            <form onSubmit={handleSignupSubmit}>
              {/* Field 1: Full Name */}
              <div className="glass-input-wrapper mb-3" style={{ position: 'relative' }}>
                <i data-lucide="user" style={{ position: 'absolute', left: '16px', top: '16px', width: '18px', height: '18px', color: '#A0A4C8', zIndex: 2 }} />
                <input
                  type="text"
                  className={`glass-input ${touchedFields.fullName && signupErrors.fullName ? 'error' : fullName.trim().includes(' ') ? 'success' : ''}`}
                  style={{ paddingLeft: '48px', paddingRight: '44px', width: '100%' }}
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                />
                {fullName.trim().includes(' ') && fullName.length > 3 && (
                  <span style={{ position: 'absolute', right: '16px', top: '14px', color: '#43A047', fontWeight: 'bold', fontSize: '16px' }}>✓</span>
                )}
              </div>
              {touchedFields.fullName && signupErrors.fullName && (
                <div style={{ color: '#EF5350', fontSize: '12px', marginTop: '-18px', marginBottom: '14px', fontWeight: '600' }}>⚠️ {signupErrors.fullName}</div>
              )}

              {/* Field 2: Email Address */}
              <div className="glass-input-wrapper mb-3" style={{ position: 'relative' }}>
                <i data-lucide="mail" style={{ position: 'absolute', left: '16px', top: '16px', width: '18px', height: '18px', color: '#A0A4C8', zIndex: 2 }} />
                <input
                  type="email"
                  className={`glass-input ${touchedFields.signupEmail && signupErrors.signupEmail ? 'error' : signupEmail.includes('@') && signupEmail.includes('.') ? 'success' : ''}`}
                  style={{ paddingLeft: '48px', width: '100%' }}
                  placeholder="your@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  onBlur={() => handleBlur('signupEmail')}
                />
              </div>
              {touchedFields.signupEmail && signupErrors.signupEmail && (
                <div style={{ color: '#EF5350', fontSize: '12px', marginTop: '-18px', marginBottom: '14px', fontWeight: '600' }}>⚠️ {signupErrors.signupEmail}</div>
              )}

              {/* Field 3: Mobile Number with +91 Prefix */}
              <div className="glass-input-wrapper mb-3" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div 
                  style={{ 
                    position: 'absolute', left: '8px', zIndex: 2,
                    background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '8px',
                    fontSize: '13px', fontWeight: '700', color: '#FFFFFF', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                  onClick={() => showToast('🇮🇳 India (+91) selected by default')}
                  title="Change Country Code"
                >
                  <span>🇮🇳 +91</span>
                  <span style={{ fontSize: '10px', color: '#A0A4C8' }}>▼</span>
                </div>
                <input
                  type="text"
                  className="glass-input"
                  style={{ paddingLeft: '90px', width: '100%' }}
                  placeholder="10-digit mobile number"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                />
              </div>

              {/* Field 4: Password with Strength Meter */}
              <div className="glass-input-wrapper mb-2" style={{ position: 'relative' }}>
                <i data-lucide="lock" style={{ position: 'absolute', left: '16px', top: '16px', width: '18px', height: '18px', color: '#A0A4C8', zIndex: 2 }} />
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  className="glass-input"
                  style={{ paddingLeft: '48px', paddingRight: '48px', width: '100%' }}
                  placeholder="Create Password (min 8 chars)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
                <button
                  type="button"
                  style={{ position: 'absolute', right: '14px', top: '14px', background: 'transparent', border: 'none', color: '#A0A4C8', cursor: 'pointer', zIndex: 2 }}
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  <i data-lucide={showSignupPassword ? 'eye-off' : 'eye'} style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              {/* 4-Segment Strength Bar */}
              {signupPassword.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="strength-meter-bar"
                        style={{
                          background: level <= strengthScore ? strengthColors[strengthScore] : 'rgba(255,255,255,0.1)',
                          boxShadow: level <= strengthScore ? `0 0 8px ${strengthColors[strengthScore]}` : 'none'
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700' }}>
                    <span style={{ color: '#A0A4C8' }}>Password Strength:</span>
                    <span style={{ color: strengthColors[strengthScore] }}>{strengthLabels[strengthScore]}</span>
                  </div>
                </div>
              )}

              {/* Field 5: Confirm Password */}
              <div className="glass-input-wrapper mb-3" style={{ position: 'relative' }}>
                <i data-lucide="lock" style={{ position: 'absolute', left: '16px', top: '16px', width: '18px', height: '18px', color: '#A0A4C8', zIndex: 2 }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`glass-input ${touchedFields.confirmPassword && signupErrors.confirmPassword ? 'error' : confirmPassword && confirmPassword === signupPassword ? 'success' : ''}`}
                  style={{ paddingLeft: '48px', paddingRight: '48px', width: '100%' }}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                />
                {confirmPassword && confirmPassword === signupPassword && (
                  <span style={{ position: 'absolute', right: '40px', top: '14px', color: '#43A047', fontWeight: 'bold', fontSize: '16px' }}>✓</span>
                )}
                <button
                  type="button"
                  style={{ position: 'absolute', right: '14px', top: '14px', background: 'transparent', border: 'none', color: '#A0A4C8', cursor: 'pointer', zIndex: 2 }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i data-lucide={showConfirmPassword ? 'eye-off' : 'eye'} style={{ width: '18px', height: '18px' }} />
                </button>
              </div>
              {touchedFields.confirmPassword && signupErrors.confirmPassword && (
                <div style={{ color: '#EF5350', fontSize: '12px', marginTop: '-18px', marginBottom: '14px', fontWeight: '600' }}>⚠️ {signupErrors.confirmPassword}</div>
              )}

              {/* Terms Checkbox */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', cursor: 'pointer' }} onClick={() => setTermsAgreed(!termsAgreed)}>
                <div 
                  style={{
                    width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, marginTop: '2px',
                    background: termsAgreed ? 'linear-gradient(135deg, #FF4D8D 0%, #C2185B 100%)' : 'rgba(27,31,74,0.8)',
                    border: termsAgreed ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: termsAgreed ? '0 0 10px rgba(255,77,141,0.6)' : 'inset 0 1px 2px rgba(0,0,0,0.4)',
                    transition: 'all 200ms var(--spring-bezier)'
                  }}
                >
                  {termsAgreed && <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '900' }}>✓</span>}
                </div>
                <span style={{ fontSize: '12px', color: '#A0A4C8', lineHeight: '1.4' }}>
                  I agree to the <span style={{ color: '#FF4D8D', fontWeight: '700' }} onClick={(e) => { e.stopPropagation(); showToast('📜 Opening Terms of Service...'); }}>Terms of Service</span> and <span style={{ color: '#FF4D8D', fontWeight: '700' }} onClick={(e) => { e.stopPropagation(); showToast('🔒 Opening Privacy Policy...'); }}>Privacy Policy</span>
                </span>
              </div>

              {signupErrors.general && (
                <div style={{ color: '#EF5350', fontSize: '13px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' }}>
                  ⚠️ {signupErrors.general}
                </div>
              )}

              {/* Primary Create Account CTA */}
              <button
                type="submit"
                className="btn-primary-pill"
                style={{
                  width: '100%', height: '54px', fontSize: '16px', fontWeight: '800',
                  pointerEvents: submitStatus !== 'idle' ? 'none' : 'auto',
                  animation: submitStatus === 'error' ? 'shakeOscillation 300ms ease' : 'none'
                }}
              >
                {renderBtnContent('Create Account & Continue')}
              </button>
            </form>

            <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '22px', paddingTop: '16px' }}>
              <span style={{ fontSize: '13px', color: '#A0A4C8' }}>Already a member? </span>
              <span
                style={{ fontSize: '13px', color: '#FF4D8D', fontWeight: '700', cursor: 'pointer' }}
                onClick={() => handleTabSwitch('login')}
              >
                Log In
              </span>
            </div>

            {/* Continue as Guest */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                className="btn-secondary-pill"
                style={{ width: '100%', height: '42px', fontSize: '13px' }}
                onClick={() => {
                  if (onExploreGuest) onExploreGuest();
                }}
              >
                <span>Continue as Guest</span>
                <span style={{ color: '#A0A4C8' }}>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ==========================================================================
           VIEW 3: OTP VERIFICATION SCREEN
           ========================================================================== */}
        {view === 'otp' && (
          <div className="glass-card-elevated fade-up-item" style={{ padding: '32px 24px', position: 'relative' }}>
            {/* Back Chevron Top-Left */}
            <button
              type="button"
              style={{
                position: 'absolute', top: '16px', left: '16px',
                width: '36px', height: '36px', borderRadius: '18px',
                background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
              }}
              onClick={() => setView('signup')}
              title="Back"
            >
              ←
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px', marginTop: '10px' }}>
              <p style={{ fontSize: '13px', color: '#A0A4C8', marginBottom: '16px' }}>
                Enter the 6-digit verification code sent to your mobile
              </p>

              {/* 6 Square OTP Inputs */}
              <div 
                style={{ 
                  display: 'flex', justifyContent: 'center', gap: '8px',
                  animation: otpError ? 'shakeOscillation 300ms ease' : 'none'
                }}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={6} // allow paste
                    className={`otp-input-square ${digit ? 'filled' : ''}`}
                    style={{ borderColor: otpError ? '#EF5350' : digit ? '#43A047' : 'rgba(255,255,255,0.18)' }}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>
              {otpError && (
                <div style={{ color: '#EF5350', fontSize: '12px', marginTop: '12px', fontWeight: '700' }}>
                  ⚠️ Invalid OTP code. (Hint: enter 123456)
                </div>
              )}
            </div>

            {/* Timer & Resend */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              {otpTimer > 0 ? (
                <span style={{ fontSize: '13px', color: '#A0A4C8', fontWeight: '600' }}>
                  Resend code in <span style={{ color: '#FFFFFF' }}>0:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</span>
                </span>
              ) : (
                <span
                  style={{ fontSize: '14px', color: '#FF4D8D', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => {
                    setOtpTimer(30);
                    showToast('📱 New OTP sent! (Demo code: 123456)');
                  }}
                >
                  Resend Verification Code
                </span>
              )}
            </div>

            {/* Verify CTA */}
            <button
              type="button"
              className="btn-primary-pill"
              style={{ width: '100%', height: '54px', fontSize: '16px', fontWeight: '800' }}
              onClick={() => verifyOtpSubmit()}
              disabled={submitStatus === 'loading' || submitStatus === 'success'}
            >
              {renderBtnContent('Verify & Login')}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <span style={{ fontSize: '11px', color: '#6B6E9A' }}>
                💡 Tip: You can type any valid 6-digit code or paste it directly!
              </span>
            </div>
          </div>
        )}

        {/* ==========================================================================
           VIEW 4: FORGOT PASSWORD STEP 1
           ========================================================================== */}
        {view === 'forgot' && (
          <div className="glass-card-elevated fade-up-item" style={{ padding: '32px 24px', position: 'relative' }}>
            <button
              type="button"
              style={{
                position: 'absolute', top: '16px', left: '16px',
                width: '36px', height: '36px', borderRadius: '18px',
                background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
              }}
              onClick={() => setView('login')}
            >
              ←
            </button>

            <form onSubmit={handleForgotSubmit} style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '13px', color: '#A0A4C8', marginBottom: '20px', lineHeight: '1.5' }}>
                Enter your registered mobile number or email address and we'll send you a secure link to reset your password.
              </p>

              <div className="glass-input-wrapper mb-4" style={{ position: 'relative' }}>
                <i data-lucide="mail" style={{ position: 'absolute', left: '16px', top: '16px', width: '18px', height: '18px', color: '#A0A4C8', zIndex: 2 }} />
                <input
                  type="text"
                  required
                  className="glass-input"
                  style={{ paddingLeft: '48px', width: '100%' }}
                  placeholder="Email or mobile number"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-primary-pill"
                style={{ width: '100%', height: '54px', fontSize: '16px', fontWeight: '800' }}
                disabled={submitStatus === 'loading'}
              >
                {renderBtnContent('Send Reset Link')}
              </button>
            </form>
          </div>
        )}

        {/* ==========================================================================
           VIEW 5: FORGOT PASSWORD STEP 2 (CONFIRMATION CARD)
           ========================================================================== */}
        {view === 'reset-confirm' && (
          <div className="glass-card-elevated fade-up-item" style={{ padding: '36px 24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '32px', background: 'rgba(67, 160, 71, 0.2)', border: '2px solid #43A047', color: '#43A047', fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 24px rgba(67, 160, 71, 0.4)' }}>
              ✓
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF', marginBottom: '10px' }}>Check your messages</h2>
            <p style={{ fontSize: '13px', color: '#A0A4C8', lineHeight: '1.5', marginBottom: '28px' }}>
              We sent a password reset link to <strong style={{ color: '#FFFFFF' }}>{loginIdentifier || 'your email/mobile'}</strong>. Click the link to update your password.
            </p>

            <button
              type="button"
              className="btn-secondary-pill"
              style={{ width: '100%', height: '48px', fontSize: '14px', marginBottom: '12px' }}
              onClick={() => {
                setView('login');
                setActiveTab('login');
              }}
            >
              <span>Back to Log In</span>
            </button>

            {/* Demo Helper to Try Step 2 */}
            <div style={{ borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '16px', marginTop: '16px' }}>
              <span style={{ fontSize: '11px', color: '#6B6E9A', display: 'block', marginBottom: '8px' }}>Demo Mode Testing:</span>
              <button
                type="button"
                style={{ background: 'transparent', border: '1px solid #FF4D8D', color: '#FF4D8D', padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                onClick={() => setView('reset-password')}
              >
                Simulate Clicking Reset Link →
              </button>
            </div>
          </div>
        )}

        {/* ==========================================================================
           VIEW 6: FORGOT PASSWORD STEP 3 (NEW PASSWORD)
           ========================================================================== */}
        {view === 'reset-password' && (
          <div className="glass-card-elevated fade-up-item" style={{ padding: '32px 24px', position: 'relative' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px', textAlign: 'center' }}>Create New Password</h2>
            <p style={{ fontSize: '13px', color: '#A0A4C8', marginBottom: '24px', textAlign: 'center' }}>Ensure it is at least 8 characters with numbers & symbols</p>

            <form onSubmit={handleResetPasswordSubmit}>
              <div className="glass-input-wrapper mb-3" style={{ position: 'relative' }}>
                <i data-lucide="lock" style={{ position: 'absolute', left: '16px', top: '16px', width: '18px', height: '18px', color: '#A0A4C8', zIndex: 2 }} />
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  required
                  className="glass-input"
                  style={{ paddingLeft: '48px', paddingRight: '48px', width: '100%' }}
                  placeholder="New Password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
                <button
                  type="button"
                  style={{ position: 'absolute', right: '14px', top: '14px', background: 'transparent', border: 'none', color: '#A0A4C8', cursor: 'pointer', zIndex: 2 }}
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  <i data-lucide={showSignupPassword ? 'eye-off' : 'eye'} style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              {/* Strength meter */}
              {signupPassword.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="strength-meter-bar"
                        style={{
                          background: level <= strengthScore ? strengthColors[strengthScore] : 'rgba(255,255,255,0.1)',
                          boxShadow: level <= strengthScore ? `0 0 8px ${strengthColors[strengthScore]}` : 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="glass-input-wrapper mb-4" style={{ position: 'relative' }}>
                <i data-lucide="lock" style={{ position: 'absolute', left: '16px', top: '16px', width: '18px', height: '18px', color: '#A0A4C8', zIndex: 2 }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="glass-input"
                  style={{ paddingLeft: '48px', paddingRight: '48px', width: '100%' }}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-primary-pill"
                style={{ width: '100%', height: '54px', fontSize: '16px', fontWeight: '800' }}
                disabled={submitStatus === 'loading'}
              >
                {renderBtnContent('Update Password')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

window.AuthModal = AuthModal;
