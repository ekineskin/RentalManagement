import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const UserScreen = ({
  account,
  userType,
  setUserType,
  name,
  setName,
  surname,
  setSurname,
  handleRegisterUser,
}) => {
  const handleSelect = (selectedType) => {
    setUserType(selectedType);
  };

  const handleContinue = () => {
    handleRegisterUser(userType, name, surname);
  };

  return (
    <div>
      <h2 className="card-header">Welcome!</h2>
      <div className="card">
        <p className="card-description">{account}</p>
      </div>
      <div className='form'>
        <p className="card-text">
          Select user type.
        </p>        
        <div className='card-container'>
          <div
            className={`button-card ${userType === 'owner' ? 'selected' : ''}`}
            onClick={() => handleSelect('owner')}
          >
            Owner
          </div>
          <div
            className={`button-card ${userType === 'tenant' ? 'selected' : ''}`}
            onClick={() => handleSelect('tenant')}
          >
            Tenant
          </div>
        </div>
        <p className="card-text">
          Please fill out the form completely.
        </p>
        <div className='input-container'>
          <input
            type="text"
            placeholder="Name"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Surname"
            className="form-input"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
          <Link to="/rental">
            <button onClick={handleContinue}>Continue</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserScreen;
