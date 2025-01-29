import { useState } from 'react'
import abi from './abi.json'
import {ethers} from 'ethers'
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  const [balance, setUserBalance] = useState(0)
  const [amount, setUserAmount] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  const ContractAddress = "0x82aB560eFc8264b158663b21aEd395D886a53206";


  async function requestAccounts() {
    await window.ethereum.request({method: "eth_requestAccounts"})
    const accounts = await window.ethereum.request({method: "eth_accounts"})

    setWalletAddress(accounts[0])
  }

  async function getBalance() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(ContractAddress, abi, provider)
      const tx = await contract.getBalance()
      setUserBalance(ethers.formatEther(tx))
      toast.success(`Your Balance is: ${ethers.formatEther(tx)} ETH`)
      
    }
  }

  async function setAmount() {
    if(!amount)
    if(window.ethereum){ await requestAccounts()}
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(ContractAddress, abi, signer)
      const tx = await contract.deposit(ethers.parseEther(amount), {
        value: ethers.parseEther(amount)
      })
      await tx.wait()
      toast.success('Deposit Successful')
      getBalance()
    } catch (error) {
      toast.error("Please enter a value")
    }
  }

  async function withdrawAmount() {
    if(window.ethereum){ await requestAccounts()}
    
    if(amount || !amount) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(ContractAddress, abi, signer)
        const tx = await contract.withdraw(ethers.parseEther(amount))
      await tx.wait()
      toast.success('withdrawal sucessfull')
      getBalance()
      } catch (error) {
        toast.error('Please enter a value')
      }
    }
  }

  return (
    <div className='App'>
      <h1>Omoh Dapp</h1>
      <button onClick={requestAccounts} className='connect-btn'>Connect Wallet</button>
      <p className='p'>{walletAddress ? walletAddress : 'No wallet Connected'}</p>


      <button onClick={getBalance} className='getbalance-btn'>Get Balance</button>
      <p>Contract Balance: {balance}</p>
      <div>
        <input type="number"
        placeholder='Enter the value in wei'
        className='input'
        value={amount}
        onChange={(e) => {setUserAmount(e.target.value)}}
        />

        <button onClick={setAmount} className='button1'>Deposit</button>
        <button onClick={withdrawAmount} className='button2'>Withdraw</button>
      </div>

      <ToastContainer />
    </div>
  )
}

export default App