import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [priceSummary, setPriceSummary] = useState(null);

  const fetchData = async () => {
    const options = {
      method: 'GET',
      url: `http://localhost:8080/v1/collections/pricesummary/contract/${contractAddress}?chain=eth-main`,
      headers: {
        'accept': 'application/json',
        'x-api-key': '2jhzbqIWanB8puiqySBIWJVf6Ovp7oPW'
      }
    }
    axios
      .request(options)
      .then(function (response) {
        setPriceSummary(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  return (
    <div>
      <input
        type="text"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        placeholder="Enter contract address"
      />
      <button onClick={fetchData}>Submit</button>
      {priceSummary && (
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Total Transfers</th>
              <th>Valid Prices</th>
              <th>Min Price</th>
              <th>Max Price</th>
              <th>Avg Price</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(priceSummary).map((period) => (
              <tr key={period}>
                <td>{period}</td>
                <td>{priceSummary[period].transfers}</td>
                <td>{priceSummary[period].validPrices}</td>
                <td>{priceSummary[period].minPrice}</td>
                <td>{priceSummary[period].maxPrice}</td>
                <td>{priceSummary[period].avgPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;