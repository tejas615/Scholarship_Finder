import React, { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

// Add this country list somewhere above or import from a file
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
  "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil",
  "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon",
  "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile",
  "China", "Colombia", "Comoros", "Congo (Brazzaville)", "Congo",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
  "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
  "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos",
  "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
  "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
  "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland",
  "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
  "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const incomeOptions = [
  "<1 Lakh",
  "1 Lakh - 5 Lakh",
  "5 Lakh - 8 Lakh",
  "Above 8 Lakh"
];

export default function Register({ onBack }) {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // NEW STATES
  const [institute, setInstitute] = useState('');
  const [course, setCourse] = useState('');
  const [gpa, setGpa] = useState('');
  const [location, setLocation] = useState('');
  const [incomeStatus, setIncomeStatus] = useState('');
  const [countrySearch, setCountrySearch] = useState('');

  const [message, setMessage] = useState('');

  // Filter countries by search string for type-search dropdown
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countries;
    return countries.filter(country =>
      country.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/register', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          institute,
          course,
          gpa,
          location,
          incomeStatus
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        const error = await response.json();
        console.error('Server Error:', error);
        alert(error.error || 'Registration failed');
      } else {
        alert('Registered successfully');
        localStorage.setItem('token', data.token);
        window.dispatchEvent(new Event('storage'));
        history.push('/scholarships/scholarships');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Existing fields unchanged */}
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

        {/* NEW FIELDS */}

        <label>Institute</label>
        <input
          type="text"
          value={institute}
          onChange={(e) => setInstitute(e.target.value)}
          required
        />

        <label>Course of Study</label>
        <input
          type="text"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />

        <label>GPA / Grades</label>
        <input
          type="text"
          value={gpa}
          onChange={(e) => setGpa(e.target.value)}
          required
        />

        <label>Location (Country)</label>
        <input
          type="text"
          placeholder="Type to search country..."
          value={countrySearch}
          onChange={(e) => setCountrySearch(e.target.value)}
          autoComplete="off"
          required
        />
        <select
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setCountrySearch(e.target.value);}}
          size={5} // to show multiple options as dropdown list
          required
          style={{ width: '100%', marginBottom: '1em' }}
        >
          <option value="" disabled>
            Select country from list
          </option>
          {filteredCountries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <label>Income Status</label>
        <select
          value={incomeStatus}
          onChange={(e) => setIncomeStatus(e.target.value)}
          required
        >
          <option value="">Select income status</option>
          {incomeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <button className="authBtn" type="submit">Register</button>
        <p>{message && message}</p>
      </form>
      <button className="authBtn" onClick={onBack} style={{ marginTop: '1em' }}>
        Back
      </button>
    </div>
  );
}
