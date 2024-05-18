import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const PREFIX = 'HistoryLog';

const classes = {
  root: `${PREFIX}-root`,
  table: `${PREFIX}-table`,
  loading: `${PREFIX}-loading`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  [`& .${classes.table}`]: {
    minWidth: 650,
  },
  [`& .${classes.loading}`]: {
    marginTop: theme.spacing(3),
  },
}));

export default function HistoryLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('/api/logs'); // Replace with your API endpoint
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <Root className={classes.root}>
      <Typography variant="h4" component="div" gutterBottom>
        History Log
      </Typography>
      {loading ? (
        <CircularProgress className={classes.loading} />
      ) : (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Event</TableCell>
                <TableCell align="right">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell component="th" scope="row">
                    {new Date(log.date).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">{log.event}</TableCell>
                  <TableCell align="right">{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Root>
  );
}
