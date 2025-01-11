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
  Typography,
} from '@mui/material';
import { Product } from '@/types/products';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPricePerDay(product.pricePerDay.toString());
      setTags(product.tags);
      setIsPublished(product.status === 'published');
      setImages(product.images);
    }
  }, [product]);

  const handleSubmit = async () => {
    if (!product) return;

    try {
      // Upload new images first
      const uploadedImageUrls = await Promise.all(
        newImages.map(async (image) => {
          const formData = new FormData();
          formData.append('file', image);
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          return data.url;
        })
      );

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
          images: [...images, ...uploadedImageUrls],
        }),
      });

      if (!response.ok) throw new Error('Failed to update product');
      setNewImages([]);
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

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewImages(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
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
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Images
            </Typography>
            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                accept="image/*"
                multiple
                id="image-upload"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload New Images
                </Button>
              </label>
            </Box>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="images" direction="horizontal">
                {(provided) => (
                  <ImageList
                    sx={{ maxHeight: 400 }}
                    cols={3}
                    rowHeight={164}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {images.map((img, index) => (
                      <Draggable key={img} draggableId={img} index={index}>
                        {(provided, snapshot) => (
                          <ImageListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              position: 'relative',
                              opacity: snapshot.isDragging ? 0.6 : 1,
                              cursor: 'grab',
                              '&:active': { cursor: 'grabbing' },
                            }}
                          >
                            <img
                              src={img}
                              alt={`Product image ${index + 1}`}
                              loading="lazy"
                              style={{ height: '100%', objectFit: 'contain' }}
                            />
                            <IconButton
                              sx={{
                                position: 'absolute',
                                right: 4,
                                top: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                },
                              }}
                              size="small"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </ImageListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {newImages.map((file, index) => (
                      <ImageListItem key={`new-${index}`} sx={{ position: 'relative' }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index + 1}`}
                          style={{ height: '100%', objectFit: 'contain' }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            right: 4,
                            top: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            },
                          }}
                          size="small"
                          onClick={() => setNewImages(prev => prev.filter((_, i) => i !== index))}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Droppable>
            </DragDropContext>
          </Box>
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
