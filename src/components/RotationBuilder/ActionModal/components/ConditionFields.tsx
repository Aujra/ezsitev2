'use client';

import { Box, FormControl, InputLabel, Select, MenuItem, TextField, FormControlLabel, Switch } from '@mui/material';
import { BaseConditions, FieldDefinition, CONDITION_FIELD_DEFINITIONS } from '@/types/rotation';

interface ConditionFieldsProps {
  condition: BaseConditions;
  onUpdate: (updates: Partial<Omit<BaseConditions, 'type'>>) => void;
}

export function ConditionFields({ condition, onUpdate }: ConditionFieldsProps) {
  const fields = CONDITION_FIELD_DEFINITIONS[condition.type];
  
  const isFieldVisible = (field: FieldDefinition) => {
    if (!field.dependent) return true;
    
    const dependentValue = getNestedValue(condition, field.dependent.key as string);
    const shouldShow = dependentValue === field.dependent.value;
    
    return shouldShow;
  };

  const getNestedValue = (obj: BaseConditions, path: string): unknown => {
    return path.split('.').reduce((acc, part) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj as unknown);
  };

  const setNestedValue = (path: string, value: string | number | boolean): void => {
    const parts = path.split('.');
    if (parts.length === 1) {
      onUpdate({ [path]: value });
    } else {
      const [parent, child] = parts;
      const parentObj = condition[parent as keyof typeof condition];
      
      // Type guard to ensure parentObj is an object
      if (parentObj && typeof parentObj === 'object' && !Array.isArray(parentObj)) {
        const updatedParent = {
          // @ts-expect-error this spreads fine
          ...parentObj,
          [child]: value
        };
        onUpdate({ [parent]: updatedParent });
      }
    }
  };

  const renderField = (field: FieldDefinition) => {
    const fieldValue = getNestedValue(condition, field.key as string);
    
    if (field.dependent) {
      const dependentValue = getNestedValue(condition, field.dependent.key as string);
      if (dependentValue !== field.dependent.value) {
        return null;
      }
    }

    switch (field.type) {
      case 'text':
        return (
          <TextField
            label={field.label}
            value={String(fieldValue || '')}
            onChange={e => setNestedValue(field.key as string, e.target.value)}
            sx={{ width: '200px' }}
          />
        );
      case 'number':
        return (
          <TextField
            label={field.label}
            type="number"
            value={Number(fieldValue || 0)}
            onChange={e => setNestedValue(field.key as string, Number(e.target.value))}
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
              onChange={e => setNestedValue(field.key as string, e.target.value)}
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
                onChange={e => setNestedValue(field.key as string, e.target.checked)}
              />
            }
            label={field.label}
          />
        );
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}>
      {/* Basic Info Group - Only non-dependent, non-switch fields */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        gap: 2,
        flexWrap: 'wrap',
      }}>
        {fields
          .filter(field => !field.dependent && field.type !== 'switch' && field.key !== 'isPresent')
          .map((field, index) => (
            <Box key={`${String(field.key)}-${index}`}>
              {renderField(field)}
            </Box>
          ))}
      </Box>

      {/* Switches Group - Only non-dependent switches */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        gap: 2,
        flexWrap: 'wrap',
      }}>
        {fields
          .filter(field => !field.dependent && field.type === 'switch')
          .map((field, index) => (
            <Box key={`${String(field.key)}-${index}`}>
              {renderField(field)}
            </Box>
          ))}
      </Box>

      {/* Dependent Fields Group */}
      {condition.type === 'Aura' && (
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 1,
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}>
          {fields
            .filter(field => field.dependent)
            .map((field, index) => {
              if (!isFieldVisible(field)) return null;
              return (
                <Box 
                  key={`${String(field.key)}-${index}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center'
                  }}
                >
                  {renderField(field)}
                </Box>
              );
            })}
        </Box>
      )}
    </Box>
  );
}
