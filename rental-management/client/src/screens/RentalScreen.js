import React, { useEffect } from 'react';

const RentalScreen = ({ account, userType, name, surname, handleGetUser }) => {
  useEffect(() => {
    handleGetUser();
  }, [handleGetUser]);

  return (
    <div>
      <h2 className="card-header">Rental Information</h2>
      <div className="card">
        <p className="card-description">{account}</p>
        <p className="card-description">{userType}</p>
        <p className="card-description">{name}</p>
        <p className="card-description">{surname}</p>
      </div>
    </div>
  );
};

export default RentalScreen;
