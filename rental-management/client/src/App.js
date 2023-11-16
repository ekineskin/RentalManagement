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

  const handleGetUser = async () => {
    try {
      const user = await contract.methods.getUser().call({ from: account });

      console.log('Tip: ' + user[0] + ' İsim: ' + user[1] + ' Soyisim: ' + user[2]);
    } catch (error) {
      console.error('Hata:', error.message);
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
            surname={surname}
            handleGetUser={handleGetUser}
          />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
