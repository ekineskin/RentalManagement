import React, { useState } from 'react';
import Web3 from 'web3';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import configuration from './utils/RentalContract.json';
import HomeScreen from './screens/HomeScreen';
import UserScreen from './screens/UserScreen';
import RentalScreen from './screens/RentalScreen';

const App = () => {
  const [account, setAccount] = useState('');
  const [userType, setUserType] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [publicAddress, setPublicAddress] = useState('');
  const [userProperties, setUserProperties] = useState([]);

  const CONTRACT_ADDRESS = configuration.networks['5777'].address;
  const CONTRACT_ABI = configuration.abi;

  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');
  const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

  const handleGetContract = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0])

      console.log('Connected account:', account);
      const balance = await web3.eth.getBalance(account);
      console.log('Hesap Bakiyesi:', web3.utils.fromWei(balance, 'ether'), 'ETH');
    } catch (error) {
      console.error('Error getting accounts:', error);
    }
  };

  const handleRegisterUser = async (userType, name, surname) => {
    if (!account) return alert('Please connect your wallet first!');

    try {
      const transaction = await contract.methods.registerUser(userType, name, surname);

      console.log('User registered successfully!', transaction);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleAddProperty = async () => {
    try {
      if (!account) {
        alert('Please connect your wallet first!');
        return;
      }
  
      if (userType !== 'owner') {
        alert('Only property owners can add a property!');
        return;
      }
  
      if (!propertyType || !publicAddress) {
        alert('Please fill out the form completely!');
        return;
      }
  
      // Add try-catch block to handle contract execution errors
      try {
        const transaction = await contract.methods.addProperty(account, propertyType, publicAddress);
        console.log('Property added successfully!', transaction);
      } catch (contractError) {
        console.error('Error executing smart contract:', contractError);
      }
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };
  
  const handleGetUserProperties = async () => {
    try {
      const userAddress = account;
      const userProps = await contract.methods.getUserProperties().call({ from: userAddress });
      setUserProperties(userProps);
    } catch (error) {
      console.error('Error getting user properties:', error.message);
    }
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomeScreen handleGetContract={handleGetContract} account={account} setAccount={setAccount} />} />
          <Route path="/user/:id" element={<UserScreen
            account={account}
            userType={userType}
            setUserType={setUserType}
            name={name}
            setName={setName}
            surname={surname}
            setSurname={setSurname}
            handleRegisterUser={handleRegisterUser}
          />} />
          <Route path="/rental" element={<RentalScreen
            account={account}
            userType={userType}
            name={name}
            propertyType={propertyType}
            setPropertType={setPropertyType}
            publicAddress={publicAddress}
            setPublicAddress={setPublicAddress}
            handleAddProperty={handleAddProperty}
            userProperties={userProperties}
            handleGetUserProperties={handleGetUserProperties}
          />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
