import React, { useState, useEffect } from 'react';
import nfc from './nfc.svg';
import './App.css';
import Scan from './containers/Scan';
import Write from './containers/Write';
import { ActionsContext } from './contexts/context';

function App() {
  const [actions, setActions] = useState(null);
  const [iframeSrc] = useState('https://apps.powerapps.com/play/5fc3b331-fa84-4c10-aa75-9cd2590ae54c?source=iframe');
  const { scan, write } = actions || {};

  const actionsValue = { actions, setActions };

  const onHandleAction = (actions) => {
    setActions({ ...actions });
  };

  const sendMessageToPCF = () => {
    const iframeElement = document.querySelector('iframe');
    if (iframeElement && iframeElement.contentWindow) {
      const sampleData = { tagid: "SampleTagID12345" };
      console.log("Sending message to PCF:", JSON.stringify(sampleData));
      iframeElement.contentWindow.postMessage(sampleData, '*');
      console.log("Data Sent:", JSON.stringify(sampleData));      
    } else {
      console.error("Unable to access the iframe's contentWindow.");
    }
  };

  useEffect(() => {
    const handleReceivedMessage = (event) => {
      console.log("Received message:", event.data);
      // Handle the received data as needed
    };

    window.addEventListener('message', handleReceivedMessage);

    return () => {
      window.removeEventListener('message', handleReceivedMessage);
    };
  }, []);

  return (
    <div className="App">      
      <img src={nfc} className="App-logo" alt="logo" />
      <h1>NFC Tool</h1>
      <div className="App-container">
        <button onClick={() => onHandleAction({ scan: 'scanning', write: null })} className="btn">
          Scan
        </button>
        <button onClick={() => onHandleAction({ scan: null, write: 'writing' })} className="btn">
          Write
        </button>
        <button onClick={sendMessageToPCF} className="btn">
          Send Sample Data to PCF
        </button>
      </div>
      <ActionsContext.Provider value={actionsValue}>
        {scan && <Scan />}
        {write && <Write />}
      </ActionsContext.Provider>
     
      <iframe
        title="PowerApps"
        width="100%"
        height="640px"
        frameBorder="0"
        src={iframeSrc}
        allowFullScreen
        allow="geolocation; microphone; camera"              
      ></iframe>
    </div>
  );
}

export default App;
