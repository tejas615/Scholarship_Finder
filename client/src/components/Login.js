import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';  // useHistory for v5

export default function Login({ onBack }) {
  const history = useHistory(); // get history object for navigation

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Login successful!');
        localStorage.setItem('token', data.token);
        window.dispatchEvent(new Event('storage'));
        history.push('/scholarships/scholarships');  // v5 navigation
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      setMessage('An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className='auth-form'>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="authBtn" type="submit">Login</button>
        <button type="button" className="authBtn" onClick={onBack}>Back</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
