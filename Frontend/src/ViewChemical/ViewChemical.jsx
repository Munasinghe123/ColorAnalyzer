import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewChemical.css';

function ViewChemical() {
    const [amount, setAmount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        // Fetch chemical amount from the backend
        const fetchChemical = async () => {
            try {
                const response = await axios.get('http://localhost:7001/api/images/getAmount');

                if (response.data && response.data.chemicalAmount !== undefined) {
                    setAmount(response.data.chemicalAmount);
                    setImageUrl(response.data.imageUrl);
                } else {
                    console.error("Unexpected response format:", response.data);
                    setAmount("Data unavailable");
                }
            } catch (err) {
                console.error('Error fetching chemical amount:', err);
                setAmount('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchChemical();
    }, []);

    return (
        <div className="container">
            <h1>View Chemical Percentage</h1>

            {loading ? (
                <p className="loading">Loading...</p>
            ) : amount === 'Error fetching data' || amount === 'Data unavailable' ? (
                <p className="error">{amount}</p>
            ) : (
                <>
                    <p className="result">The recommended chemical percentage: {amount}%</p>
                    {imageUrl && <img src={`http://localhost:7001${imageUrl}`} alt="Analyzed" className="uploaded-image" />}
                </>
            )}
        </div>
    );
}

export default ViewChemical;
