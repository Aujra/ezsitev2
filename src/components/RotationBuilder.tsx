'use client';

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
import { RotationAction, CompositeCondition } from '@/types/rotation';

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

  const renderConditionText = (conditions: CompositeCondition): string => {
    if (!conditions || !conditions.conditions.length === 0) {
      return 'No conditions';
    }

    const conditionTexts = conditions.conditions.map(condition => {
      if ('conditions' in condition) {
        return `(${renderConditionText(condition)})`;
      }
      
      switch (condition.type) {
        case 'HP':
          return `HP ${condition.operator} ${condition.value}%`;
        case 'Aura':
          return `Aura "${condition.auraName}" ${condition.isPresent ? 'present' : 'not present'} on ${condition.target}`;
        case 'Resource':
          return `${condition.resource} ${condition.operator} ${condition.value}`;
        case 'Cooldown':
          return condition.isReady 
            ? `${condition.spellName} is ready`
            : `${condition.spellName} CD ${condition.operator} ${condition.value}s`;
        case 'Charges':
          return `${condition.spellName} charges ${condition.operator} ${condition.value}`;
        case 'Stacks':
          return `${condition.auraName} stacks ${condition.operator} ${condition.value}`;
        default:
          return 'Unknown condition';
      }
    });

    // Make operator more prominent
    return conditionTexts.join(` [${conditions.operator}] `);
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
                  <Typography component="span" sx={{ fontWeight: 'bold' }}>
                    {action.conditions.operator}
                  </Typography>
                  {' of conditions: '}
                  {renderConditionText(action.conditions)}
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
