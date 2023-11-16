import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const HomeScreen = ({ handleGetContract, account }) => {
  return (
    <div className="app">
      <div className="header">
        <img
          src="https://img.imgyukle.com/2023/11/10/yyVObe.png"
          alt="wallet"
          className="image"
        />
        <div className="card">
          <h2 className="card-header">Rental Management</h2>
          <p className="card-description">
            Welcome to my Paribu-Hub Smart Contract & Solidity Bootcamp Final Project. Please connect wallet.
          </p>
          {account ? (
            <Link to={`/user/${account}`}>
              <button>Continue</button>
            </Link>              
          ) : (
            <button onClick={handleGetContract}>Connect Wallet</button>
          )}          
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
