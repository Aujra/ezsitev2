import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Rating,
  Typography,
  Alert,
} from '@mui/material';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setError('Please provide a rating');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) throw new Error('Failed to submit review');
      
      setRating(null);
      setComment('');
      onReviewSubmitted();
    } catch {
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography component="legend">Rate this product</Typography>
      <Rating
        value={rating}
        onChange={(_, value) => {
          setRating(value);
          setError('');
        }}
        size="large"
      />
      <TextField
        multiline
        rows={3}
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts about this product..."
        sx={{ mt: 2 }}
      />
      {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        sx={{ mt: 2 }}
      >
        Submit Review
      </Button>
    </Box>
  );
}
