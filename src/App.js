// App.js

import React, { useState, useEffect } from 'react';
import nfc from './nfc.svg';
import './App.css';
import Scan from './containers/Scan';
import Write from './containers/Write';
import { ActionsContext } from './contexts/context';

function App() {
  const [actions, setActions] = useState(null);
  const [iframeSrc, setIframeSrc] = useState(''); // State to store iframe URL
  const { scan, write } = actions || {};

  const actionsValue = { actions, setActions };

  const onHandleAction = (actions) => {
    setActions({ ...actions });
  };

  // Function to set the iframe URL
  const setIframeUrl = (newUrl) => {
    setIframeSrc(newUrl);
  };

  // Function to call the REST API with a POST request
  const callRestApi = async () => {
    try {
      const apiUrl = '...'; // Replace with your API URL
      const requestData = {
        id: 'TESTID'
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the unused apiResponse variable
      // const data = await response.json();
      // setApiResponse(data); // Store the API response in state
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // useEffect to call the API when the component mounts (you can trigger this differently as needed)
  useEffect(() => {
    callRestApi();
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
        {/* Button to trigger the REST API call */}
        <button onClick={callRestApi} className="btn">
          Call API (POST)
        </button>
      </div>
      <ActionsContext.Provider value={actionsValue}>
        {scan && <Scan setIframeUrl={setIframeUrl} />}
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
