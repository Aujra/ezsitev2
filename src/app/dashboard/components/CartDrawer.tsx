'use client';

import { Drawer, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useState } from 'react';
import MiniCart from './MiniCart';
import { useCart } from '../../context/CartContext';

const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();

  return (
    <>
      <IconButton 
        onClick={() => setIsOpen(true)}
        aria-label="Shopping cart"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <Badge badgeContent={items.length} color="primary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } }
        }}
      >
        <MiniCart />
      </Drawer>
    </>
  );
};

export default CartDrawer;
