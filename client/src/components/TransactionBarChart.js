import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export function valueFormatter(value) {
  return `${value} items`;
}

const chartSetting = {
  xAxis: [
    {
      scaleType: "band",
      dataKey: "range",
      tickPlacement: "middle",
      tickLabelPlacement: "middle",
    },
  ],
  series: [{ dataKey: "items", label: "Number of items", valueFormatter }],
  height: 290,
};

const TransactionBarChart = ({ dataset }) => {
  const formattedDataset = Object.entries(dataset).map(([range, items]) => ({
    range,
    items
}))
  console.log(formattedDataset);
  return (
    <div style={{ width: "100%" }}>
      <BarChart dataset={formattedDataset} {...chartSetting} />
    </div>
  );
};

export default TransactionBarChart;
