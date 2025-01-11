'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  TextField,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  CircularProgress,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ActionModal from './RotationBuilder/ActionModal';
import CreateProduct from './CreateProduct';
import { RotationAction, SavedRotation } from '@/types/rotation';
import { renderConditionText } from './RotationBuilder/ActionModal/helpers';

export default function RotationBuilder() {
  const [actions, setActions] = useState<RotationAction[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<RotationAction | undefined>();
  const [rotationName, setRotationName] = useState('');
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [savedRotations, setSavedRotations] = useState<SavedRotation[]>([]); // Initialize with empty array
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [selectedRotation, setSelectedRotation] = useState<SavedRotation | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    fetchRotations();
  }, []);

  const fetchRotations = async () => {
    try {
      const response = await fetch('/api/rotations');
      if (!response.ok) throw new Error('Failed to fetch rotations');
      const data = await response.json();
      setSavedRotations(data || []); // Ensure we always set an array
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to fetch rotations',
        severity: 'error'
      });
      setSavedRotations([]); // Set empty array on error
    }
  };

  const handleAddAction = (action: RotationAction) => {
    if (editingAction) {
      setActions(prev => prev.map(a => a.id === action.id ? action : a));
    } else {
      setActions(prev => [...prev, action]);
    }
    setModalOpen(false);
    setEditingAction(undefined);
  };

  const handleEditAction = (action: RotationAction) => {
    setEditingAction(action);
    setModalOpen(true);
  };

  const handleDeleteAction = (id: string) => {
    setActions(prev => prev.filter(a => a.id !== id));
  };
  
  const handleSave = async () => {
    if (!rotationName) {
      setSnackbar({
        open: true,
        message: 'Please enter a rotation name',
        severity: 'error'
      });
      return;
    }

    try {
      const response = await fetch('/api/rotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: rotationName,
          data: {
            actions: actions
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save rotation');
      }

      await fetchRotations(); // Refresh the rotations list
      
      setSnackbar({
        open: true,
        message: 'Rotation saved successfully!',
        severity: 'success'
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to save rotation',
        severity: 'error'
      });
    }
  };

  const handleLoadRotation = (rotation: SavedRotation) => {
    setRotationName(rotation.name);
    // Safely handle the rotation data structure
    const rotationActions = rotation.data?.actions || [];
    setActions(rotationActions);
    setMenuAnchor(null);
    setSnackbar({
      open: true,
      message: 'Rotation loaded successfully!',
      severity: 'success'
    });
  };

  const handleDeleteRotation = async (rotation: SavedRotation) => {
    if (!confirm(`Are you sure you want to delete "${rotation.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/rotations?id=${rotation.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete rotation');
      }

      await fetchRotations(); // Refresh the list
      setSnackbar({
        open: true,
        message: 'Rotation deleted successfully!',
        severity: 'success'
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to delete rotation',
        severity: 'error'
      });
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(actions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Recalculate weights with 50-point separation
    const updatedItems = items.map((item, index) => ({
      ...item,
      weight: (items.length - index) * 50
    }));

    setActions(updatedItems);
  };

  const handleCreateProduct = () => {
    // Only allow creating product from saved rotation
    const currentRotation = savedRotations.find(r => r.name === rotationName);
    if (!currentRotation) {
      setSnackbar({
        open: true,
        message: 'Please save your rotation first',
        severity: 'error'
      });
      return;
    }
    setSelectedRotation(currentRotation);
    setCreateProductOpen(true);
  };

  const handleAiPrompt = async () => {
    if (!aiPrompt) {
      setSnackbar({
        open: true,
        message: 'Please enter a prompt',
        severity: 'error'
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      if (!response.ok) throw new Error('Failed to get AI response');
      
      const data = await response.json();
      // Try to parse and set actions directly
      try {
        const responseToJsonToGetActions = JSON.parse(data.response);
        setActions(responseToJsonToGetActions.actions);
        
        setSnackbar({
          open: true,
          message: 'Rotation generated successfully!',
          severity: 'success'
        });
      } catch{
        throw new Error('Invalid rotation format received');
      }
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to generate rotation',
        severity: 'error'
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const sortedActions = actions || []; // Provide default empty array
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h4">Rotation Builder</Typography>
        {selectedRotation && (
          <Typography 
            variant="subtitle1" 
            color="primary.main"
            sx={{ 
              ml: 2,
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center' 
            }}
          >
            Editing: {selectedRotation.name}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 2, mb: 3 }}>
        <TextField
          size="small"
          placeholder="Rotation Name"
          value={rotationName}
          onChange={(e) => setRotationName(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingAction(undefined);
            setModalOpen(true);
          }}
        >
          Add Action
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!rotationName || (actions && actions.length === 0)}
        >
          Save Rotation
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<FolderOpenIcon />}
          onClick={(e) => setMenuAnchor(e.currentTarget)}
        >
          Load Rotation
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<ShoppingCartIcon />}
          onClick={handleCreateProduct}
          disabled={!actions || actions.length === 0}
        >
          Create Product
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AutoFixHighIcon color="primary" />
          <Typography variant="h6">AI Assistant</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={20}
          placeholder="Ask AI to help you build your rotation (e.g., 'Create a basic combat rotation for a frost mage')"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiInputBase-root': {
              resize: 'vertical',
              overflow: 'auto',
            },
            '& textarea': {
              resize: 'vertical',
              lineHeight: 1.5,
            }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="contained"
            onClick={handleAiPrompt}
            disabled={isAiLoading}
            startIcon={isAiLoading ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
          >
            Generate Rotation
          </Button>
        </Box>
      </Paper>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        {savedRotations.map((rotation: SavedRotation) => (
          <MenuItem 
            key={rotation.id}
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2 
            }}
          >
            <Typography onClick={() => handleLoadRotation(rotation)}>
              {rotation.name}
            </Typography>
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRotation(rotation);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </MenuItem>
        ))}
        {savedRotations.length === 0 && (
          <MenuItem disabled>No saved rotations</MenuItem>
        )}
      </Menu>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="actions">
          {(provided) => (
            <List 
              component={Paper} 
              sx={{ minHeight: 200 }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sortedActions.map((action, index) => (
                <Draggable 
                  key={action.id} 
                  draggableId={action.id} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        ...provided.draggableProps.style,
                        background: snapshot.isDragging ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
                      }}
                      secondaryAction={
                        <Box>
                          <IconButton edge="end" onClick={() => handleEditAction(action)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleDeleteAction(action.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={`${action.spellName} → ${action.target} (Weight: ${action.weight})`}
                        secondary={
                          <>
                            Priority: {action.priority} | Weight: {action.weight}
                            {action.interruptible && ' | Interruptible'}
                            <br />
                            <Typography 
                              component="div" 
                              sx={{ 
                                mt: 1,
                                '& .operator': {
                                  color: 'primary.main',
                                  fontWeight: 'bold',
                                  mx: 0.5
                                }
                              }}
                            >
                              Conditions: {
                                action.conditions.groups.length === 0 
                                  ? 'None'
                                  : renderConditionText(action.conditions)
                              }
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

      <ActionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAction(undefined);
        }}
        onSave={handleAddAction}
        initialAction={editingAction}
      />

      {selectedRotation && (
        <CreateProduct
          open={createProductOpen}
          onClose={() => {
            setCreateProductOpen(false);
            setSelectedRotation(null);
          }}
          rotation={selectedRotation}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
