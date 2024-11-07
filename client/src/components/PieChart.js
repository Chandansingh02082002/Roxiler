import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

const PieChart = ({ selectedMonth }) => {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchPieChartData = async () => {
      try {
        const response = await axios.get(`/api/piechart?month=${selectedMonth}`);
        const categories = response.data;

        setData({
          labels: Object.keys(categories),
          datasets: [
            {
              data: Object.values(categories),
              backgroundColor: [
                '#36BA98',
                '#E9C46A',
                '#F4A261',
                '#E76F51',
                '#2A9D8F',
              ],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      }
    };

    fetchPieChartData();
  }, [selectedMonth]);

  return <Pie data={data} />;
};

export default PieChart;
