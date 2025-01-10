export type ConditionType = 'HP' | 'Aura' | 'Resource' | 'Cooldown' | 'Charges' | 'Stacks';
export type Target = 'Self' | 'Target' | 'Focus' | 'Tank' | 'Party1' | 'Party2' | 'Party3' | 'Party4';
export type Operator = '>' | '<' | '=' | '>=' | '<=';
export type Resource = 'Mana' | 'Rage' | 'Energy' | 'Focus' | 'RunicPower';
export type LogicalOperator = 'AND' | 'OR' | 'NOT';

interface BaseCondition {
  type: ConditionType;
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
