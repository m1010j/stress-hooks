import React from 'react';
import Editor from 'react-simple-code-editor';
import debounce from 'lodash/debounce';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import retrieveArguments from 'retrieve-arguments';

import Modal from './components/Modal';
import Benchmark from './components/Benchmark';
import ClassComponent from './components/ClassComponent';
import FunctionalComponent from './components/FunctionalComponent';
import HooksComponent from './components/HooksComponent';
import HooksMemoComponent from './components/HooksMemoComponent';
import HooksFunctionComponent from './components/HooksFunctionComponent';
import HooksRefComponent from './components/HooksRefComponent';
import CodeSnippet from './components/CodeSnippet';
import {
  classComponentCode,
  functionalComponentCode,
  hooksComponentCode,
  hooksMemoComponentCode,
  hooksFunctionComponentCode,
  hooksRefComponentCode,
} from './utils/sourceCode';
import defaultBenchmark from './utils/defaultBenchmark';
import retrieveArrowArguments from './utils/retrieveArrowArguments';
import numberWithCommas from './utils/numberWithCommas';
import './App.css';

const space = '\u00A0';

const componentMap = {
  class: ClassComponent,
  functional: FunctionalComponent,
  hooks: HooksComponent,
  hooksMemo: HooksMemoComponent,
  hooksFunction: HooksFunctionComponent,
  hooksRef: HooksRefComponent,
};

const componentShortDescriptionMap = {
  class: 'ClassComponent',
  functional: 'FunctionalComponent',
  hooks: 'HooksComponent',
  hooksMemo: 'Memo',
  hooksFunction: 'Function',
  hooksRef: 'Ref',
};

const componentFullDescriptionMap = {
  ...componentShortDescriptionMap,
  hooksMemo: 'HooksMemoComponent',
  hooksFunction: 'HooksFunctionComponent',
  hooksRef: 'HooksRefComponent',
};

const componentCodeMap = {
  class: classComponentCode,
  functional: functionalComponentCode,
  hooks: hooksComponentCode,
  hooksMemo: hooksMemoComponentCode,
  hooksFunction: hooksFunctionComponentCode,
  hooksRef: hooksRefComponentCode,
};

const specializedHooksComponentStrings = new Set([
  'hooksMemo',
  'hooksFunction',
  'hooksRef',
]);

const genericHooksComponentStrings = new Set([
  ...specializedHooksComponentStrings,
  'hooks',
]);

const clearedTimesState = { startTime: null, endTime: null };

const runBenchmarkState = {
  runBenchmark: true,
  runValidation: false,
  runtimeError: null,
};

