import React, { useEffect, useState } from 'react';
import "./styles.css"

export default function Profile({ history }) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/api/profile', {
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setMessage('Failed to fetch profile info');
        }
      } catch (err) {
        setMessage('Error fetching profile');
      }
    };

    fetchProfile();
  }, []);

  const goBack = () => {
    history.push('/scholarships/scholarships');
  };

  if (message) return <div>{message}</div>;

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Institute:</strong> {user.institute}</p>
      <p><strong>Course:</strong> {user.course}</p>
      <p><strong>GPA/Grades:</strong> {user.gpa}</p>
      <p><strong>Location:</strong> {user.location}</p>
      <p><strong>Income Status:</strong> {user.incomeStatus}</p>

      <button onClick={goBack}>Back</button>
    </div>
  );
}
