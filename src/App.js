import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants

const TEST_GIFS = [
  'https://media.giphy.com/media/pIBCeF0v9w3xyig9EA/giphy.gif',
  'https://media.giphy.com/media/IW3siPEECnLpe/giphy.gif',
  'https://media.giphy.com/media/kzNnkkfDTajxPZz83F/giphy.gif',
  'https://media.giphy.com/media/nQ3SpKbnrOnyczamSc/giphy.gif'
]

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          // console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          // console.log(
          //     'Connected with Public Key:',
          //     response.publicKey.toString()
          // );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const sendGif = async (e) => {
    e.preventDefault();
    // setGifList({...gifList, inputValue})
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
    } else {
      console.log('Empty input. Try again.');
    }
  };
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };
  const renderNotConnectedContainer = () => (
      <button
          className="cta-button connect-wallet-button"
          onClick={connectWallet}
      >
        Connect to Wallet
      </button>
  );
  const renderConnectedContainer = () => (
      <div className="connected-container">
        {/* Go ahead and add this input and button to start */}
        <form
            onSubmit={sendGif}
        >
          <input
              type="text"
              placeholder="Enter gif link!"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="cta-button submit-gif-button">Submit</button>
        </form>
        <div className="gif-grid">
          {gifList.map((gif) => (
              <div className="gif-item" key={gif}>
                <img src={gif} alt={gif} />
              </div>
          ))}
        </div>
      </div>
  );

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');

      // Call Solana program here.

      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  return (
      <div className="App">
        <div className="container">
          <div className="header-container">
            <p className="header">🖼 JDM GIF Portal</p>
            <p className="sub-text">
              View your GIF collection in the metaverse ✨
            </p>
            {!walletAddress && renderNotConnectedContainer()}
            {/* We just need to add the inverse here! */}
            {walletAddress && renderConnectedContainer()}
          </div>
        </div>
      </div>
  );
};

export default App;