/* eslint-disable no-eval */
let defaultBenchmarkFunction;
eval(`defaultBenchmarkFunction = ${defaultBenchmark}`);
/* eslint-enable no-eval */

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      benchmark: defaultBenchmarkFunction,
      component: null,
      runBenchmark: false,
      hooksSelected: false,
      args: [35],
      startTime: null,
      stopTime: null,
      totalRenders: 10,
      benchmarkString: defaultBenchmark,
      syntaxError: null,
      runtimeError: null,
      runValidation: false,
    };
    this.handleUpdateBenchmark = debounce(this.handleUpdateBenchmark, 300);
    this.worker = window.Worker ? new Worker('worker.js') : null;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  catchRuntimeError = errorMessage => {
    this.setState({
      runtimeError: errorMessage,
      runBenchmark: false,
      ...clearedTimesState,
    });
  };

  handleCloseModal = e => {
    if (e) e.preventDefault();
    this.setState(clearedTimesState);
  };

  handleKeyPress = e => {
    if (e.keyCode === 27) {
      this.handleCloseModal();
    }
  };

  handleChangeBenchmark = value => {
    // this.setState({ benchmarkString: value }, this.handleUpdateBenchmark);
    this.setState({ benchmarkString: value }, this.handleUpdateBenchmark);
  };

  handleUpdateBenchmark = () => {
    try {
      let benchmark;
      /* eslint-disable no-eval */
      eval(`benchmark = ${this.state.benchmarkString}`);
      /* eslint-enable no-eval */
      this.setState({ benchmark, syntaxError: null });
    } catch (error) {
      this.setState({ syntaxError: error.message, benchmark: null });
    }
  };

  handleChangeArgument = idx => e => {
    const args = this.state.args.slice();
    args.splice(idx, 1, e.currentTarget.value);
    this.setState({ args, ...clearedTimesState });
  };

  handleChangeTotalRenders = e => {
    this.setState({
      totalRenders: e.currentTarget.value,
      ...clearedTimesState,
    });
  };

  handleChangeComponent = component => {
    return () => {
      this.setState({ component, ...clearedTimesState });
    };
  };

  handleChangeComponent = component => {
    return e => {
      if (
        specializedHooksComponentStrings.has(component) &&
        !e.currentTarget.checked
      ) {
        this.setState({ component: 'hooks', ...clearedTimesState });
      } else {
        this.setState({ component, ...clearedTimesState });
      }
    };
  };

  handleRunBenchmark = e => {
    e.preventDefault();
    this.setState({ runValidation: true });
  };

  stopBenchmark = () => {
    const stopTime = new Date();
    setTimeout(() => {
      this.setState({ runBenchmark: false, stopTime });
    }, 1000);
  };

  isComponent = component => {
    return this.state.component === component;
  };

  isClassComponent = () => {
    return this.isComponent('class');
  };

  isFunctionalComponent = () => {
    return this.isComponent('functional');
  };

  isHooksComponent = () => {
    return this.isComponent('hooks');
  };

  isHooksMemoComponent = () => {
    return this.isComponent('hooksMemo');
  };

  isHooksFunctionComponent = () => {
    return this.isComponent('hooksFunction');
  };

  isHooksRefComponent = () => {
    return this.isComponent('hooksRef');
  };

  isGenericHooksComponent = () => {
    return genericHooksComponentStrings.has(this.state.component);
  };

  renderBenchmarkFunction = () => {
    const { benchmarkString } = this.state;
    return (
      <React.Fragment>
        <label htmlFor="benchmarkEditor" className="benchmarkEditor__label">
          1. Enter benchmark function (or use the one provided)
        </label>
        <Editor
          id="benchmarkEditor"
          value={benchmarkString}
          onValueChange={this.handleChangeBenchmark}
          highlight={code => highlight(code, languages.js)}
          padding={10}
          className="Editor"
        />
      </React.Fragment>
    );
  };

  renderErrors = () => {
    const { syntaxError, runtimeError } = this.state;
    return (
      <React.Fragment>
        {Boolean(syntaxError) && (
          <p className="p--Error">Syntax error: {syntaxError}</p>
        )}
        {Boolean(runtimeError) && (
          <p className="p--Error">Runtime error: {runtimeError}</p>
        )}
      </React.Fragment>
    );
  };

  renderParametersSelect = () => {
    const {
      benchmark,
      benchmarkString,
      args,
      syntaxError,
      totalRenders,
    } = this.state;
    let benchmarkArguments = [];
    try {
      benchmarkArguments = retrieveArguments(benchmark);
    } catch {
      if (!syntaxError) {
        benchmarkArguments = retrieveArrowArguments(benchmarkString);
      }
    }
    const benchmarkArgumentInputs = benchmarkArguments.map((argument, idx) => {
      const benchmarkArgumentInputItemClassName = `benchmarkArgumentInputItem${
        benchmarkArguments.length > 1
          ? ' benchmarkArgumentInputItem--multipleArgs'
          : ''
      }${idx % 3 === 2 ? ' benchmarkArgumentInputItem--lastInRow' : ''}`;

      return (
        <div className={benchmarkArgumentInputItemClassName} key={idx}>
          <label htmlFor={`benchmarkArgument_${idx}`}>
            {argument}
            {space}={space}
          </label>
          <input
            id={`benchmarkArgument_${idx}`}
            name={argument}
            type="text"
            value={args[idx]}
            onChange={this.handleChangeArgument(idx)}
            disabled={syntaxError}
          />
        </div>
      );
    });

    const totalRendersContainerClassName = `totalRendersContainer${
      benchmarkArguments.length === 2 ? ' totalRendersContainer--twoArgs' : ''
    }`;
    const totalRendersContainer = (
      <div className={totalRendersContainerClassName}>
        <label htmlFor="totalRendersInput">
          Total number of renders:{space}
          {space}
        </label>
        <input
          id="totalRendersInput"
          name="total number of renders"
          type="number"
          value={totalRenders}
          onChange={this.handleChangeTotalRenders}
          disabled={syntaxError}
        />
      </div>
    );
    return (
      <React.Fragment>
        <p
          className={`p__parameters${
            syntaxError ? ' p__parameters--disabled' : ''
          }`}
        >
          2. Select parameters (or use the ones provided)
        </p>
        <div
          className={`parametersContainer${
            syntaxError ? ' parametersContainer--disabled' : ''
          }`}
        >
          {benchmarkArgumentInputs}
          {benchmarkArguments.length < 3 && totalRendersContainer}
        </div>
        {benchmarkArguments.length > 2 && totalRendersContainer}
      </React.Fragment>
    );
  };

  renderComponentSelect = () => {
    const { syntaxError } = this.state;

    const radioContainerClass = `radioContainer${
      syntaxError ? ' radioContainer--disabled' : ''
    }`;
    const memoRadioContainerClass = `memoRadioContainer${
      !this.isGenericHooksComponent() || syntaxError
        ? ' memoRadioContainer--disabled'
        : ''
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
        <div className="componentSelectContainer">
          <div
            className={`${radioContainerClass}${
              this.isClassComponent() ? ' radioContainer--checked' : ''
            }`}
          >
            <input
              id="radioInput--class"
              type="radio"
              value="class"
              checked={this.isClassComponent()}
              onChange={this.handleChangeComponent('class')}
              disabled={syntaxError}
            />
            <label htmlFor="radioInput--class">
              {componentShortDescriptionMap.class}
            </label>
          </div>
          <div
            className={`${radioContainerClass}${
              this.isFunctionalComponent() ? ' radioContainer--checked' : ''
            }`}
          >
            <input
              id="radioInput--functional"
              type="radio"
              value="functional"
              checked={this.isFunctionalComponent()}
              onChange={this.handleChangeComponent('functional')}
              disabled={syntaxError}
            />
            <label htmlFor="radioInput--functional">
              {componentShortDescriptionMap.functional}
            </label>
          </div>
          <div
            className={`${radioContainerClass}${
              this.isGenericHooksComponent() ? ' radioContainer--checked' : ''
            }`}
          >
            <input
              id="radioInput--hooks"
              type="radio"
              value="hooks"
              checked={this.isGenericHooksComponent()}
              onChange={this.handleChangeComponent('hooks')}
              disabled={syntaxError}
            />
            <label htmlFor="radioInput--hooks">
              {componentShortDescriptionMap.hooks}
            </label>
          </div>
        </div>
        <div className="benchmarkCode">
          {this.isGenericHooksComponent() && (
            <div className="hooksComponentSelectContainer">
              <div
                className={`${memoRadioContainerClass}${
                  this.isHooksComponent() ? ' memoRadioContainer--checked' : ''
                }`}
                id="memoRadioContainer--naive"
              >
                <input
                  id="checkboxInput--naive"
                  type="radio"
                  value="hooks"
                  checked={this.isHooksComponent()}
                  onChange={this.handleChangeComponent('hooks')}
                  disabled={!this.isGenericHooksComponent() || syntaxError}
                />
                <label htmlFor="checkboxInput--naive">Naive</label>
              </div>
              <div
                className={`${memoRadioContainerClass}${
                  this.isHooksMemoComponent()
                    ? ' memoRadioContainer--checked'
                    : ''
                }`}
                id="memoRadioContainer--memo"
              >
                <input
                  id="checkboxInput--memo"
                  type="radio"
                  value="hooksMemo"
                  checked={this.isHooksMemoComponent()}
                  onChange={this.handleChangeComponent('hooksMemo')}
                  disabled={!this.isGenericHooksComponent() || syntaxError}
                />
                <label htmlFor="checkboxInput--memo">
                  {componentShortDescriptionMap.hooksMemo}
                </label>
              </div>
              <div
                className={`${memoRadioContainerClass}${
                  this.isHooksFunctionComponent()
                    ? ' memoRadioContainer--checked'
                    : ''
                }`}
                id="memoRadioContainer--function"
              >
                <input
                  id="checkboxInput--function"
                  type="radio"
                  value="hooksFunction"
                  checked={this.isHooksFunctionComponent()}
                  onChange={this.handleChangeComponent('hooksFunction')}
                  disabled={!this.isGenericHooksComponent() || syntaxError}
                />
                <label htmlFor="checkboxInput--function">
                  {componentShortDescriptionMap.hooksFunction}
                </label>
              </div>
              <div
                className={`${memoRadioContainerClass}${
                  this.isHooksRefComponent()
                    ? ' memoRadioContainer--checked'
                    : ''
                }`}
                id="memoRadioContainer--ref"
              >
                <input
                  id="checkboxInput--ref"
                  type="radio"
                  value="hooksRef"
                  checked={this.isHooksRefComponent()}
                  onChange={this.handleChangeComponent('hooksRef')}
                  disabled={!this.isGenericHooksComponent() || syntaxError}
                />
                <label htmlFor="checkboxInput--ref">
                  {componentShortDescriptionMap.hooksRef}
                </label>
              </div>
            </div>
          )}
          {!syntaxError && this.renderBenchmarkCode()}
        </div>
      </React.Fragment>
    );
  };

  renderRunButton = () => {
    const { component } = this.state;
    if (!component) return null;
    return (
      <button onClick={this.handleRunBenchmark} className="runButton">
        4. Run benchmark!
      </button>
    );
  };

  renderValidation = () => {
    const { benchmark, runValidation, benchmarkString, args } = this.state;
    if (runValidation) {
      if (this.worker) {
        const argsSerialized = JSON.stringify(args);
        this.worker.postMessage({ benchmarkString, argsSerialized });
        this.worker.onmessage = e => {
          setTimeout(() => {
            const { data } = e;
            const { runtimeError } = data;
            if (runtimeError) {
              this.setState({ runValidation: false }, () => {
                this.catchRuntimeError(runtimeError);
              });
            } else {
              this.setState({
                ...runBenchmarkState,
                startTime: new Date(),
              });
            }
          }, 500);
        };
      } else {
        try {
          benchmark(...args);
          this.setState({
            ...runBenchmarkState,
            startTime: new Date(),
          });
        } catch (error) {
          this.catchRuntimeError(error.message);
        }
      }
    }
    return runValidation && this.worker ? (
      <Modal handleCloseModal={this.handleCloseModal}>
        <h2>Analyzing</h2>
        <div>
          <img src="spinner.svg" alt="Analyzing..." />
        </div>
      </Modal>
    ) : null;
  };

  renderBenchmark = () => {
    const {
      runBenchmark,
      component,
      benchmark,
      args,
      totalRenders,
    } = this.state;
    return (
      runBenchmark && (
        <Benchmark
          component={componentMap[component]}
          benchmark={benchmark}
          args={args}
          totalRenders={totalRenders}
          stopBenchmark={this.stopBenchmark}
          handleCloseModal={this.handleCloseModal}
        />
      )
    );
  };

  renderResults = () => {
    const {
      runBenchmark,
      startTime,
      stopTime,
      totalRenders,
      component,
    } = this.state;

    const componentDescription = componentFullDescriptionMap[component];
    return (
      !runBenchmark &&
      Boolean(startTime) &&
      Boolean(stopTime) && (
        <Modal handleCloseModal={this.handleCloseModal}>
          <h2>Result</h2>
          <p>
            It took the {componentDescription}{' '}
            {numberWithCommas(stopTime.getTime() - startTime.getTime())}{' '}
            milliseconds to calculate the function {totalRenders} times.
          </p>
          <div className="modal__buttonContainer">
            <button onClick={this.handleRunBenchmark}>Run again</button>
            <button onClick={this.handleCloseModal}>Close</button>
          </div>
        </Modal>
      )
    );
  };

  renderBenchmarkCode = () => {
    const { component } = this.state;
    return (
      Boolean(component) && (
        <React.Fragment>
          <CodeSnippet code={componentCodeMap[component]} />
        </React.Fragment>
      )
    );
  };

  render() {
    return (
      <>
        <h1 className="h1__title">Stress Testing React Hooks</h1>
        <form>
          {this.renderBenchmarkFunction()}
          {this.renderErrors()}
          {this.renderParametersSelect()}
          {this.renderComponentSelect()}
          {!this.state.syntaxError && this.renderRunButton()}
        </form>
        {this.renderValidation()}
        {this.renderBenchmark()}
        {this.renderResults()}
      </>
    );
  }
}

export default App;
