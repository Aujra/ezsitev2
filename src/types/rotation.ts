import { OPERATORS, TARGETS, RESOURCES } from "@/components/RotationBuilder/ActionModal/constants";

export type ConditionType = 'HP' | 'Aura' | 'Resource' | 'Cooldown' | 'Charges' | 'Stacks';
export type Target = 'Self' | 'Target' | 'Focus' | 'Tank' | 'Party1' | 'Party2' | 'Party3' | 'Party4';
export type Operator = '>' | '<' | '=' | '>=' | '<=';
export type Resource = 'Mana' | 'Rage' | 'Energy' | 'Focus' | 'RunicPower';
export type LogicalOperator = 'AND' | 'OR' | 'NOT';

type ConditionKeys = keyof (HPCondition & AuraCondition & ResourceCondition & CooldownCondition & ChargesCondition & StacksCondition);

type FieldOptionType = string | number | boolean;

interface BaseCondition {
  type: ConditionType;
}

export interface FieldDefinition {
  type: 'text' | 'number' | 'select' | 'switch';
  label: string;
  key: ConditionKeys;
  options?: readonly (Target | Operator | Resource)[];
  dependent?: {
    key: ConditionKeys;
    value: FieldOptionType;
    show: boolean;
  };
}

export interface HPCondition extends BaseCondition {
  type: 'HP';
  operator: Operator;
  value: number;
}

export interface AuraCondition extends BaseCondition {
  type: 'Aura';
  target: Target;
  auraName: string;
  isPresent: boolean;
  stacks?: number;
  operator?: Operator;
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

export type Condition = 
  | HPCondition 
  | AuraCondition 
  | ResourceCondition 
  | CooldownCondition 
  | ChargesCondition 
  | StacksCondition;

export interface CompositeCondition {
  operator: LogicalOperator;
  conditions: (Condition | CompositeCondition)[];
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

// Example spell condition templates
export const SPELL_CONDITIONS = {
  NO_ACTIVE_COOLDOWNS: {
    operator: 'NOT',
    conditions: [
      {
        operator: 'OR',
        conditions: [
          { type: 'Aura', target: 'Self', auraName: 'Arcane Surge', isPresent: true },
          { type: 'Aura', target: 'Self', auraName: 'Arcane Soul', isPresent: true },
          { type: 'Aura', target: 'Self', auraName: 'Siphon Storm', isPresent: true },
          { type: 'Aura', target: 'Self', auraName: 'Touch of the Magi', isPresent: true }
        ]
      }
    ]
  },
  CLEARCASTING_CONDITION: {
    operator: 'OR',
    conditions: [
      {
        operator: 'AND',
        conditions: [
          { type: 'Aura', target: 'Self', auraName: 'Clearcasting', isPresent: true },
          { type: 'Aura', target: 'Self', auraName: 'Nether Precision', isPresent: false }
        ]
      },
      {
        type: 'Aura',
        target: 'Self',
        auraName: 'Clearcasting',
        isPresent: true,
        stacks: 3,
        operator: '>='
      }
    ]
  }
} as const;

// Helper function to create rotation actions
export function createRotationAction(
  spellName: string,
  conditions: CompositeCondition,
  priority: number = 0,
  target: Target = 'Target'
): RotationAction {
  return {
    id: crypto.randomUUID(),
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
    { type: 'switch', label: 'Is Present', key: 'isPresent' },
    { type: 'number', label: 'Stacks', key: 'stacks' }
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
