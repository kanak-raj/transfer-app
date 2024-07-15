import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [accountBalance, setAccountBalance] = useState(null);
  const [bankBalance, setBankBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    // Fetch account and bank balance
    fetch('/api/balance')
      .then(response => response.json())
      .then(data => {
        setAccountBalance(data.accountBalance);
        setBankBalance(data.bankBalance);
      })
      .catch(error => {
        console.error('Error fetching balances', error);
      });

    // Fetch transaction history
    fetch('/api/transactions')
      .then(response => response.json())
      .then(data =>{
        setTransactions(data)
      })
      .catch(error => {
        console.error('Error fetching transactions', error);
      });
  }, []);

  const handleWithdraw = () => {
    fetch('/api/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: withdrawAmount })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Update balances and transactions after withdrawal
      setTransactions([...transactions, data]);
      // Assume balances are returned in response for simplicity
      setAccountBalance(prev => prev - withdrawAmount);
      setBankBalance(prev => prev + withdrawAmount);
    })
    .catch(error => {
      console.error('Error fetching balances', error);
    });
  };

  return (
    <div className="App">
      <h1>Account Dashboard</h1>
      <p>Account Balance: ${accountBalance}</p>
      <p>Bank Balance: ${bankBalance}</p>
      <h2>Transaction History</h2>
      {/* <ul>
        {transactions.map((tx, index) => (
          <li key={index}>{tx.description}: ${tx.amount}</li>
        ))}
      </ul> */}
      <h2>Withdraw Funds</h2>
      <input
        type="number"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
      />
      <button onClick={handleWithdraw}>Withdraw</button>
    </div>
  );
}

export default App;
