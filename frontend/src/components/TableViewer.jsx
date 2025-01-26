import React from 'react';
import { useFetchTableData } from '../hooks/useFetchTableData';
import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

const TableViewer = ({ tableName }) => {
  const { data, isLoading, error } = useFetchTableData(tableName);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load data: {error.message}</Typography>;

  const { data: rows, columns } = data;

  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableCell key={col.name}>{col.name}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={index}>
            {columns.map((col) => (
              <TableCell key={col.name}>{row[col.name]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableViewer;
