'use client';

import { Box, Typography, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const MiniCart = () => {
  const { items, removeItem, total, closeCart } = useCart();

  const handleCheckout = async () => {
    const loadingToast = toast.loading('Processing checkout...');
    try {
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.name,
            days: item.days,
            price: item.price,
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process checkout', { id: loadingToast });
    }
  };

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Shopping Cart</Typography>
        <IconButton onClick={closeCart} aria-label="Close cart">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {items.length === 0 ? (
          <Typography color="text.secondary">Your cart is empty</Typography>
        ) : (
          items.map((item) => (
            <Box 
              key={item.id} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1
              }}
            >
              <Box>
                <Typography variant="subtitle1">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.days} days - ${item.price}
                </Typography>
              </Box>
              <IconButton 
                size="small" 
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.name} from cart`}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        )}
      </Box>

      <Box sx={{ mt: 3, borderTop: 1, borderColor: 'divider', pt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Total: ${total}
        </Typography>
        <Button 
          fullWidth 
          variant="contained" 
          disabled={items.length === 0}
          onClick={handleCheckout}
          sx={{ mb: 1 }}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default MiniCart;
