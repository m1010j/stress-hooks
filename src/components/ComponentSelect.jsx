import React from 'react';
import CodeSnippet from './CodeSnippet';
import {
  componentShortDescriptionMap,
  componentCodeMap,
} from '../utils/componentMaps';
import {
  isClassComponent,
  isFunctionalComponent,
  isNaiveHooksComponent,
  isMemoHooksComponent,
  isFunctionHooksComponent,
  isRefHooksComponent,
  isGenericHooksComponent,
  isComponentSelected,
} from '../utils/componentSelectedUtils';

function ComponentSelect(props) {
  const { syntaxError, component, handleChangeComponent } = props;

  const classComponentSelected = isClassComponent(component);
  const functionalComponentSelected = isFunctionalComponent(component);
  const genericHooksComponentSelected = isGenericHooksComponent(component);
  const naiveHooksComponentSelected = isNaiveHooksComponent(component);
  const memoHooksComponentSelected = isMemoHooksComponent(component);
  const functionHooksComponentSelected = isFunctionHooksComponent(component);
  const refHooksComponentSelected = isRefHooksComponent(component);
  const componentSelectedSelected = isComponentSelected(component);

  const radioContainerClass = `radioContainer${
    syntaxError ? ' radioContainer--disabled' : ''
  }`;
  const memoRadioContainerClass = `memoRadioContainer${
    !genericHooksComponentSelected || syntaxError
      ? ' memoRadioContainer--disabled'
      : ''
  }`;

  const componentSelectContainerClass = `componentSelectContainer${
    componentSelectedSelected ? ' componentSelectContainer--selected' : ''
  }`;

  return (
    <React.Fragment>
      <p
        className={`p__componentSelect${
          syntaxError ? ' p__componentSelect--disabled' : ''
        }`}
      >
        3. Select component to benchmark
      </p>
      <div className={componentSelectContainerClass}>
        <div
          className={`${radioContainerClass}${
            classComponentSelected ? ' radioContainer--checked' : ''
          }`}
        >
          <input
            id="radioInput--class"
            type="radio"
            value="class"
            checked={classComponentSelected}
            onChange={handleChangeComponent('class')}
            disabled={syntaxError}
          />
          <label htmlFor="radioInput--class">
            {componentShortDescriptionMap.class}
          </label>
        </div>
        <div
          className={`${radioContainerClass}${
            functionalComponentSelected ? ' radioContainer--checked' : ''
          }`}
        >
          <input
            id="radioInput--functional"
            type="radio"
            value="functional"
            checked={functionalComponentSelected}
            onChange={handleChangeComponent('functional')}
            disabled={syntaxError}
          />
          <label htmlFor="radioInput--functional">
            {componentShortDescriptionMap.functional}
          </label>
        </div>
        <div
          className={`${radioContainerClass}${
            genericHooksComponentSelected ? ' radioContainer--checked' : ''
          }`}
        >
          <input
            id="radioInput--hooks"
            type="radio"
            value="naiveHooks"
            checked={genericHooksComponentSelected}
            onChange={handleChangeComponent('naiveHooks')}
            disabled={syntaxError}
          />
          <label htmlFor="radioInput--hooks">
            {componentShortDescriptionMap.naiveHooks}
          </label>
        </div>
      </div>
      <div className="benchmarkCode">
        {genericHooksComponentSelected && (
          <div className="hooksComponentSelectContainer">
            <div
              className={`${memoRadioContainerClass}${
                naiveHooksComponentSelected
                  ? ' memoRadioContainer--checked'
                  : ''
              }`}
              id="memoRadioContainer--naive"
            >
              <input
                id="checkboxInput--naive"
                type="radio"
                value="naiveHooks"
                checked={naiveHooksComponentSelected}
                onChange={handleChangeComponent('naiveHooks')}
                disabled={!genericHooksComponentSelected || syntaxError}
              />
              <label htmlFor="checkboxInput--naive">Naive</label>
            </div>
            <div
              className={`${memoRadioContainerClass}${
                memoHooksComponentSelected ? ' memoRadioContainer--checked' : ''
              }`}
              id="memoRadioContainer--memo"
            >
              <input
                id="checkboxInput--memo"
                type="radio"
                value="memoHooks"
                checked={memoHooksComponentSelected}
                onChange={handleChangeComponent('memoHooks')}
                disabled={!genericHooksComponentSelected || syntaxError}
              />
              <label htmlFor="checkboxInput--memo">
                {componentShortDescriptionMap.memoHooks}
              </label>
            </div>
            <div
              className={`${memoRadioContainerClass}${
                functionHooksComponentSelected
                  ? ' memoRadioContainer--checked'
                  : ''
              }`}
              id="memoRadioContainer--function"
            >
              <input
                id="checkboxInput--function"
                type="radio"
                value="functionHooks"
                checked={functionHooksComponentSelected}
                onChange={handleChangeComponent('functionHooks')}
                disabled={!genericHooksComponentSelected || syntaxError}
              />
              <label htmlFor="checkboxInput--function">
                {componentShortDescriptionMap.functionHooks}
              </label>
            </div>
            <div
              className={`${memoRadioContainerClass}${
                refHooksComponentSelected ? ' memoRadioContainer--checked' : ''
              }`}
              id="memoRadioContainer--ref"
            >
              <input
                id="checkboxInput--ref"
                type="radio"
                value="refHooks"
                checked={refHooksComponentSelected}
                onChange={handleChangeComponent('refHooks')}
                disabled={!genericHooksComponentSelected || syntaxError}
              />
              <label htmlFor="checkboxInput--ref">
                {componentShortDescriptionMap.refHooks}
              </label>
            </div>
          </div>
        )}
        {!syntaxError && Boolean(component) && (
          <CodeSnippet code={componentCodeMap[component]} />
        )}
      </div>
    </React.Fragment>
  );
}

export default ComponentSelect;
