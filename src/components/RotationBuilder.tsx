'use client';

//Testing building

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ActionModal from './RotationBuilder/ActionModal';
import { RotationAction } from '@/types/rotation';
import { renderConditionText } from './RotationBuilder/ActionModal/helpers';

export default function RotationBuilder() {
  const [actions, setActions] = useState<RotationAction[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<RotationAction | undefined>();

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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h4">Rotation Builder</Typography>
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
      </Box>

      <List component={Paper} sx={{ minHeight: 200 }}>
        {actions.map((action) => (
          <ListItem
            key={action.id}
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
              primary={`${action.spellName} → ${action.target}`}
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
                      action.conditions.conditions.length === 0 
                        ? 'None'
                        : renderConditionText(action.conditions)
                    }
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      <ActionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAction(undefined);
        }}
        onSave={handleAddAction}
        initialAction={editingAction}
      />
    </Box>
  );
}
