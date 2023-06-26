import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [priceSummary, setPriceSummary] = useState(null);
  const [blockchain, setBlockchain] = useState('eth-main');
  const [currency, setCurrency] = useState('USD')
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const options = {
      method: 'GET',
      url: `https://api.blockspan.com/v1/collections/pricesummary/contract/${contractAddress}?chain=${blockchain}`,
      headers: { accept: 'application/json', 'X-API-KEY': 'YOUR_BLOCKSPAN_API_KEY' }
    };

    try {
      const response = await axios.request(options);
      setPriceSummary(response.data.price_summary);
      setError(null);
    } catch (error) {
      setError('Error: Verify chain and contract address are valid!');
    }
  };

  const handleBlockchainChange = (event) => {
    setBlockchain(event.target.value);
  };

  const checkData = (data) => {
    if (!data || isNaN(data)) {
      return 'N/A'
    } 
    return data
  }

  return (
    <div className='App'>
      <h1 className='title'>NFT Price Dashboard</h1>
      <p>Select a chain and input contract address below to see recent transaction price dashboard.</p>
      <div className='inputContainer'>
        <select name="blockchain" value={blockchain} onChange={handleBlockchainChange}>
          <option value="eth-main">eth-main</option>
          <option value="arbitrum-main">arbitrum-main</option>
          <option value="optimism-main">optimism-main</option>
          <option value="poly-main">poly-main</option>
          <option value="bsc-main">bsc-main</option>
          <option value="eth-goerli">eth-goerli</option>
        </select>
        <select name="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="native">Native Currency</option>
        </select>
        <input
            type="text"
            placeholder="Contract Address"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
        <button onClick={fetchData}>View Price Dashboard</button>
      </div>
      {error ? (
        <p className="errorMessage">{error}</p>
      ) : (priceSummary && (
        <table>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>Period</th>
              <th>Total Transfers</th>
              <th>Available Prices</th>
              { currency === 'USD' ? (
                <>
                  <th>Min Price USD</th>
                  <th>Max Price USD</th>
                  <th>Avg Price USD</th>
                </>
              ) : (
                <>
                  <th>Min Price Native</th>
                  <th>Max Price Native</th>
                  <th>Avg Price Native</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {Object.keys(priceSummary).map((period) => (
              <tr style={{ backgroundColor: '#f2f2f2' }} key={period}>
                <td>{period}</td>
                <td>{checkData(priceSummary[period].total_transfers)}</td>
                <td>{checkData(priceSummary[period].available_prices)}</td>
                { currency === 'USD' ? (
                <>
                  <td>{checkData(parseFloat(priceSummary[period].min_price_usd).toFixed(2))}</td>
                  <td>{checkData(parseFloat(priceSummary[period].max_price_usd).toFixed(2))}</td>
                  <td>{checkData(parseFloat(priceSummary[period].avg_price_usd).toFixed(2))}</td>
                </>
              ) : (
                <>
                  <td>{checkData(parseFloat(priceSummary[period].min_price_native).toFixed(7))}</td>
                  <td>{checkData(parseFloat(priceSummary[period].max_price_native).toFixed(7))}</td>
                  <td>{checkData(parseFloat(priceSummary[period].avg_price_native).toFixed(7))}</td>
                </>
              )}
              </tr>
            ))}
          </tbody>
        </table>
        ))}
    </div>
  );
}

export default App;