import React, { useCallback, useContext, useEffect, useState } from 'react';
import Scanner from '../components/Scanner/Scanner';
import { ActionsContext } from '../contexts/context';

const Scan = () => {
    const [message, setMessage] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const { actions, setActions } = useContext(ActionsContext);
    const apiUrl = 'https://prod-188.westeurope.logic.azure.com:443/workflows/dfb68ad2b62b4cd8a64fb879c2892fea/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FlH2bom_cydDIIr0n8qpbcYXcBRpSH-UdkUbUgpov-Q'; // Replace with your actual API URL

    const scan = useCallback(async () => {
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
                    onReading(event);
                    setActions({
                        scan: 'scanned',
                        write: null
                    });
                };
            } catch (error) {
                console.error(`Error! Scan failed to start: ${error}.`);
            }
        }
    }, [setActions]);

    const onReading = async ({ message, serialNumber }) => {
        setSerialNumber(serialNumber);
        for (const record of message.records) {
            switch (record.recordType) {
                case "text":
                    setMessage('Text 2');
                    break;
                case "mime":
                    const decoder = new TextDecoder();
                    setMessage(JSON.parse(decoder.decode(record.data)));
                    const requestData = {
                        recordType: record.recordType,
                        data: JSON.parse(decoder.decode(record.data)),
                      };
                    // Make the POST request
                    try {
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

                        // Handle the response data here if needed
                    } catch (error) {
                        console.error('Error:', error);
                    }
                    break;
                default:
                    setMessage(record.recordType);
                    break;
            }
        }
    };

    useEffect(() => {
        scan();
    }, [scan]);

    return (
        <>
            {actions.scan === 'scanned' ? (
                <div>
                    <p>Serial Number: {serialNumber}</p>
                    <p>Message: {message}</p>
                </div>
            ) : (
                <Scanner status={actions.scan}></Scanner>
            )}
        </>
    );
};

export default Scan;
