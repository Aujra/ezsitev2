'use client';

import { Drawer, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MiniCart from '@/components/MiniCart';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, openCart, closeCart } = useCart();

  return (
    <>
      <IconButton 
        onClick={openCart}
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
        onClose={closeCart}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } }
        }}
      >
        <MiniCart />
      </Drawer>
    </>
  );
}
