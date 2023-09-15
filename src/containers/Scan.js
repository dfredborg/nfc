import React, { useEffect, useState } from 'react';

const Scan = () => {
  const [message, setMessage] = useState('');

  const onReading = async ({ message }) => {
    for (const record of message.records) {
      switch (record.recordType) {
        case "text":
          setMessage('Text 2');
          break;
        case "mime":
          const decoder = new TextDecoder();
          const data = JSON.parse(decoder.decode(record.data));
          setMessage(data);

          // Send the tagid to the PCF control inside the iframe
          const iframeElement = document.querySelector('iframe'); // Adjust the selector if needed
          if (iframeElement && iframeElement.contentWindow) {
            const dataToSend = { tagid: data };
            iframeElement.contentWindow.postMessage(dataToSend, '*'); // Adjust the target origin as needed
          }

          // ... [rest of the code remains unchanged]
          break;
        default:
          setMessage(record.recordType);
          break;
      }
    }
  };

  useEffect(() => {
    const scan = async () => {
      if ('NDEFReader' in window) {
        try {
          const ndef = new window.NDEFReader();
          await ndef.scan();

          console.log("Scan started successfully.");
          ndef.onreadingerror = () => {
            console.log("Cannot read data from the NFC tag. Try another one?");
          };

          ndef.onreading = event => {
            console.log("NDEF message read.");
            onReading(event);  // Call the onReading function here
          };
        } catch (error) {
          console.error(`Error! Scan failed to start: ${error}.`);
        }
      }
    };

    scan();
  }, []);

  return (
    <>            
      <div>
        <p>Message: {message}</p>
      </div>
    </>
  );
};

export default Scan;
