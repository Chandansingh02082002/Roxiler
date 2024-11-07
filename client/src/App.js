import React, { useState } from "react";
import { useEffect } from "react";
import {
  Box,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
} from "@mui/material";
import TransactionTable from "./components/TransactionTable";
import TransactionBarChart from "./components/TransactionBarChart";
import { fetchCombinedData } from "./services/api";
import Statistics from "./components/Statistics";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const boxStyles = {
  backgroundColor: "white",
  borderRadius: "5px",
  border: "1px solid #d3d3d3",
  padding: "10px",
};

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(3); // Default month
  const [search, setSearch] = useState("");
  const [transactionTable, setTransactionTable] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [barChart, setBarChart] = useState([]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    fetchCombinedData(selectedMonth).then((data) => {
      console.log(data);
      if (!data.error) {
        setTransactionTable(data.transactionTable);
        setStatistics(data.statistics);
        setBarChart(data.barChart);
      }
    });
  }, [selectedMonth]);

  return (
    <Box flex flexDirection={"row"} padding={3} justifyContent={"stretch"}>
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 3 }}
        marginBottom={3}
      >
        <Box sx={{ gridColumn: "span 4" }} style={boxStyles}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Search Transaction"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
          />
        </Box>
        <Box sx={{ gridColumn: "span 5" }} />
        <Box sx={{ gridColumn: "span 3" }} style={boxStyles}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Month</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedMonth}
              label="Month"
              defaultValue="march"
              onChange={handleMonthChange}
            >
              {months.map((month, i) => (
                <MenuItem value={i + 1}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box marginBottom={3}>
        <TransactionTable rows={transactionTable} />
      </Box>
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 3 }}
      >
        <Box sx={{ gridColumn: "span 4" }} style={boxStyles}>
          <h2>Statistics - {months[selectedMonth]}</h2>
          <Statistics statistics={statistics} />
        </Box>
        <Box sx={{ gridColumn: "span 8" }} style={boxStyles}>
          <TransactionBarChart dataset={barChart} />
        </Box>
      </Box>
    </Box>
  );
};

export default App;
