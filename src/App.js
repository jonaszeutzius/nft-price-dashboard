import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [priceSummary, setPriceSummary] = useState(null);
  const [blockchain, setBlockchain] = useState('eth-main');
  const [error, setError] = useState(null);


  // Timestap at end of url for testing, remove at end
  const fetchData = async () => {
    const options = {
      method: 'GET',
      url: `http://localhost:8080/v1/collections/pricesummary/contract/${contractAddress}?chain=${blockchain}&timestamp_end=2023-01-04T18:30:00Z`,
      headers: { accept: 'application/json', 'X-API-KEY': '2jhzbqIWanB8puiqySBIWJVf6Ovp7oPW' }
    };

    try {
      const response = await axios.request(options);
      console.log('response', response);
      setPriceSummary(response.data.price_summary);
      setError(null);
    } catch (error) {
      setError('Error: Verify chain and contract address are valid!');
    }
  };

  const handleBlockchainChange = (event) => {
    setBlockchain(event.target.value);
  };

  const checkData = (data) => (data ? data : 'N/A');

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
        <input
            type="text"
            placeholder="Contract Address"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
        <button onClick={fetchData}>View Price Dashboard</button>
      </div>
      {console.log('priceSummary:', priceSummary)}
      {error ? (
        <p className="errorMessage">{error}</p>
      ) : (priceSummary && (
        <table>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>Period</th>
              <th>Total Transfers</th>
              <th>Available Prices</th>
              <th>Min Price USD</th>
              <th>Max Price USD</th>
              <th>Avg Price USD</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(priceSummary).map((period) => (
              <tr style={{ backgroundColor: '#f2f2f2' }} key={period}>
                {console.log('Period:', period)}
                {console.log('priceSummary.period', priceSummary.one_day)}
                <td>{period}</td>
                <td>{checkData(priceSummary[period].total_transfers)}</td>
                <td>{checkData(priceSummary[period].available_prices)}</td>
                <td>{checkData(priceSummary[period].min_price_usd)}</td>
                <td>{checkData(priceSummary[period].max_price_usd)}</td>
                <td>{checkData(priceSummary[period].avg_price_usd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        ))}
    </div>
  );
}

export default App;