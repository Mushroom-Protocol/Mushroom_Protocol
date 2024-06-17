// ConnectPlugButton.tsx
import React, { useState, useEffect } from 'react';
import { connectToPlug, checkIsConnected, getSessionData } from './plug';

const ConnectPlugButton: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    const verifyConnection = async () => {
      const isConnected = await checkIsConnected();
      setConnected(isConnected);
      if (isConnected) {
        const sessionData = getSessionData();
        setPublicKey(sessionData?.principalId || null);
      }
    };
    verifyConnection();
  }, []);

  const handleConnect = async () => {
    try {
      const publicKey = await connectToPlug({
        whitelist: ['your-nft-canister-id'],
        host: 'https://mainnet.dfinity.network',
        timeout: 50000
      });
      setPublicKey(publicKey);
      setConnected(true);
    } catch (e) {
      console.error('Failed to connect', e);
    }
  };

  return (
    <div>
      {connected ? (
        <p>Connected with public key: {publicKey}</p>
      ) : (
        <button onClick={handleConnect}>Connect to Plug</button>
      )}
    </div>
  );
};

export default ConnectPlugButton;
