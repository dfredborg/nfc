import React, { useState, useEffect } from 'react';
import nfc from './nfc.svg';
import './App.css';
import Scan from './containers/Scan';
import Write from './containers/Write';
import { ActionsContext } from './contexts/context';

function App() {
  const [actions, setActions] = useState(null);
  const [iframeSrc] = useState('https://apps.powerapps.com/play/5fc3b331-fa84-4c10-aa75-9cd2590ae54c?source=iframe'); // State to store iframe URL
  const { scan, write } = actions || {};

  const actionsValue = { actions, setActions };

  const onHandleAction = (actions) => {
    setActions({ ...actions });
  };

  // Function to send a sample message to the PCF control inside the iframe
  const sendMessageToPCF = () => {
    const iframeElement = document.querySelector('iframe');
    if (iframeElement && iframeElement.contentWindow) {
      const sampleData = { tagid: "SampleTagID12345" };
      iframeElement.contentWindow.postMessage(sampleData, '*'); // Adjust the target origin as needed
    }
  };

  // ... [rest of the code remains unchanged]

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
        {/* Button to trigger the REST API call */}
        {/* Button to send a sample message to the PCF control */}
        <button onClick={sendMessageToPCF} className="btn">
          Send Sample Data to PCF
        </button>
      </div>
      <ActionsContext.Provider value={actionsValue}>
        {scan && <Scan />}
        {write && <Write />}
      </ActionsContext.Provider>
     
      {/* Add the iframe here */}
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
