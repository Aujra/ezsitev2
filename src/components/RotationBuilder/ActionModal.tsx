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
  CompositeCondition 
} from '@/types/rotation';
import { ActionSettings } from './ActionModal/components/ActionSettings';
import { ConditionFields } from './ActionModal/components/ConditionFields';
import { createDefaultCondition, createDefaultAction } from './ActionModal/helpers';
import { LOGICAL_OPERATORS, CONDITION_TYPES } from './ActionModal/constants';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Update type guard to be more specific
function isBaseCondition(condition: Condition | CompositeCondition): condition is BaseConditions {
  return 'type' in condition && condition.type !== 'Composite';
}

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

  const handleConditionTypeChange = (index: number, type: ConditionType) => {
    setAction(prev => {
      const newConditions = [...prev.conditions.conditions];
      newConditions[index] = createDefaultCondition(type);
      return {
        ...prev,
        conditions: {
          ...prev.conditions,
          conditions: newConditions
        }
      };
    });
  };

  const handleAddCondition = () => {
    setAction(prev => {
      const newConditions = [...prev.conditions.conditions, createDefaultCondition('HP')];
      return {
        ...prev,
        conditions: {
          ...prev.conditions,
          conditions: newConditions
        }
      };
    });
  };

  const handleRemoveCondition = (index: number) => {
    setAction(prev => {
      const newConditions = prev.conditions.conditions.filter((_, i) => i !== index);
      return {
        ...prev,
        conditions: {
          ...prev.conditions,
          conditions: newConditions
        }
      };
    });
  };

  const handleConditionUpdate = (index: number, updates: Partial<Omit<Condition, 'type'>>) => {
    setAction(prev => {
      const newConditions = prev.conditions.conditions.map((c, i) => {
        if (i !== index) return c;
        return { ...c, ...updates } as Condition;
      });
      return {
        ...prev,
        conditions: {
          ...prev.conditions,
          conditions: newConditions
        }
      };
    });
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
            <Typography variant="subtitle1" gutterBottom>Conditions</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <FormControl sx={{ width: '200px' }}>
                <InputLabel>Logical Operator</InputLabel>
                <Select
                  value={action.conditions.operator}
                  label="Logical Operator"
                  onChange={e => setAction(prev => ({
                    ...prev,
                    conditions: { ...prev.conditions, operator: e.target.value as LogicalOperator }
                  }))}>
                  {LOGICAL_OPERATORS.map(op => (
                    <MenuItem key={op} value={op}>{op}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button 
                onClick={handleAddCondition} 
                startIcon={<AddIcon />} 
                variant="outlined">
                Add Condition
              </Button>
            </Box>

            <Stack spacing={2}>
              {action.conditions.conditions.map((condition, index) => (
                <Box key={index}>
                  {index > 0 && (
                    <Box sx={{ py: 1, px: 2, textAlign: 'center' }}>
                      <Typography color="primary" fontWeight="bold">
                        {action.conditions.operator}
                      </Typography>
                    </Box>
                  )}
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                      <FormControl sx={{ width: '200px' }}>
                        <InputLabel>Condition Type</InputLabel>
                        <Select
                          value={isBaseCondition(condition) ? condition.type : ''}
                          label="Condition Type"
                          onChange={e => handleConditionTypeChange(index, e.target.value as ConditionType)}>
                          {CONDITION_TYPES.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Box sx={{ flex: 1 }}>
                        {isBaseCondition(condition) && (
                          <ConditionFields 
                            condition={condition} 
                            onUpdate={(updates) => handleConditionUpdate(index, updates)}
                          />
                        )}
                      </Box>
                      <IconButton 
                        onClick={() => handleRemoveCondition(index)} 
                        color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                </Box>
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
