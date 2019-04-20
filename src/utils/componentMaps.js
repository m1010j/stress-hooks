import ClassComponent from '../components/benchmarkComponents/ClassComponent';
import FunctionalComponent from '../components/benchmarkComponents/FunctionalComponent';
import NaiveHooksComponent from '../components/benchmarkComponents/NaiveHooksComponent';
import MemoHooksComponent from '../components/benchmarkComponents/MemoHooksComponent';
import FunctionHooksComponent from '../components/benchmarkComponents/FunctionHooksComponent';
import RefHooksComponent from '../components/benchmarkComponents/RefHooksComponent';

import {
  classComponentCode,
  functionalComponentCode,
  naiveHooksComponentCode,
  memoHooksComponentCode,
  functionHooksComponentCode,
  refHooksComponentCode,
} from './sourceCode';

export const componentMap = {
  class: ClassComponent,
  functional: FunctionalComponent,
  naiveHooks: NaiveHooksComponent,
  memoHooks: MemoHooksComponent,
  functionHooks: FunctionHooksComponent,
  refHooks: RefHooksComponent,
};

export const componentShortDescriptionMap = {
  class: 'ClassComponent',
  functional: 'FunctionalComponent',
  naiveHooks: 'HooksComponent',
  memoHooks: 'Memo',
  functionHooks: 'Function',
  refHooks: 'Ref',
};

export const componentFullDescriptionMap = {
  ...componentShortDescriptionMap,
  naiveHooks: 'NaiveHooksComponent',
  memoHooks: 'MemoHooksComponent',
  functionHooks: 'FunctionHooksComponent',
  refHooks: 'RefHooksComponent',
};

export const componentCodeMap = {
  class: classComponentCode,
  functional: functionalComponentCode,
  naiveHooks: naiveHooksComponentCode,
  memoHooks: memoHooksComponentCode,
  functionHooks: functionHooksComponentCode,
  refHooks: refHooksComponentCode,
};
