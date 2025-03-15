import React, { useState } from 'react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(''); // "doctor" or "patient"
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    healthCard: '', // for patients only
    licenseId: '',  // for doctors only
  });

  // Handle change for all input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Placeholder function for login; replace with Gadget's auth call
  const handleLogin = async () => {
    try {
      // Example: await gadgetAuth.login(formData.email, formData.password);
      console.log('Logging in with:', formData);
      // Redirect or show dashboard after successful login
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Placeholder function for signup; replace with Gadget's auth call
  const handleSignup = async () => {
    try {
      // Build the signup payload depending on the selected role
      const payload = {
        email: formData.email,
        password: formData.password,
        role, // "doctor" or "patient"
      };

      // Add verification fields based on role
      if (role === 'patient') {
        payload.healthCard = formData.healthCard;
      } else if (role === 'doctor') {
        payload.licenseId = formData.licenseId;
      }

      console.log('Signing up with:', payload);
      // Example: await gadgetAuth.signup(payload);
      // Redirect or show confirmation after successful signup
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>{isLogin ? 'Login' : 'Signup'}</h1>
      <div style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          style={styles.input}
        />
        {!isLogin && (
          <div style={styles.signupExtra}>
            <p>Please select your role:</p>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="role"
                value="patient"
                checked={role === 'patient'}
                onChange={() => setRole('patient')}
              />
              Patient
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="role"
                value="doctor"
                checked={role === 'doctor'}
                onChange={() => setRole('doctor')}
              />
              Doctor
            </label>

            {role === 'patient' && (
              <input
                type="text"
                name="healthCard"
                placeholder="Health Card Number"
                value={formData.healthCard}
                onChange={handleInputChange}
                style={styles.input}
              />
            )}
            {role === 'doctor' && (
              <input
                type="text"
                name="licenseId"
                placeholder="Government License ID"
                value={formData.licenseId}
                onChange={handleInputChange}
                style={styles.input}
              />
            )}
          </div>
        )}
        <button
          onClick={isLogin ? handleLogin : handleSignup}
          style={styles.button}
        >
          {isLogin ? 'Login' : 'Signup'}
        </button>
      </div>
      <p style={styles.toggleText}>
        {isLogin ? (
          <>
            Don't have an account?{' '}
            <span style={styles.toggleLink} onClick={() => { setIsLogin(false); setRole(''); }}>
              Signup here
            </span>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <span style={styles.toggleLink} onClick={() => setIsLogin(true)}>
              Login here
            </span>
          </>
        )}
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  signupExtra: {
    textAlign: 'left',
  },
  radioLabel: {
    marginRight: '10px',
  },
  toggleText: {
    marginTop: '20px',
  },
  toggleLink: {
    color: '#007bff',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

export default AuthPage;
