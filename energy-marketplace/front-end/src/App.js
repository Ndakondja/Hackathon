import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import LogoImage from './Green_Energy_Trading_logo.jpg';
import './logo.css'; 
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import algosdk from "algosdk";
import { auth, db } from './firebase.js';

function Logo() {
  return (
    <div className="text-center">
      <img src={LogoImage} alt="Logo" className="logo-image" />
    </div>
  );
}

function ElectricityMarketplace() {
  const [availableElectricity, setAvailableElectricity] = useState("");
  const [electricityAmount, setElectricityAmount] = useState("");

  // Algorand network settings
  const algodToken = "5vYgmsOoW02XVU1Xb8PLm9gizCZODOyY39RZfaOL";
  const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
  const headers = {
    "X-API-Key": algodToken,
  };
  const client = new algosdk.Algodv2(algodToken, algodServer, undefined, headers);

  // Smart contract details
  const contractAddress = "EBNOCG6IW2OMUOWANTBOIIA3WGCJXBT53ZNYG2XVLLCPDRUNRQJ4MQUJYU";
  const contractAppId = "257631878"; 

  // Fetch available electricity from the contract
  const fetchAvailableElectricity = async () => {
    try {
      const accountInfo = await client.accountInformation(contractAddress);
  
      // Check if the contract exists in the local state
      if (accountInfo.appsLocalState && accountInfo.appsLocalState[contractAppId]) {
        const appLocalState = accountInfo.appsLocalState[contractAppId];
        const availableElectricity = appLocalState["seller2_quantity"]; 
                setAvailableElectricity(availableElectricity);
      } else {
        console.log("Contract not found in the local state.");
      }
    } catch (error) {
      console.error("Error fetching available electricity:", error);
    }
  };
  
  
  // Buy electricity function
  const buyElectricity = async () => {
    // Prepare the transaction
   const passphrase = "scheme cherry fox theory net match rely matter link color genuine genius bone ketchup repeat bread bless senior smile fash minimum proof replace absent reopen";
       const params = await client.getTransactionParams().do();
    const sender = algosdk.mnemonicToSecretKey(passphrase).addr; 
    const txn = algosdk.makeApplicationNoOpTxn(
      sender,
      params,
      contractAppId,
      [],
      algosdk.encodeUint64(electricityAmount)
    );

    // Sign the transaction
    const signedTxn = txn.signTxn(algosdk.mnemonicToSecretKey(passphrase).sk); // Replace with your sender mnemonic
    const txId = signedTxn.txID().toString();

    // Submit the transaction to the network
    await client.sendRawTransaction(signedTxn).do();
    console.log("Transaction sent. TxID: ", txId);

    // Wait for transaction confirmation and update available electricity
    await client.waitForConfirmation(txId);
    console.log("Transaction confirmed. TxID: ", txId);

    // Fetch and display updated available electricity
    await fetchAvailableElectricity();
  };

  // Fetch available electricity on component mount
  useEffect(() => {
    fetchAvailableElectricity();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-3">Energy Marketplace</h2>
      <h3 className="mb-3">Buy Electricity</h3>
      <div className="mb-3">
        <label htmlFor="electricityAmount" className="form-label">
          Available Electricity:
        </label>
        <p className="form-control" id="electricityAmount">
          {availableElectricity}
        </p>
      </div>
      <div className="mb-3">
        <label htmlFor="amountInput" className="form-label">
          Enter electricity amount:
        </label>
        <input
          type="number"
          className="form-control"
          id="amountInput"
          value={electricityAmount}
          onChange={(e) => setElectricityAmount(e.target.value)}
          placeholder="Enter electricity amount"
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={buyElectricity}
        disabled={!electricityAmount}
      >
        Buy
      </button>
    </div>
  );
  
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // 
  };

  return (
    <div className="container mt-5">
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      // Create user with email and password
      const { user } = await auth.createUserWithEmailAndPassword(email, password);

      // Save user details to Firestore
      await db.collection('users').doc(user.uid).set({
        name,
        email,
        address,
        meterNumber,
        walletAddress,
      });

      // Clear input fields
      setName('');
      setEmail('');
      setPassword('');
      setAddress('');
      setMeterNumber('');
      setWalletAddress('');

      // Registration success message or redirect to the next page
      console.log('Registration successful!');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleRegistration}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address:
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="meterNumber" className="form-label">
            Meter Number:
          </label>
          <input
            type="text"
            className="form-control"
            id="meterNumber"
            value={meterNumber}
            onChange={(e) => setMeterNumber(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="walletAddress" className="form-label">
            Wallet Address:
          </label>
          <input
            type="text"
            className="form-control"
            id="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <header>
        <Logo />
      </header>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/electricity-marketplace" element={<ElectricityMarketplace />} />
      </Routes>
    </Router>
  );
}

export default App;
