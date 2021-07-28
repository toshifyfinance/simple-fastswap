import React, { useState } from 'react';
import Web3 from 'web3';
import { Button, TextField } from '@material-ui/core';

import ERC20 from './abis/ERC20.json';
import SwapABI from './abis/SwapABI.json';
import { SwapAddress, FASTAddress, MVPAddress, YFTAddress } from './constants';

function App() {

  const [account, setAccount] = useState();

  const [amountFAST, setAmountFAST] = useState('');
  const [amountMVP, setAmountMVP] = useState('');
  const [amountYFT, setAmountYFT] = useState('');

  const [fastApproved, setFASTApproved] = useState(false);
  const [mvpApproved, setMVPApproved] = useState(false);
  const [yftApproved, setYFTApproved] = useState(false);

  const approveAmount = "10000000000000000000000000000000";

  const getFastInstance = async () => {
    const fastInstance = await new window.web3.eth.Contract(ERC20, FASTAddress);
    return fastInstance;
  }

  const getMVPInstance = async () => {
    const mvpInstance = await new window.web3.eth.Contract(ERC20, MVPAddress);
    return mvpInstance;
  }

  const getYFTInstance = async () => {
    const yftInstance = await new window.web3.eth.Contract(ERC20, YFTAddress);
    return yftInstance;
  }

  const getSwapInstance = async () => {
    const swapInstance = await new window.web3.eth.Contract(SwapABI, SwapAddress);
    return swapInstance;
  }

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
    }
  }

  const onConnectWallet = async () => {
    if (account) {
      return;
    }

    await loadWeb3();

    const accounts = await window.web3.eth.getAccounts();
    setAccount(accounts[0]); 
    
    const fastInstance = await getFastInstance();
    const allowFast = await fastInstance.methods.allowance(accounts[0], SwapAddress).call();
    if (allowFast > 0) {
      setFASTApproved(true);
    }

    const mvpInstance = await getMVPInstance();
    const allowMVP = await mvpInstance.methods.allowance(accounts[0], SwapAddress).call();
    if (allowMVP > 0) {
      setMVPApproved(true);
    }

    const yftInstance = await getYFTInstance();
    const allowYFT = await yftInstance.methods.allowance(accounts[0], SwapAddress).call();
    if (allowYFT > 0) {
      setYFTApproved(true);
    }
  }

  const onApproveFAST = async () => {
    const fastInstance = await getFastInstance();
    await fastInstance.methods.approve(SwapAddress, approveAmount).send({ from: account });
    setFASTApproved(true);
  }

  const onApproveMVP = async () => {
    const mvpInstance = await getMVPInstance();
    await mvpInstance.methods.approve(SwapAddress, approveAmount).send({ from: account });
    setMVPApproved(true);
  }

  const onApproveYFT = async () => {
    const yftInstance = await getYFTInstance();
    await yftInstance.methods.approve(SwapAddress, approveAmount).send({ from: account });
    setYFTApproved(true);
  }

  const onSwapFAST = async () => {
    const swapInstance = await getSwapInstance();
    const result = await swapInstance.methods.swapFAST(amountFAST).send({ from: account });
    console.log('swap result ==> ', result);
  }

  const onSwapYFT = async () => {
    const swapInstance = await getSwapInstance();
    const result = await swapInstance.methods.swapYFT(amountYFT).send({ from: account });
    console.log('swap result ==> ', result);
  }

  const onSwapMVP = async () => {
    const swapInstance = await getSwapInstance();
    const result = await swapInstance.methods.swapMVP(amountMVP).send({ from: account });
    console.log('swap result ==> ', result);
  }

  return (
    <div style={{ marginLeft: 30, marginTop: 30 }}>
      <Button variant="contained" onClick={onConnectWallet}>
        { account ? account : "Connect Wallet" }
      </Button>

      { account && (
        <div style={{ marginTop: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: 200 }}>Old Fast Amount</span>
            <TextField value={amountFAST} onChange={(e) => setAmountFAST(e.target.value)} variant="outlined" style={{ marginRight: 30, width: 300 }} />
            <Button disabled={fastApproved} variant="contained" onClick={onApproveFAST} style={{ marginRight: 30 }}>Approve</Button>
            <Button disabled={!fastApproved} variant="contained" onClick={onSwapFAST}>Swap to New Fast</Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 30 }}>
            <span style={{ width: 200 }}>MVP Amount</span>
            <TextField value={amountMVP} onChange={(e) => setAmountMVP(e.target.value)} variant="outlined" style={{ marginRight: 30, width: 300 }} />
            <Button disabled={mvpApproved} variant="contained" onClick={onApproveMVP} style={{ marginRight: 30 }}>Approve</Button>
            <Button disabled={!mvpApproved} variant="contained" onClick={onSwapMVP}>Swap to MVP</Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 30 }}>
            <span style={{ width: 200 }}>YFT Amount</span>
            <TextField value={amountYFT} onChange={(e) => setAmountYFT(e.target.value)} variant="outlined" style={{ marginRight: 30, width: 300 }} />
            <Button disabled={yftApproved} variant="contained" onClick={onApproveYFT} style={{ marginRight: 30 }}>Approve</Button>
            <Button disabled={!yftApproved} variant="contained" onClick={onSwapYFT}>Swap to YFT</Button>
          </div>
        </div>
      ) }
    </div>
  );
}

export default App;
