import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from './abi.json'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const contractAddress = "0x82aB560eFc8264b158663b21aEd395D886a53206";


function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const initializeEthers = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _contract = new ethers.Contract(contractAddress, abi, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);
        toast.success("MetaMask connected successfully!");
        toast.success("deposit successful");
      } else {
        alert("Please install MetaMask to use this application.");
      }
    };
    initializeEthers();
  }, []);

  const getBalance = async () => {
    if (contract) {
      const _balance = await contract.getBalance();
      setBalance(ethers.formatEther(_balance));
    }
  };

  const deposit = async () => {
    if (contract && amount) {
      try {
        const tx = await contract.deposit(ethers.parseEther(amount), {
          value: ethers.parseEther(amount),
        });
        await tx.wait();
        toast.success("deposited sucessful");
        getBalance();
      } catch (error) {
        // console.error(error);
        toast.error("Deposit failed!");
      }
    }
  };

  const withdraw = async () => {
    if (contract && amount) {
      try {
        const tx = await contract.withdraw(ethers.parseEther(amount));
        await tx.wait();
        toast.success("Withdrawal successful!");
        getBalance();
      } catch (error) {
        console.error(error);
        if (error.code === "CALL_EXCEPTION") {
          toast.error("Insufficient balance for withdrawal.");
        } else {
          toast.error("Withdrawal failed!");
        }
      }
    }
  };

  return (
    <>
    <div className="App">
      <h1>Assessment DApp</h1>
      <div>
        <button onClick={getBalance}>Get Balance</button>
        <p>Contract Balance: {balance} ETH</p>
      </div>
      <div>
        <input
          type="number"
          className="input"
          placeholder="Enter amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={deposit} className="button1">Deposit</button>
        <button onClick={withdraw} className="button2">Withdraw</button>
      </div>
    </div>
      <ToastContainer/>

    </>
  );
}

export default App;
