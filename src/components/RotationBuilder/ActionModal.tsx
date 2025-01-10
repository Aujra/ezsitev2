'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { 
  RotationAction, 
  Condition, 
  LogicalOperator, 
  ConditionType, 
  BaseConditions,
} from '@/types/rotation';
import { ActionSettings } from './ActionModal/components/ActionSettings';
import { ConditionFields } from './ActionModal/components/ConditionFields';
import { createDefaultCondition, createDefaultAction } from './ActionModal/helpers';
import { LOGICAL_OPERATORS, CONDITION_TYPES } from './ActionModal/constants';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface ActionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (action: RotationAction) => void;
  initialAction?: RotationAction;
}

export default function ActionModal({ open, onClose, onSave, initialAction }: ActionModalProps) {
  const [action, setAction] = useState<RotationAction>(() => initialAction || createDefaultAction());

  useEffect(() => {
    setAction(initialAction || createDefaultAction());
  }, [initialAction, open]);

  useEffect(() => {
    console.groupEnd();
  }, [action.conditions]);

  const handleAddGroup = (operator: LogicalOperator) => {
    setAction(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        type: 'Composite',
        groups: [
          ...prev.conditions.groups,
          {
            operator,
            conditions: [] as BaseConditions[] // Explicitly type the conditions array
          }
        ]
      }
    }));
  };

  const handleAddCondition = (groupIndex: number) => {
    setAction(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        type: 'Composite',
        groups: prev.conditions.groups.map((group, idx) => 
          idx === groupIndex
            ? {
                ...group,
                conditions: [...group.conditions, createDefaultCondition('HP') as BaseConditions]
              }
            : group
        )
      }
    }));
  };

  const handleRemoveCondition = (groupIndex: number, conditionIndex: number) => {
    setAction(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        type: 'Composite',
        groups: prev.conditions.groups.map((group, gIdx) => 
          gIdx === groupIndex
            ? {
                ...group,
                conditions: group.conditions.filter((_, cIdx) => cIdx !== conditionIndex)
              }
            : group
        )
      }
    }));
  };

  const handleConditionUpdate = (groupIndex: number, conditionIndex: number, updates: Partial<Omit<Condition, 'type'>>) => {
    setAction(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        groups: prev.conditions.groups.map((group, gIdx) => 
          gIdx === groupIndex 
            ? {
                ...group,
                conditions: group.conditions.map((condition, cIdx) => 
                  cIdx === conditionIndex 
                    ? { ...condition, ...updates }
                    : condition
                )
              }
            : group
        )
      }
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{initialAction ? 'Edit Action' : 'New Action'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <ActionSettings 
            action={action} 
            onChange={(updates) => setAction(prev => ({ ...prev, ...updates }))} 
          />

          {/* Conditions Section */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>Condition Groups</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {LOGICAL_OPERATORS.map(op => (
                <Button
                  key={op}
                  onClick={() => handleAddGroup(op)}
                  variant="outlined"
                >
                  Add {op} Group
                </Button>
              ))}
            </Box>

            <Stack spacing={3}>
              {action.conditions.groups.map((group, groupIndex) => (
                <Paper key={groupIndex} sx={{ p: 2 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {group.operator} Group
                  </Typography>
                  <Button
                    onClick={() => handleAddCondition(groupIndex)}
                    startIcon={<AddIcon />}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  >
                    Add Condition
                  </Button>
                  <Stack spacing={2}>
                    {group.conditions.map((condition, conditionIndex) => (
                      <Box key={conditionIndex}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                          <FormControl sx={{ width: '200px' }}>
                            <InputLabel>Condition Type</InputLabel>
                            <Select
                              value={condition.type}
                              label="Condition Type"
                              onChange={e => {
                                const newCondition = createDefaultCondition(e.target.value as ConditionType);
                                handleConditionUpdate(groupIndex, conditionIndex, newCondition as BaseConditions);
                              }}
                            >
                              {CONDITION_TYPES.map(type => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Box sx={{ flex: 1 }}>
                            <ConditionFields 
                              condition={condition}
                              onUpdate={updates => handleConditionUpdate(groupIndex, conditionIndex, updates)}
                            />
                          </Box>
                          <IconButton 
                            onClick={() => handleRemoveCondition(groupIndex, conditionIndex)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(action)} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
