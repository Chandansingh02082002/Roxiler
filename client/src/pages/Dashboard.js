// src/pages/Dashboard.js
import React, { useState } from 'react';
import TransactionTable from '../components/TransactionTable';
import Statistics from '../components/Statistics';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';

function Dashboard() {
  const [month, setMonth] = useState('March');

  return (
    <div>
      <select onChange={(e) => setMonth(e.target.value)} value={month}>
        {/* Month options here */}
      </select>
      <TransactionTable month={month} />
      <Statistics month={month} />
      <BarChart month={month} />
      <PieChart month={month} />
    </div>
  );
}

export default Dashboard;
