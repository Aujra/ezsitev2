import { OPERATORS, TARGETS, RESOURCES } from "@/components/RotationBuilder/ActionModal/constants";
import { generateId } from '@/lib/utils';

// Update ConditionType to include 'RecentlyCast'
export type ConditionType = 'HP' | 'Aura' | 'Resource' | 'Cooldown' | 'Charges' | 'Stacks';
export type Target = 'Self' | 'Target' | 'Focus' | 'Tank' | 'Party1' | 'Party2' | 'Party3' | 'Party4';
export type Operator = '>' | '<' | '=' | '>=' | '<=';
export type Resource = 'Mana' | 'Rage' | 'Energy' | 'Focus' | 'RunicPower' | 'HolyPower';
export type LogicalOperator = 'AND' | 'OR' | 'NOT';

export type AuraType = 'Buff' | 'Debuff';

interface BaseCondition {
  type: ConditionType;
}

export interface FieldDefinition {
  type: 'text' | 'number' | 'select' | 'switch';
  label: string;
  key: string;  // Change to string to support nested paths
  options?: readonly (Target | Operator | Resource | AuraType | AuraCheckType)[];  // Add AuraType and AuraCheckType
  dependent?: {
    key: string;  // Change to string to support nested paths
    value: string | boolean;  // Update to allow string values for checkType
    show: boolean;
  };
}

export interface HPCondition extends BaseCondition {
  type: 'HP';
  operator: Operator;
  value: number;
}

export type AuraCheckType = 'presence' | 'duration' | 'stacks';

export interface AuraCondition extends BaseCondition {
  type: 'Aura';
  target: Target;
  auraName: string;
  auraType: AuraType;
  checkType: AuraCheckType;
  // Mutually exclusive fields based on checkType
  isPresent?: boolean;      // For 'presence'
  duration?: {              // For 'duration'
    remaining: number;
    operator: Operator;
  };
  stacks?: {               // For 'stacks'
    count: number;
    operator: Operator;
  };
}

export interface ResourceCondition extends BaseCondition {
  type: 'Resource';
  resource: Resource;
  operator: Operator;
  value: number;
}

export interface CooldownCondition extends BaseCondition {
  type: 'Cooldown';
  spellName: string;
  operator: Operator;
  value: number; // seconds
  isReady?: boolean;
}

export interface ChargesCondition extends BaseCondition {
  type: 'Charges';
  spellName: string;
  operator: Operator;
  value: number;
}

export interface StacksCondition extends BaseCondition {
  type: 'Stacks';
  auraName: string;
  operator: Operator;
  value: number;
}

// Update BaseConditions type to include RecentlyCastCondition
export type BaseConditions = 
  | HPCondition 
  | AuraCondition 
  | ResourceCondition 
  | CooldownCondition 
  | ChargesCondition 
  | StacksCondition

// Update Condition type to separate base conditions from composite
export type Condition = BaseConditions | CompositeCondition;

export interface ConditionGroup {
  operator: LogicalOperator;
  conditions: BaseConditions[]; // Only allows base conditions, not composite ones
}

export interface CompositeCondition {
  type: 'Composite';
  groups: ConditionGroup[];
}

// Add helper function for creating nested conditions
export function createNestedCondition(): CompositeCondition {
  return {
    type: 'Composite',
    groups: []
  };
}

export interface RotationAction {
  id: string;
  spellName: string;
  target: Target;
  weight: number;
  conditions: CompositeCondition;
  interruptible?: boolean;
  castTime?: number;
  priority?: number;
}

// Helper function to create rotation actions
export function createRotationAction(
  spellName: string,
  conditions: CompositeCondition,
  priority: number = 0,
  target: Target = 'Target'
): RotationAction {
  return {
    id: generateId(),
    spellName,
    target,
    weight: 1,
    conditions,
    priority
  };
}

export const CONDITION_FIELD_DEFINITIONS: Record<ConditionType, FieldDefinition[]> = {
  HP: [
    { type: 'select', label: 'Operator', key: 'operator', options: OPERATORS },
    { type: 'number', label: 'Value', key: 'value' }
  ],
  Aura: [
    { type: 'text', label: 'Aura Name', key: 'auraName' },
    { type: 'select', label: 'Target', key: 'target', options: TARGETS },
    { type: 'select', label: 'Aura Type', key: 'auraType', options: ['Buff', 'Debuff'] as const }, // Add as const
    { type: 'select', label: 'Check Type', key: 'checkType', options: ['presence', 'duration', 'stacks'] as const }, // Add as const
    // Presence fields
    { 
      type: 'switch', 
      label: 'Is Present', 
      key: 'isPresent',
      dependent: { key: 'checkType', value: 'presence', show: true }
    },
    // Duration fields
    { 
      type: 'select', 
      label: 'Duration Operator', 
      key: 'duration.operator',
      options: OPERATORS,
      dependent: { key: 'checkType', value: 'duration', show: true }
    },
    { 
      type: 'number', 
      label: 'Duration Remaining (seconds)', 
      key: 'duration.remaining',
      dependent: { key: 'checkType', value: 'duration', show: true }
    },
    // Stack fields
    { 
      type: 'select', 
      label: 'Stacks Operator', 
      key: 'stacks.operator',
      options: OPERATORS,
      dependent: { key: 'checkType', value: 'stacks', show: true }
    },
    { 
      type: 'number', 
      label: 'Stacks Count', 
      key: 'stacks.count',
      dependent: { key: 'checkType', value: 'stacks', show: true }
    }
  ],
  Resource: [
    { type: 'select', label: 'Resource', key: 'resource', options: RESOURCES },
    { type: 'select', label: 'Operator', key: 'operator', options: OPERATORS },
    { type: 'number', label: 'Value', key: 'value' }
  ],
  Cooldown: [
    { type: 'text', label: 'Spell Name', key: 'spellName' },
    { type: 'switch', label: 'Is Ready', key: 'isReady' },
    { 
      type: 'select', 
      label: 'Operator', 
      key: 'operator', 
      options: OPERATORS,
      dependent: { key: 'isReady', value: false, show: true }
    },
    { 
      type: 'number', 
      label: 'Value (seconds)',
      key: 'value',
      dependent: { key: 'isReady', value: false, show: true }
    }
  ],
  Charges: [
    { type: 'text', label: 'Spell Name', key: 'spellName' },
    { type: 'select', label: 'Operator', key: 'operator', options: OPERATORS },
    { type: 'number', label: 'Value', key: 'value' }
  ],
  Stacks: [
    { type: 'text', label: 'Aura Name', key: 'auraName' },
    { type: 'select', label: 'Operator', key: 'operator', options: OPERATORS },
    { type: 'number', label: 'Value', key: 'value' }
  ]
} as const;

// Add SavedRotation interface
export interface SavedRotation {
  id: string;
  name: string;
  data: {
  actions: RotationAction[];
  };
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
