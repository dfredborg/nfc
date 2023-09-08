import React, { useState, useEffect } from 'react';
import nfc from './nfc.svg';
import './App.css';
import Scan from './containers/Scan';
import Write from './containers/Write';
import { ActionsContext } from './contexts/context';

function App() {
  const [actions, setActions] = useState(null);
  const [apiResponse, setApiResponse] = useState(null); // State to store API response
  const { scan, write } = actions || {};

  const actionsValue = { actions, setActions };

  const onHandleAction = (actions) => {
    setActions({ ...actions });
  };

  // Function to call the REST API with a POST request
  const callRestApi = async () => {
    try {
      const apiUrl = 'https://prod-188.westeurope.logic.azure.com:443/workflows/dfb68ad2b62b4cd8a64fb879c2892fea/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FlH2bom_cydDIIr0n8qpbcYXcBRpSH-UdkUbUgpov-Q'; // Replace with your API URL
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

      const data = await response.json();
      setApiResponse(data); // Store the API response in state
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
      <iframe
        src='https://apps.powerapps.com/play/e/default-e15ec559-2613-43b3-90ec-9c684104b30d/a/5fc3b331-fa84-4c10-aa75-9cd2590ae54c?tenantId=e15ec559-2613-43b3-90ec-9c684104b30d&hint=f92488d5-cde3-49a9-89c4-5f044211ab7c&sourcetime=1694160116740&source=portal'
        height={500}
        width={500}
      />

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
        {scan && <Scan />}
        {write && <Write />}
      </ActionsContext.Provider>
      {/* Display API response */}
      {apiResponse && (
        <div className="Api-response">
          <h2>API Response</h2>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
