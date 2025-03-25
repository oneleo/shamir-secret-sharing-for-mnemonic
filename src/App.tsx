import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import {
  Mnemonic,
  toUtf8Bytes,
  hexlify,
  getBytes,
  toUtf8String,
  HDNodeWallet,
  Wallet,
} from "ethers";
import { split, combine } from "shamir-secret-sharing";

function App() {
  const [mnemonic, setMnemonic] = useState<string>(
    "test test test test test test test test test test test junk"
  );
  const [recoveredMnemonic, setRecoveredMnemonic] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [shares, setShares] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>(``);

  const [share1, setShare1] = useState<string>("");
  const [share2, setShare2] = useState<string>("");
  const [share3, setShare3] = useState<string>("");

  useEffect(() => {
    const generateShares = async () => {
      if (errorMessage) {
        setShares([]);
        return;
      }
      const secret = toUtf8Bytes(mnemonic);
      const shares = await split(secret, 6, 3);

      const sharesHex = shares.map((share) => hexlify(share));
      setShares(sharesHex);
    };

    generateShares();
  }, [mnemonic]);

  useEffect(() => {
    const reconstructShares = async () => {
      if (errorMessage) {
        setShares([]);
        return;
      }

      const reconstructed = await combine(
        [share1, share2, share3].map((share) => getBytes(share))
      );

      const mn = Mnemonic.fromPhrase(toUtf8String(reconstructed));

      if (!mn) {
        return;
      }
      setRecoveredMnemonic(mn.phrase);

      const wallet = HDNodeWallet.fromMnemonic(mn, `m/44'/60'/0'/0/0`);
      setPrivateKey(wallet.privateKey);
      setAddress(wallet.address);
    };

    reconstructShares();
  }, [share1, share2, share3]);

  const handleMnemonic = (input: string) => {
    setMnemonic(input);

    try {
      Mnemonic.fromPhrase(input);
      setErrorMessage(``);
    } catch (error) {
      setErrorMessage(`Invalid mnemonic.`);
    }
  };

  const randomMnemonic = () => {
    const wallet = Wallet.createRandom();
    const mnem = wallet.mnemonic?.phrase;
    if (mnem) {
      setMnemonic(mnem);
    }
  };

  const handleShare1 = (input: string) => {
    setShare1(input);

    try {
      getBytes(input);
      setErrorMessage(``);
    } catch (error) {
      setErrorMessage(`Invalid share 1.`);
    }
  };

  const handleShare2 = (input: string) => {
    setShare2(input);

    try {
      getBytes(input);
      setErrorMessage(``);
    } catch (error) {
      setErrorMessage(`Invalid share 2.`);
    }
  };

  const handleShare3 = (input: string) => {
    setShare3(input);

    try {
      getBytes(input);
      setErrorMessage(``);
    } catch (error) {
      setErrorMessage(`Invalid share 3.`);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>Generate Shares</h2>
      <div>
        <label>
          Mnemonic:{" "}
          <input
            style={{ width: "600px" }}
            type="text"
            value={mnemonic}
            onChange={(e) => handleMnemonic(e.target.value)}
            placeholder="e.g., test test test test test test test test test test test junk"
          />
        </label>
        <button onClick={randomMnemonic}>Generate mnemonic</button>
      </div>

      <div>
        Shares: <pre>{JSON.stringify(shares, null, 2)}</pre>
      </div>

      <h2>Reconstruct Shares</h2>
      <div className="card">
        <div>
          <label>
            Share 1:{" "}
            <input
              style={{ width: "950px" }}
              type="text"
              value={share1}
              onChange={(e) => handleShare1(e.target.value)}
              placeholder="e.g., 0xeae4411d55e1321bce46b49083ffda28420c4ced096eb55d806807899ea309b13e22d4036466b565d0bd367c7bda151ea1f9fea479cec19f73652aef"
            />
          </label>
        </div>
        <div>
          <label>
            Share 2:{" "}
            <input
              style={{ width: "950px" }}
              type="text"
              value={share2}
              onChange={(e) => handleShare2(e.target.value)}
              placeholder="e.g., 0xeae4411d55e1321bce46b49083ffda28420c4ced096eb55d806807899ea309b13e22d4036466b565d0bd367c7bda151ea1f9fea479cec19f73652aef"
            />
          </label>
        </div>
        <div>
          <label>
            Share 3:{" "}
            <input
              style={{ width: "950px" }}
              type="text"
              value={share3}
              onChange={(e) => handleShare3(e.target.value)}
              placeholder="e.g., 0xeae4411d55e1321bce46b49083ffda28420c4ced096eb55d806807899ea309b13e22d4036466b565d0bd367c7bda151ea1f9fea479cec19f73652aef"
            />
          </label>
        </div>
      </div>

      <div>
        <p>Recovered mnemonic: {recoveredMnemonic}</p>
        <p>Recovered private key: {privateKey}</p>
        <p>Recovered address: {address}</p>
      </div>

      <div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
