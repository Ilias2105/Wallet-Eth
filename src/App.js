import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from 'ethers';
import Wallet from './artifacts/contracts/Wallet.sol/Wallet.json';

const  WalletAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {

  const [balance, setBalance] = useState(0);
  const [amountSend, setAmountSend] = useState();
  const [amountWithdraw, setAmountWithdraw] = useState();
  const [error, setError] = useState('');//error message
  const [success, setSuccess] = useState('');// success message

  useEffect(() => {
    getBalance();
  }, [])


  async function getBalance() {
    if(typeof window.ethereum !== 'undefined') { // verification metamask
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});//recover accounts
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(WalletAddress, Wallet.abi, provider);//creation of an instance of the contract with the address, the abi and the provider
      try {
        let overrides = {
          from: accounts[0] //address of the person calling this function
        }
        const data = await contract.getBalance(overrides); //recover the amount that the user has in his wallet
        setBalance(String(data));//convert data to string to avoid having problems with big numbers.
      }
      catch(err) {
        setError('An error has occurred.');
      }
    }
  }

  async function transfer() {
    if(!amountSend) {
      return;
    }
    setError('');
    setSuccess('');
    if(typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum); 
      const signer = provider.getSigner(); //It's a transaction, we need to sign
      try {
        const tx = {
          from: accounts[0],
          to: WalletAddress,
          value: ethers.utils.parseEther(amountSend)//specify that it is in ether
        }
        const transaction = await signer.sendTransaction(tx);
        await transaction.wait();
        setAmountSend('');
        getBalance();
        setSuccess('Your money has been successfully transferred to the wallet!')
      }
      catch(err) {
        setError('An error has occurred.');
      }
    }
}

async function withdraw() {
  if(!amountWithdraw) {
    return;
  }
  setError('');
  setSuccess('');
  const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(WalletAddress, Wallet.abi, signer);
  try {
    const transaction = await contract.withdrawMoney(accounts[0], ethers.utils.parseEther(amountWithdraw));
    await transaction.wait();
    setAmountWithdraw('');
    getBalance();
    setSuccess('Your money has been successfully withdrawn from the wallet!');
  }
  catch(err) {
    setError('An error has occurred.');
  }
}

function changeAmountSend(e) {
  setAmountSend(e.target.value); 
}

function changeAmountWithdraw(e) {
  setAmountWithdraw(e.target.value);
}

  return (
    <div className="bg-dark">
      <div className="container">
        {error && <h3 className="text-danger">{error}</h3>}
        {success && <h3 className="text-success">{success}</h3>}
        <div className='d-flex justify-content-center'>
        <div className="card col-3 mt-5 mb-5 bg-light">
          <h4 className='text-center m-3'>Amount in my wallet : {balance / 10**18} <span className="eth">Eth</span></h4> {/* convert wei to eth */}
          <img className='text-center m-3 rounded-circle' src='/ethlogo.png' alt=""  height="250" />
          <div className="row m-2"></div>
                <input type="form-control" className='form-control mt-4' placeholder="Deposit Amount" onChange={changeAmountSend} />
                <button className="btn btn-success m-2" onClick={transfer}>Deposit</button>
                <input type="form-control" className='form-control mt-4' placeholder="Withdraw Amount" onChange={changeAmountWithdraw} />
                <button className="btn btn-success m-2 mb-5" onClick={withdraw}>Withdraw</button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;
