import React, { useState } from 'react';

export default function Register({ onBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });


      if (!response.ok) {
      const error = await response.json();
      console.error('Server Error:', error);
      alert(error.error || 'Registration failed');
    } else {
      const data = await response.json();
      alert('Registered successfully');
    }
  } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="authBtn" type="submit">Register</button>
        <p>{message && message}</p>
      </form>
      <button className="authBtn" onClick={onBack} style={{ marginTop: '1em' }}>
        Back
      </button>
    </div>
  );
}
