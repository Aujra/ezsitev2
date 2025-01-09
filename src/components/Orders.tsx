'use client';

import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  amount: number;
  status: string;
  days: number;
  seconds: number;
  stripeId: string;
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string): "primary" | "warning" | "error" | "default" => {
    switch (status) {
      case 'completed': return 'primary';  // Uses our theme's primary color
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const formatTimeRemaining = (seconds: number): string => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  const renderMobileCards = () => (
    <Stack spacing={2}>
      {orders.map((order) => (
        <Paper 
          key={order.id} 
          sx={{ 
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Order ID
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {order.id}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Date
            </Typography>
            <Typography variant="body2">
              {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={order.status.toUpperCase()}
              color={getStatusColor(order.status)}
              size="small"
              sx={{
                fontWeight: 500,
                borderRadius: '6px',
                '& .MuiChip-label': { px: 1 }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Time Remaining
            </Typography>
            <Typography variant="body2">
              {formatTimeRemaining(order.seconds)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              ${order.amount.toFixed(2)}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Stack>
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 1, sm: 0 } }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4,
          fontSize: { xs: '1.5rem', sm: '2.125rem' }
        }}
      >
        Orders History
      </Typography>
      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        isMobile ? renderMobileCards() : (
          <TableContainer 
            component={Paper} 
            sx={{ 
              maxWidth: '100vw',
              '.MuiTableCell-root': {
                px: { xs: 1, sm: 2 },
                py: { xs: 1, sm: 1.5 },
                '&:last-child': {
                  pr: { xs: 1, sm: 2 }
                }
              }
            }}
          >
            <Table size="small" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell 
                      component="th" 
                      scope="row"
                      sx={{ 
                        maxWidth: { xs: '80px', sm: 'none' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {order.id}
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status.toUpperCase()}
                        color={getStatusColor(order.status)}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          borderRadius: '6px',
                          '& .MuiChip-label': {
                            px: 1,
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatTimeRemaining(order.seconds)}</TableCell>
                    <TableCell align="right">${order.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Box>
  );
}
