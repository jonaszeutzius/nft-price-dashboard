# NFT PRICE DASHBOARD

Blockspan API offers a wealth of data about NFTs. It's a treasure trove for developers who want to build applications around NFTs, whether it's for pricing, trading, analytics, or anything else you can imagine in the NFT space.

In this guide, we will create an application that checks a contract address for recent transaction price data. The user will select a chain, currency and, contract address, then click a button to see a table of recent price history. This application will use the Blockspan Get Collection Price Summary API. 

## REQUIREMENTS:
- Node.js and npm installed on your system.
- Basic knowledge of React.js
- Blockspan API key

## STEP 1: SETTING UP THE REACT APP

First, we need to create a new React application. Open your terminal, navigate to the directory where you want to create your project, and run the following command:

`npx create-react-app nft-price-dashboard`

This will create a new folder `nft-price-dashboard` with all the necessary files and dependencies for a React application.

## STEP 2: INSTALL AXIOS

We'll be using Axios to make HTTP requests to the Blockspan API. Navigate into your new project folder and install Axios:

`cd nft-price-dashboard` 
`npm install axios`

## STEP 3: WRITING THE COMPONENT

In `App.js`, we will import React, Axios, and App.css. Then we will set up necessary state variables such as contractAddress and blockchain. Replace everything in `App.js` with the following:

```
import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [priceSummary, setPriceSummary] = useState(null);
  const [blockchain, setBlockchain] = useState('eth-main');
  const [currency, setCurrency] = useState('USD')
  const [error, setError] = useState(null);

  // fetchData function
  
  // Additonal helper functions

  return (
    // JSX code
  );
}

export default App;
```

## STEP 4: FETCHING AND DISPLAYING THE DATA

We will add a function `fetchData` to our component that makes a get request to the Blockspan API and sets `priceSummary` in our state:

```
// fetchData function

const fetchData = async () => {
    const options = {
      method: 'GET',
      url: `http://localhost:8080/v1/collections/pricesummary/contract/${contractAddress}?chain=${blockchain}`,
      headers: { accept: 'application/json', 'X-API-KEY': 'YOUR_BLOCKSPAN_API_KEY' }
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
```

Don't forget to replace `YOUR_BLOCKSPAN_API_KEY` with your actual key!

We will then add two helper functions which help simplify our code:

```
// Additional helper functions

const handleBlockchainChange = (event) => {
    setBlockchain(event.target.value);
};

const checkData = (data) => {
    if (!data || isNaN(data)) {
        return 'N/A'
    } 
    return data
}
```

Our JSX code will display a form for the user to select a chain, select a currency and input a contract address, and a button to view the price dashboard. After the data is fetched, it will be displayed in a table:

```
  return (
    // JSX code

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
```

Finally, we will enhance the user interface in the browser by replacing all code in the App.css file with the following:

```
.App {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
}

.title {
  margin-top: 20px;
  margin-bottom: 0;
  text-align: center;
}

.errorMessage {
  text-align: center;
  color: red;
  font-weight: bold;
}

.message {
  text-align: center;
}

.image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.inputContainer {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.inputContainer input {
  padding: 10px;
  font-size: 1em;
  width: 200px;
}

.inputContainer button {
  padding: 10px;
  font-size: 1em;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
}

.inputContainer button:hover {
  background-color: #0056b3;
}

.imageContainer {
  display: flex;
  justify-content: center;
  width: 100%; 
}

.imageContainer img {
  width: 100%; 
  max-width: 500px;
  height: auto; 
}
.nftData {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.nftData .image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nftData h2 {
  margin: 10px 0;
}

.nftData p {
  font-size: 1.2em;
  font-weight: bold;
}

td {
  padding: 10px;
  text-align: left;
}

th {
  padding: 10px;
  text-align: left;
}

.tableContainer {
  display: flex;
  justify-content: center;
}
```

## STEP 5: Running THE application

Now, you can start your application by running `npm start` in your terminal. You should see the following in the browser:

- A dropdown menu to select a blockchain and currency
- Text box for contract address
- A view price dashboard button

Input the data of the chain and contract address you want to check, and click the view price dashboard button. You should then see a table with price information over a one day, seven day, and thrity day period. 

This wraps up our guide to creating an NFT Price Dashboard tool using the Blockspan API and React.js. Happy coding!

## CONCLUSION

Congratulations! You've just built a simple yet powerful NFT price dashboard tool using the Blockspan API and React.js. As you've seen, the Blockspan API is intuitive to use and provides detailed and accurate information, making it a perfect choice for this kind of application. This tutorial is just a starting point - there are many ways you can expand and improve your tool. For example, you could add more error checking, improve the UI, or add support for more blockchains.

As the world of NFTs continues to grow and evolve, tools like this will become increasingly important. Whether you're an NFT enthusiast, a developer, or a startup, understanding NFTs is a valuable skill. We hope you found this tutorial helpful.