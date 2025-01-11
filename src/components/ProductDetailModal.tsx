import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Grid,
  Rating,
  Divider,
  CircularProgress,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Product } from '@/types/products';
import ReviewForm from './ReviewForm';

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  authorName?: string;
}

export default function ProductDetailModal({
  product,
  open,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState(30); // Default to 30 days
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState(false);

  useEffect(() => {
    if (product) {
      setCurrentProduct(product);
      fetchProductDetails(product.id);
    }
  }, [product]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  const fetchProductDetails = async (productId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch product details');
      const data = await response.json();
      setCurrentProduct(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = async () => {
    setShowReviewForm(false);
    if (currentProduct) {
      await fetchProductDetails(currentProduct.id);
    }
  };

  const handleAddToCart = () => {
    if (currentProduct) {
      onAddToCart({
        ...currentProduct,
        days: selectedDays // Pass selected days to parent
      });
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? (currentProduct?.images.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === (currentProduct?.images.length || 1) - 1 ? 0 : prev + 1
    );
  };
  
  if (!currentProduct) return null;

  // Ensure reviews exists with a default empty array
  const reviews = currentProduct.reviews || [];
  const averageRating = currentProduct.averageRating || 0;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {currentProduct.name}
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 400,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  position: 'relative',
                }}
              >
                {currentProduct.images.length > 1 && (
                  <>
                    <IconButton
                      onClick={handlePrevImage}
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        },
                        borderRadius: '0 4px 4px 0',
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleNextImage}
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        },
                        borderRadius: '4px 0 0 4px',
                      }}
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </>
                )}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={currentProduct.images[currentImageIndex] || '/placeholder.png'}
                    alt={`${currentProduct.name} - Image ${currentImageIndex + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      transition: 'opacity 0.3s ease-in-out',
                      cursor: 'pointer',
                    }}
                    onClick={() => setFullScreenImage(true)}
                  />
                </Box>
              </Box>
              {currentProduct.images.length > 1 && (
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  sx={{
                    mt: 1,
                  }}
                >
                  {currentProduct.images.map((_, index) => (
                    <IconButton
                      key={index}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      sx={{
                        color: index === currentImageIndex ? 'primary.main' : 'grey.500',
                        padding: 0,
                      }}
                    >
                      <FiberManualRecordIcon fontSize="small" />
                    </IconButton>
                  ))}
                </Stack>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {currentProduct.description}
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {currentProduct.tags.map((tag) => (
                  <Chip key={tag} label={tag} variant="outlined" />
                ))}
              </Stack>

              <Box sx={{ mt: 'auto' }}>
                <Typography variant="h5" color="primary" gutterBottom>
                  ${currentProduct.pricePerDay.toFixed(2)} / day
                </Typography>
                
                <TextField
                  type="number"
                  label="Number of Days"
                  value={selectedDays}
                  onChange={(e) => setSelectedDays(Math.max(1, parseInt(e.target.value) || 1))}
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 1 }}
                  helperText={`Total: $${(currentProduct.pricePerDay * selectedDays).toFixed(2)}`}
                />

                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Add to Cart
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ position: 'relative' }}>
                <Typography variant="h6" gutterBottom>
                  Reviews
                  <Rating
                    value={averageRating}
                    readOnly
                    precision={0.5}
                    sx={{ ml: 1 }}
                  />
                  {loading && (
                    <CircularProgress
                      size={20}
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                  )}
                </Typography>
                
                {reviews.length > 0 ? (
                  <Stack spacing={2}>
                    {(reviews as Review[]).map((review) => (
                      <Box key={review.id} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Rating value={review.rating || 0} readOnly size="small" />
                          <Typography variant="subtitle2">{review.authorName || 'Anonymous'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {review.comment}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary">No reviews yet</Typography>
                )}
                
                <Button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  sx={{ mt: 2 }}
                >
                  {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                </Button>
                
                {showReviewForm && (
                  <ReviewForm
                    productId={currentProduct.id}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={fullScreenImage}
        onClose={() => setFullScreenImage(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            position: 'relative',
          }
        }}
      >
        <IconButton
          onClick={() => setFullScreenImage(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <img
          src={currentProduct?.images[currentImageIndex] || '/placeholder.png'}
          alt={`${currentProduct?.name} - Full size`}
          style={{
            maxWidth: '95vw',
            maxHeight: '95vh',
            objectFit: 'contain',
          }}
          onClick={() => setFullScreenImage(false)}
        />
      </Dialog>
    </>
  );
}
