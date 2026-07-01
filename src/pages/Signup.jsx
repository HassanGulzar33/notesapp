import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { doSignUp, doConfirmSignUp, doSignIn } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('signup'); // signup | confirm
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await doSignUp(email, password);
      setStep('confirm');
    } catch (err) {
      setError(err.message || 'Could not create account.');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await doConfirmSignUp(email, code);
      await doSignIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Could not confirm account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: '48px 20px', maxWidth: 420 }}>
      <h1>Create Account</h1>
      <hr className="seam-divider" />
      {step === 'signup' ? (
        <form onSubmit={handleSignup} style={{ marginTop: 20 }}>
          <div className="form-field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirm} style={{ marginTop: 20 }}>
          <p style={{ fontSize: 14, color: '#6b6558' }}>Enter the verification code sent to {email}.</p>
          <div className="form-field">
            <label>Verification Code</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} required />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Confirming...' : 'Confirm & Sign In'}
          </button>
        </form>
      )}
    </div>
  );
}
