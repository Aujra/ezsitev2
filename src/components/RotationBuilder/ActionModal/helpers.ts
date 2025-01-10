import { 
  ConditionType, 
  Condition, 
  RotationAction,
  Target,
  HPCondition,
  AuraCondition,
  ResourceCondition,
  CooldownCondition,
  ChargesCondition,
  StacksCondition,
  CompositeCondition
} from '@/types/rotation';
import { generateId } from '@/lib/utils';

export function createDefaultCondition(type: ConditionType): Condition {
  const baseCondition = { type };

  switch (type) {
    case 'HP':
      return {
        ...baseCondition,
        operator: '>',
        value: 0
      } as HPCondition;

    case 'Aura':
      return {
        ...baseCondition,
        target: 'Self',
        auraName: '',
        isPresent: true,
        stacks: undefined,
        operator: undefined
      } as AuraCondition;

    case 'Resource':
      return {
        ...baseCondition,
        resource: 'Mana',
        operator: '>',
        value: 0
      } as ResourceCondition;

    case 'Cooldown':
      return {
        ...baseCondition,
        spellName: '',
        operator: '=',
        value: 0,
        isReady: true
      } as CooldownCondition;

    case 'Charges':
      return {
        ...baseCondition,
        spellName: '',
        operator: '>',
        value: 0
      } as ChargesCondition;

    case 'Stacks':
      return {
        ...baseCondition,
        auraName: '',
        operator: '>',
        value: 0
      } as StacksCondition;
  }
}

export function createDefaultAction(): RotationAction {
  return {
    id: generateId(),
    spellName: '',
    target: 'Target' as Target,
    weight: 1,
    conditions: {
      type: 'Composite',
      operator: 'AND',
      conditions: []
    },
    priority: 0,
    interruptible: false
  };
}

export function validateCondition(condition: Condition): boolean {
  switch (condition.type) {
    case 'HP':
      return condition.value >= 0 && condition.value <= 100;
    
    case 'Aura':
      return condition.auraName.length > 0;
    
    case 'Resource':
      return condition.value >= 0;
    
    case 'Cooldown':
      return condition.spellName.length > 0 && 
        (condition.isReady || condition.value >= 0);
    
    case 'Charges':
      return condition.spellName.length > 0 && condition.value >= 0;
    
    case 'Stacks':
      return condition.auraName.length > 0 && condition.value >= 0;
    
    default:
      return false;
  }
}

export function getConditionDescription(condition: Condition): string {
  console.log('condition', condition);
  switch (condition.type) {
    case 'HP':
      return `HP ${condition.operator} ${condition.value}%`;
    
    case 'Aura':
      return `${condition.auraName} ${condition.isPresent ? 'present' : 'not present'} on ${condition.target}${
        condition.stacks ? ` with ${condition.operator} ${condition.stacks} stacks` : ''
      }`;
    
    case 'Resource':
      return `${condition.resource} ${condition.operator} ${condition.value}`;
    
    case 'Cooldown':
      return condition.isReady
        ? `${condition.spellName} is ready`
        : `${condition.spellName} cooldown ${condition.operator} ${condition.value}s`;
    
    case 'Charges':
      return `${condition.spellName} charges ${condition.operator} ${condition.value}`;
    
    case 'Stacks':
      return `${condition.auraName} stacks ${condition.operator} ${condition.value}`;
    
    default:
      return 'Invalid condition';
  }
}

export function renderConditionText(conditions: CompositeCondition): string {
  if (!conditions.conditions.length) {
    return 'None';
  }

  const conditionTexts = conditions.conditions.map(condition => {
    if ('conditions' in condition && Array.isArray(condition.conditions)) {
      // This is a nested CompositeCondition
      return `(${renderConditionText(condition)})`;
    } else {
      // This is a single Condition
      return getConditionDescription(condition as Condition);
    }
  });

  // Join with the operator wrapped in brackets
  return conditionTexts.join(` [${conditions.operator}] `);
}
