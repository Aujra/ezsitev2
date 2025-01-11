'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  Stack,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Product } from '@/types/products';

interface EditProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  product: Product | null;
}

export default function EditProductDialog({
  open,
  onClose,
  onSave,
  product
}: EditProductDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPricePerDay(product.pricePerDay.toString());
      setTags(product.tags);
      setIsPublished(product.status === 'published');
    }
  }, [product]);

  const handleSubmit = async () => {
    if (!product) return;

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          pricePerDay: parseFloat(pricePerDay),
          tags,
          status: isPublished ? 'published' : 'draft',
        }),
      });

      if (!response.ok) throw new Error('Failed to update product');
      onSave();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />
          <TextField
            label="Price per Day"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            type="number"
            InputProps={{
              startAdornment: <span>$</span>,
            }}
            fullWidth
          />
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Add Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                size="small"
              />
              <Button onClick={handleAddTag}>Add</Button>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => setTags(tags.filter(t => t !== tag))}
                />
              ))}
            </Stack>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
            }
            label="Published"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
