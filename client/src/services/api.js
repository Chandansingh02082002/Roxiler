import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export const fetchTransactions = (params) =>
  axios.get(`${API_BASE_URL}/transactions`, { params });
export const fetchStatistics = (month) =>
  axios.get(`${API_BASE_URL}/statistics?month=${month}`);
export const fetchBarChart = (month) =>
  axios.get(`${API_BASE_URL}/bar-chart?month=${month}`);
export const fetchPieChart = (month) =>
  axios.get(`${API_BASE_URL}/pie-chart?month=${month}`);
export const fetchCombinedData = async (month) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/combined?month=${month}`);

    console.log(response);

    if (!response.status === 200) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.data;
  } catch (err) {
    return { error: err.message };
  }
};
