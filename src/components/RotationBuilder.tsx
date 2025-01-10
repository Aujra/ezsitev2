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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ActionModal from './RotationBuilder/ActionModal';
import { RotationAction } from '@/types/rotation';
import { renderConditionText } from './RotationBuilder/ActionModal/helpers';

interface SavedRotation {
  id: string;
  name: string;
  data: {
    actions: RotationAction[];
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  const [savedRotations, setSavedRotations] = useState<SavedRotation[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    fetchRotations();
  }, []);

  const fetchRotations = async () => {
    try {
      const response = await fetch('/api/rotations');
      if (!response.ok) throw new Error('Failed to fetch rotations');
      const data = await response.json();
      setSavedRotations(data);
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to fetch rotations',
        severity: 'error'
      });
    }
  };

  const handleAddAction = (action: RotationAction) => {
    console.log('action', action);

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
    setActions(rotation.data.actions);
    setMenuAnchor(null);
    setSnackbar({
      open: true,
      message: 'Rotation loaded successfully!',
      severity: 'success'
    });
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

  const sortedActions = actions;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h4">Rotation Builder</Typography>
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
          disabled={!rotationName || actions.length === 0}
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
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        {savedRotations.map((rotation: SavedRotation) => (
          <MenuItem 
            key={rotation.id} 
            onClick={() => handleLoadRotation(rotation)}
          >
            {rotation.name}
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
