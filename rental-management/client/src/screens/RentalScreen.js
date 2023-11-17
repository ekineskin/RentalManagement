import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import UserProperties from '../helpers/UserProperties';
import '../App.css'

const RentalScreen = ({ account, userType, name, propertyType, setPropertType, publicAddress, setPublicAddress, handleAddProperty, userProperties, handleGetUserProperties }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    handleGetUserProperties();
  }, [handleGetUserProperties]);

  const handleButtonClick = () => {
    if (userType === 'owner') {
      setIsFormVisible(true);
    }
  };

  const closeForm = () => {
    setIsFormVisible(false);
  };

  const handleSelect = (selectedType) => {
    setPropertType(selectedType);
  };

  const renderForm = () => {
    return (
      <div className='form'>
        <p className="card-text">
          Select property type.
        </p>        
        <div className='card-container'>
          <div
            className={`button-card ${propertyType === 'home' ? 'selected' : ''}`}
            onClick={() => handleSelect('home')}
          >
            Home
          </div>
          <div
            className={`button-card ${propertyType === 'shop' ? 'selected' : ''}`}
            onClick={() => handleSelect('shop')}
          >
            Shop
          </div>
        </div>
        <p className="card-text">
          Please fill out the form completely.
        </p>
        <div className='input-container'>
          <input
            type="text"
            placeholder="Public Address"
            className="form-input"
            value={publicAddress}
            onChange={(e) => setPublicAddress(e.target.value)}
          />          
          <button onClick={handleAddProperty}>Add Property</button>
          <button onClick={closeForm}>Close Form</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className='rental-header'>
        <h2 className="card-header">Welcome {name}!</h2>
        {userType === 'owner' && (
          <button className='rental-button' onClick={handleButtonClick}>Add Property</button>
        )}
      </div>      
      <div className="card">
        <p className="card-description">{account}</p>
      </div>
      <Modal
        isOpen={isFormVisible}
        onRequestClose={closeForm}
        contentLabel="Add Property Form"
        className="react-modal-content" 
        overlayClassName="react-modal-overlay"
      >
        {renderForm()}
      </Modal>
      <UserProperties userProperties={userProperties} />
    </div>
  );
};

export default RentalScreen;
