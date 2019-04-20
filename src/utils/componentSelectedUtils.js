import {
  genericHooksComponentStrings,
  allComponentStrings,
} from './stringSets';

export function isComponent(currentComponent, otherComponent) {
  return currentComponent === otherComponent;
}

export function isClassComponent(currentComponent) {
  return isComponent(currentComponent, 'class');
}

export function isFunctionalComponent(currentComponent) {
  return isComponent(currentComponent, 'functional');
}

export function isNaiveHooksComponent(currentComponent) {
  return isComponent(currentComponent, 'naiveHooks');
}

export function isMemoHooksComponent(currentComponent) {
  return isComponent(currentComponent, 'memoHooks');
}

export function isFunctionHooksComponent(currentComponent) {
  return isComponent(currentComponent, 'functionHooks');
}

export function isRefHooksComponent(currentComponent) {
  return isComponent(currentComponent, 'refHooks');
}

export function isGenericHooksComponent(currentComponent) {
  return genericHooksComponentStrings.has(currentComponent);
}

export function isComponentSelected(currentComponent) {
  return allComponentStrings.has(currentComponent);
}
