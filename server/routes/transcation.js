// routes/transactions.js
const express = require('express');
const router = express.Router();

const axios = require('axios');

// Import Transaction model if needed
const Transaction = require('../models/transaction');
const logger = require('../middleware/logger');


router.use(logger);

// Example route to list all transactions
router.get('/transaction', async (req, res) => {
  try {
    const transactions = await Transaction.find(); // Fetch all transactions
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});
router.get('/piechart', async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required' });
  }

  try {
    // Calculate start and end of the month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1); // Move to the next month
    endDate.setDate(0); // Last day of the current month

    const transactions = await Transaction.find({
      dateOfSale: { $gte: startDate, $lte: endDate },
    });

    const categoryCounts = transactions.reduce((counts, transaction) => {
      counts[transaction.category] = (counts[transaction.category] || 0) + 1;
      return counts;
    }, {});

    res.json(categoryCounts);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});
router.get('/barchart', async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required' });
  }

  try {
    // Calculate start and end of the month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1); // Move to the next month
    endDate.setDate(0); // Last day of the current month

    const transactions = await Transaction.find({
      dateOfSale: { $gte: startDate, $lte: endDate },
    });

    const priceRanges = {
      '0-100': 0,
      '101-200': 0,
      '201-300': 0,
      '301-400': 0,
      '401-500': 0,
      '501-600': 0,
      '601-700': 0,
      '701-800': 0,
      '801-900': 0,
      '901+': 0,
    };

    transactions.forEach((transaction) => {
      const price = transaction.price;

      if (price <= 100) priceRanges['0-100']++;
      else if (price <= 200) priceRanges['101-200']++;
      else if (price <= 300) priceRanges['201-300']++;
      else if (price <= 400) priceRanges['301-400']++;
      else if (price <= 500) priceRanges['401-500']++;
      else if (price <= 600) priceRanges['501-600']++;
      else if (price <= 700) priceRanges['601-700']++;
      else if (price <= 800) priceRanges['701-800']++;
      else if (price <= 900) priceRanges['801-900']++;
      else priceRanges['901+']++;
    });

    res.json(priceRanges);
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});
router.get('/statistics', async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required' });
  }

  try {
    // Calculate start and end of the month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1); // Move to the next month
    endDate.setDate(0); // Last day of the current month

    // Query for sold and unsold items in the specified month
    const soldItems = await Transaction.find({
      dateOfSale: { $gte: startDate, $lte: endDate },
      sold: true,
    });

    const unsoldItems = await Transaction.find({
      dateOfSale: { $gte: startDate, $lte: endDate },
      sold: false,
    });

    // Calculate total sales from sold items
    const totalSales = soldItems.reduce((sum, item) => sum + item.price, 0);

    res.json({
      totalSales,
      soldItems: soldItems.length,
      unsoldItems: unsoldItems.length,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

router.get('/transactions', async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;

  // Validate month format
  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({ error: 'Invalid or missing month parameter. Use YYYY-MM format.' });
  }

  try {
    // Calculate start and end dates of the month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    endDate.setDate(0); // Last day of the month

    // Search query with optional filtering and pagination
    const query = {
      dateOfSale: { $gte: startDate, $lte: endDate },
      $or: [
        { title: { $regex: search, $options: 'i' } },         // Search by title
        { description: { $regex: search, $options: 'i' } },   // Search by description
        { category: { $regex: search, $options: 'i' } },      // Search by category
      ],
    };

    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage))
      .sort({ dateOfSale: -1 }); // Sort transactions by date in descending order

    const total = await Transaction.countDocuments(query); // Total records for pagination

    res.json({
      data: transactions,
      total,               // Total records count
      totalPages: Math.ceil(total / perPage),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

router.get('/combined', async (req, res) => {
  const { month, page = 1, perPage = 10, search = '' } = req.query;

  // Check if month is a number and within the range 1 to 12
  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid month. It must be a number between 1 and 12.' });
  }

  try {
    // Fetch the data from the third-party API
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactionsData = response.data;

    // Filter transactions by date of sale for the selected month
    const filteredTransactions = transactionsData.filter((transaction) => {
      const transactionMonth = (new Date(transaction.dateOfSale)).getUTCMonth() + 1;
      return transactionMonth === parseInt(month);
    });

    // 1. Statistics Data
    const soldItems = filteredTransactions.filter((item) => item.sold);
    const unsoldItems = filteredTransactions.filter((item) => !item.sold);
    const totalSales = soldItems.reduce((sum, item) => sum + item.price, 0);

    const statistics = {
      totalSales,
      soldItems: soldItems.length,
      unsoldItems: unsoldItems.length,
    };

    // 2. Bar Chart Data
    const priceRanges = {
      '0-100': 0,
      '101-200': 0,
      '201-300': 0,
      '301-400': 0,
      '401-500': 0,
      '501-600': 0,
      '601-700': 0,
      '701-800': 0,
      '801-900': 0,
      '901+': 0,
    };

    filteredTransactions.forEach((item) => {
      const price = item.price;
      if (price <= 100) priceRanges['0-100']++;
      else if (price <= 200) priceRanges['101-200']++;
      else if (price <= 300) priceRanges['201-300']++;
      else if (price <= 400) priceRanges['301-400']++;
      else if (price <= 500) priceRanges['401-500']++;
      else if (price <= 600) priceRanges['501-600']++;
      else if (price <= 700) priceRanges['601-700']++;
      else if (price <= 800) priceRanges['701-800']++;
      else if (price <= 900) priceRanges['801-900']++;
      else priceRanges['901+']++;
    });

    const barChart = priceRanges;

    // 3. Pie Chart Data
    const categoryCounts = filteredTransactions.reduce((counts, item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
      return counts;
    }, {});

    const pieChart = categoryCounts;

    // 4. Transaction Table Data
    const transactionTable = filteredTransactions

    // Combine all data and send response
    res.json({
      statistics,
      barChart,
      pieChart,
      transactionTable,
    });
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});


module.exports = router;
