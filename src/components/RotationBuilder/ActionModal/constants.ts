import { Target, Resource, Operator, LogicalOperator, ConditionType, AuraType } from '@/types/rotation';

export const TARGETS: Target[] = ['Self', 'Target', 'Focus', 'Tank', 'Party1', 'Party2', 'Party3', 'Party4'];
export const RESOURCES: Resource[] = ['Mana', 'Rage', 'Energy', 'Focus', 'RunicPower', 'HolyPower'];
export const OPERATORS: Operator[] = ['>', '<', '=', '>=', '<='];
export const LOGICAL_OPERATORS: LogicalOperator[] = ['AND', 'OR', 'NOT'];
export const CONDITION_TYPES: ConditionType[] = ['HP', 'Aura', 'Resource', 'Cooldown', 'Charges', 'Stacks'];
export const AURA_TYPES: AuraType[] = ['Buff', 'Debuff'];
