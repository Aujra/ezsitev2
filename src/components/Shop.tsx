'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/products';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  CardActions,
  CircularProgress,
  Stack,
  Snackbar,
  Alert,
  Rating,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductDetailModal from './ProductDetailModal';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const { refreshCart, openCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.filter((p: Product) => p.status === 'published'));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: product.type,
          name: product.name,
          price: product.price,
          quantity: 1,
          days: product.type === 'game-time' ? 30 : undefined, // Default to 30 days for game-time
        }),
      });

      if (!response.ok) throw new Error('Failed to add to cart');

      await refreshCart(); // Refresh cart items
      openCart(); // Open the cart drawer

      setSnackbar({
        open: true,
        message: 'Added to cart successfully!',
        severity: 'success'
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to add to cart',
        severity: 'error'
      });
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Shop</Typography>
      {products.length === 0 ? (
        <Typography color="textSecondary">
          No products available at the moment.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => handleProductClick(product)}
              >
                <Box sx={{ 
                  position: 'relative',
                  height: 200,
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CardMedia
                    component="img"
                    image={product.images[0] || '/placeholder.png'}
                    alt={product.name}
                    sx={{
                      height: '100%',
                      width: '100%',
                      objectFit: 'contain',
                      p: 2,
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Rating value={product.averageRating} readOnly precision={0.5} size="small" />
                    <Typography variant="caption" color="text.secondary">
                      ({product.reviews.length})
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '3em',
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      sx={{ 
                        flexWrap: 'wrap', 
                        gap: 1,
                        '& > *': { mb: 1 }
                      }}
                    >
                      {product.tags.map((tag) => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
                <CardActions sx={{ 
                  justifyContent: 'space-between', 
                  p: 2,
                  borderTop: 1,
                  borderColor: 'divider'
                }}>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(product)}
                    size="small"
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      <ProductDetailModal
        product={selectedProduct}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
