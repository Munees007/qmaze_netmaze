import React, { useState } from 'react';
import axios from 'axios';

const UserPopupForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [className, setClassName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/.netlify/functions/submitUserData', { email, name, rollNumber, className });
      onClose(); // Close the popup after successful submission
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="popup-form">
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} placeholder="Roll Number" required />
        <input type="text" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Class Name" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserPopupForm;
