'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Switch,
  FormControlLabel,
  Box,
  IconButton,
  Typography,
  Paper
} from '@mui/material';
import { RotationAction, Target, ConditionType, Condition, Resource, CompositeCondition, LogicalOperator, Operator } from '@/types/rotation';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const TARGETS: Target[] = ['Self', 'Target', 'Focus', 'Tank', 'Party1', 'Party2', 'Party3', 'Party4'];
const RESOURCES: Resource[] = ['Mana', 'Rage', 'Energy', 'Focus', 'RunicPower'];
const OPERATORS: Operator[] = ['>', '<', '=', '>=', '<='];
const LOGICAL_OPERATORS: LogicalOperator[] = ['AND', 'OR', 'NOT'];
const CONDITION_TYPES: ConditionType[] = ['HP', 'Aura', 'Resource', 'Cooldown', 'Charges', 'Stacks'];

interface ActionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (action: RotationAction) => void;
  initialAction?: RotationAction;
}

export default function ActionModal({ open, onClose, onSave, initialAction }: ActionModalProps) {
  const [action, setAction] = useState<RotationAction>(initialAction || {
    id: crypto.randomUUID(),
    spellName: '',
    target: 'Target',
    weight: 1,
    conditions: { operator: 'AND', conditions: [] },
    priority: 0,
    interruptible: false
  });

  useEffect(() => {
    if (initialAction) {
      setAction(initialAction);
    } else {
      setAction({
        id: crypto.randomUUID(),
        spellName: '',
        target: 'Target',
        weight: 1,
        conditions: { operator: 'AND', conditions: [] },
        priority: 0,
        interruptible: false
      });
    }
  }, [initialAction, open]);

  const handleConditionTypeChange = (type: ConditionType, index: number) => {
    const newConditions = [...action.conditions.conditions];
    switch (type) {
      case 'HP':
        newConditions[index] = { type: 'HP', operator: '>', value: 0 };
        break;
      case 'Aura':
        newConditions[index] = { type: 'Aura', target: 'Self', auraName: '', isPresent: true };
        break;
      case 'Resource':
        newConditions[index] = { type: 'Resource', resource: 'Mana', operator: '>', value: 0 };
        break;
      case 'Cooldown':
        newConditions[index] = { type: 'Cooldown', spellName: '', operator: '=', value: 0, isReady: true };
        break;
      case 'Charges':
        newConditions[index] = { type: 'Charges', spellName: '', operator: '>', value: 0 };
        break;
      case 'Stacks':
        newConditions[index] = { type: 'Stacks', auraName: '', operator: '>', value: 0 };
        break;
    }
    setAction(prev => ({
      ...prev,
      conditions: { ...prev.conditions, conditions: newConditions }
    }));
  };

  const renderConditionFields = (condition: Condition, index: number) => {
    switch (condition.type) {
      case 'HP':
        return (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl sx={{ width: '150px' }}>
              <InputLabel>Operator</InputLabel>
              <Select
                value={condition.operator}
                label="Operator"
                onChange={e => updateCondition(index, { operator: e.target.value })}
              >
                {OPERATORS.map(op => (
                  <MenuItem key={op} value={op}>{op}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Value"
              type="number"
              value={condition.value}
              onChange={e => updateCondition(index, { value: Number(e.target.value) })}
              sx={{ width: '100px' }}
            />
          </Box>
        );
      case 'Aura':
        return (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Aura Name"
              value={condition.auraName}
              onChange={e => updateCondition(index, { auraName: e.target.value })}
              sx={{ width: '200px' }}
            />
            <FormControl sx={{ width: '150px' }}>
              <InputLabel>Target</InputLabel>
              <Select
                value={condition.target}
                label="Target"
                onChange={e => updateCondition(index, { target: e.target.value as Target })}
              >
                {TARGETS.map(target => (
                  <MenuItem key={target} value={target}>{target}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={condition.isPresent}
                  onChange={e => updateCondition(index, { isPresent: e.target.checked })}
                />
              }
              label="Is Present"
            />
          </Box>
        );
      case 'Resource':
        return (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl sx={{ width: '150px' }}>
              <InputLabel>Resource</InputLabel>
              <Select
                value={condition.resource}
                label="Resource"
                onChange={e => updateCondition(index, { resource: e.target.value as Resource })}
              >
                {RESOURCES.map(resource => (
                  <MenuItem key={resource} value={resource}>{resource}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: '150px' }}>
              <InputLabel>Operator</InputLabel>
              <Select
                value={condition.operator}
                label="Operator"
                onChange={e => updateCondition(index, { operator: e.target.value })}
              >
                {OPERATORS.map(op => (
                  <MenuItem key={op} value={op}>{op}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Value"
              type="number"
              value={condition.value}
              onChange={e => updateCondition(index, { value: Number(e.target.value) })}
              sx={{ width: '100px' }}
            />
          </Box>
        );
      case 'Cooldown':
        return (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Spell Name"
              value={condition.spellName}
              onChange={e => updateCondition(index, { spellName: e.target.value })}
              sx={{ width: '200px' }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={condition.isReady}
                  onChange={e => updateCondition(index, { isReady: e.target.checked })}
                />
              }
              label="Is Ready"
            />
            {!condition.isReady && (
              <>
                <FormControl sx={{ width: '150px' }}>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    value={condition.operator}
                    label="Operator"
                    onChange={e => updateCondition(index, { operator: e.target.value })}
                  >
                    {OPERATORS.map(op => (
                      <MenuItem key={op} value={op}>{op}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Value (seconds)"
                  type="number"
                  value={condition.value}
                  onChange={e => updateCondition(index, { value: Number(e.target.value) })}
                  sx={{ width: '100px' }}
                />
              </>
            )}
          </Box>
        );
      case 'Charges':
      case 'Stacks':
        return (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label={condition.type === 'Charges' ? 'Spell Name' : 'Aura Name'}
              value={condition.type === 'Charges' ? condition.spellName : condition.auraName}
              onChange={e => updateCondition(index, 
                condition.type === 'Charges' 
                  ? { spellName: e.target.value }
                  : { auraName: e.target.value }
              )}
              sx={{ width: '200px' }}
            />
            <FormControl sx={{ width: '150px' }}>
              <InputLabel>Operator</InputLabel>
              <Select
                value={condition.operator}
                label="Operator"
                onChange={e => updateCondition(index, { operator: e.target.value })}
              >
                {OPERATORS.map(op => (
                  <MenuItem key={op} value={op}>{op}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Value"
              type="number"
              value={condition.value}
              onChange={e => updateCondition(index, { value: Number(e.target.value) })}
              sx={{ width: '100px' }}
            />
          </Box>
        );
    }
  };

  const addCondition = () => {
    setAction(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        conditions: [...prev.conditions.conditions, { type: 'HP', operator: '>', value: 0 }]
      }
    }));
  };

  const removeCondition = (index: number) => {
    setAction(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        conditions: prev.conditions.conditions.filter((_, i) => i !== index)
      }
    }));
  };

  const updateCondition = (index: number, updates: Partial<Omit<Condition, 'type'>>) => {
    setAction(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        conditions: prev.conditions.conditions.map((c, i) => {
          if (i !== index) return c;
          if (!('type' in c)) return c; // Handle CompositeCondition case
          return { ...c, ...updates } as Condition;
        })
      }
    }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          minWidth: '90vw',
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle>
        {initialAction ? 'Edit Action' : 'New Action'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {/* Main Action Settings */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
            <TextField
              label="Spell Name"
              value={action.spellName}
              onChange={e => setAction(prev => ({ ...prev, spellName: e.target.value }))}
              sx={{ width: '300px' }}
            />
            <FormControl sx={{ width: '200px' }}>
              <InputLabel>Target</InputLabel>
              <Select
                value={action.target}
                label="Target"
                onChange={e => setAction(prev => ({ ...prev, target: e.target.value as Target }))}
              >
                {TARGETS.map(target => (
                  <MenuItem key={target} value={target}>{target}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Weight"
              type="number"
              value={action.weight}
              onChange={e => setAction(prev => ({ ...prev, weight: Number(e.target.value) }))}
              sx={{ width: '100px' }}
            />
            <TextField
              label="Priority"
              type="number"
              value={action.priority}
              onChange={e => setAction(prev => ({ ...prev, priority: Number(e.target.value) }))}
              sx={{ width: '100px' }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={action.interruptible}
                  onChange={e => setAction(prev => ({ ...prev, interruptible: e.target.checked }))}
                />
              }
              label="Interruptible"
            />
          </Box>

          {/* Conditions Section */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Conditions</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <FormControl sx={{ width: '200px' }}>
                <InputLabel>Logical Operator</InputLabel>
                <Select
                  value={action.conditions.operator}
                  label="Logical Operator"
                  onChange={e => setAction(prev => ({
                    ...prev,
                    conditions: { ...prev.conditions, operator: e.target.value as LogicalOperator }
                  }))}
                >
                  {LOGICAL_OPERATORS.map(op => (
                    <MenuItem key={op} value={op}>{op}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button onClick={addCondition} startIcon={<AddIcon />} variant="outlined">
                Add Condition
              </Button>
            </Box>

            {/* Condition List */}
            <Stack spacing={2}>
              {action.conditions.conditions.map((condition, index) => (
                <Box key={index}>
                  {index > 0 && (
                    <Box sx={{ 
                      py: 1, 
                      px: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      typography: 'subtitle1',
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}>
                      {action.conditions.operator}
                    </Box>
                  )}
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                      <FormControl sx={{ width: '200px' }}>
                        <InputLabel>Condition Type</InputLabel>
                        <Select
                          value={condition.type}
                          label="Condition Type"
                          onChange={e => handleConditionTypeChange(e.target.value as ConditionType, index)}
                        >
                          {CONDITION_TYPES.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Box sx={{ flex: 1, display: 'flex', gap: 2, alignItems: 'start' }}>
                        {renderConditionFields(condition, index)}
                      </Box>
                      <IconButton onClick={() => removeCondition(index)} color="error">
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
