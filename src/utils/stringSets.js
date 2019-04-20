import { componentMap } from './componentMaps';

export const specializedHooksComponentStrings = new Set([
  'memoHooks',
  'functionHooks',
  'refHooks',
]);

export const genericHooksComponentStrings = new Set([
  ...specializedHooksComponentStrings,
  'naiveHooks',
]);

export const allComponentStrings = new Set(Object.keys(componentMap));
