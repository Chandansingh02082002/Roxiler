import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const Statistics = ({ statistics }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 150 }} size="small" aria-label="a dense table">

        <TableBody>
          <TableRow>
            <TableCell style={{ width: 100, height: 50 }}>Total sale</TableCell>
            <TableCell style={{ width: 100, height: 50 }}>{statistics.totalSales}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ width: 100, height: 50 }}>Total sold items</TableCell>
            <TableCell style={{ width: 100, height: 50 }}>{statistics.soldItems}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ width: 100, height: 50 }}>Total unsold items</TableCell>
            <TableCell style={{ width: 100, height: 50 }}>{statistics.unsoldItems}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Statistics
