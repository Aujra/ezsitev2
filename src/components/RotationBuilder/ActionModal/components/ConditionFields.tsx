'use client';

import { Box, FormControl, InputLabel, Select, MenuItem, TextField, FormControlLabel, Switch } from '@mui/material';
import { BaseConditions, FieldDefinition, CONDITION_FIELD_DEFINITIONS } from '@/types/rotation';

interface ConditionFieldsProps {
  condition: BaseConditions;
  onUpdate: (updates: Partial<Omit<BaseConditions, 'type'>>) => void;
}

export function ConditionFields({ condition, onUpdate }: ConditionFieldsProps) {
  const renderField = (field: FieldDefinition) => {
    // Type-safe property access
    const fieldValue = condition[field.key as keyof typeof condition];
    
    if (field.dependent) {
      const dependentValue = condition[field.dependent.key as keyof typeof condition];
      if (Boolean(dependentValue) !== field.dependent.value) {
        return null;
      }
    }

    switch (field.type) {
      case 'text':
        return (
          <TextField
            label={field.label}
            value={String(fieldValue || '')}
            onChange={e => onUpdate({ [field.key]: e.target.value })}
            sx={{ width: '200px' }}
          />
        );
      case 'number':
        return (
          <TextField
            label={field.label}
            type="number"
            value={Number(fieldValue || 0)}
            onChange={e => onUpdate({ [field.key]: Number(e.target.value) })}
            sx={{ width: '100px' }}
          />
        );
      case 'select':
        return (
          <FormControl sx={{ width: '150px' }}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={String(fieldValue || '')}
              label={field.label}
              onChange={e => onUpdate({ [field.key]: e.target.value })}
            >
              {field.options?.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(fieldValue)}
                onChange={e => onUpdate({ [field.key]: e.target.checked })}
              />
            }
            label={field.label}
          />
        );
    }
  };

  const fields = CONDITION_FIELD_DEFINITIONS[condition.type];

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {fields.map((field, index) => (
        <Box key={`${String(field.key)}-${index}`}>
          {renderField(field)}
        </Box>
      ))}
    </Box>
  );
}
