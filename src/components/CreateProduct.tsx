'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { SavedRotation } from '@/types/rotation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface CreateProductProps {
  open: boolean;
  onClose: () => void;
  rotation: SavedRotation;
}

export default function CreateProduct({ open, onClose, rotation }: CreateProductProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewImages(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(uploadedImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setUploadedImages(items);
  };

  const handleSubmit = async () => {
    try {
      // Upload new images first
      const newImageUrls = await Promise.all(
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

      // Combine existing uploaded images with new ones
      const allImages = [...uploadedImages, ...newImageUrls];

      // Create product with all images
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          pricePerDay: parseFloat(pricePerDay),
          tags,
          images: allImages,
          rotationId: rotation.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create product');

      onClose();
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Product from Rotation</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Product Name"
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
              <Button 
                onClick={handleAddTag}
                variant="contained"
                size="small"
              >
                <AddIcon />
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                />
              ))}
            </Box>
          </Box>
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
                  Upload Images
                </Button>
              </label>
            </Box>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="images" direction="horizontal">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}
                  >
                    {uploadedImages.map((img, index) => (
                      <Draggable key={img} draggableId={img} index={index}>
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              width: 164,
                              height: 164,
                              position: 'relative',
                              opacity: snapshot.isDragging ? 0.6 : 1,
                              cursor: 'grab',
                              '&:active': { cursor: 'grabbing' },
                            }}
                          >
                            <img
                              src={img}
                              alt={`Product image ${index + 1}`}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'contain',
                              }}
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
                              onClick={() => handleRemoveUploadedImage(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {newImages.map((file, index) => (
                      <Box
                        key={`new-${index}`}
                        sx={{
                          width: 164,
                          height: 164,
                          position: 'relative',
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index + 1}`}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'contain',
                          }}
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
                          onClick={() => handleRemoveNewImage(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!name || !description || !pricePerDay}
        >
          Create Product
        </Button>
      </DialogActions>
    </Dialog>
  );
}
