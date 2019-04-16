import React from 'react';
import Editor from 'react-simple-code-editor';
/* eslint-disable import/no-webpack-loader-syntax */
import Worker from 'worker-loader!./utils/worker.js';
/* eslint-enable import/no-webpack-loader-syntax */
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import retrieveArguments from 'retrieve-arguments';

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
import './App.css';

const componentMap = {
  class: ClassComponent,
  functional: FunctionalComponent,
  hooks: HooksComponent,
  hooksMemo: HooksMemoComponent,
  hooksFunction: HooksFunctionComponent,
  hooksRef: HooksRefComponent,
};

const componentDescriptionMap = {
  class: 'ClassComponent',
  functional: 'FunctionalComponent',
  hooks: 'HooksComponent',
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

const clearedTimes = { startTime: null, endTime: null };

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
      worker: new Worker(),
    };
  }

  catchRuntimeError = errorMessage => {
    this.setState({
      runtimeError: errorMessage,
      runBenchmark: false,
      ...clearedTimes,
    });
  };

  handleChangeBenchmark = value => {
    this.setState({ benchmarkString: value });
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
    this.setState({ args, ...clearedTimes });
  };

  handleChangeTotalRenders = e => {
    this.setState({ totalRenders: e.currentTarget.value, ...clearedTimes });
  };

  handleChangeComponent = component => {
    return () => {
      this.setState({ component, ...clearedTimes });
    };
  };

  handleChangeComponent = component => {
    return e => {
      if (
        specializedHooksComponentStrings.has(component) &&
        !e.currentTarget.checked
      ) {
        this.setState({ component: 'hooks', ...clearedTimes });
      } else {
        this.setState({ component, ...clearedTimes });
      }
    };
  };

  handleClickRunBenchmark = e => {
    e.preventDefault();
    const { args, worker, benchmarkString } = this.state;
    worker.postMessage({
      benchmarkString,
      serizliedArgs: JSON.stringify(args),
    });
    worker.onmessage = function(e) {
      console.log({ e });
    };
    // try {
    //   benchmark(...args);
    //   this.setState({
    //     runBenchmark: true,
    //     startTime: new Date(),
    //     runtimeError: null,
    //   });
    // } catch (error) {
    //   this.catchRuntimeError(error.message);
    // }
  };

  stopBenchmark = () => {
    this.setState({ runBenchmark: false, stopTime: new Date() });
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
        <label>
          Benchmark function:
          <br />
          <Editor
            value={benchmarkString}
            onValueChange={this.handleChangeBenchmark}
            highlight={code => highlight(code, languages.js)}
            padding={10}
            className="Editor"
            onBlur={this.handleUpdateBenchmark}
          />
        </label>
      </React.Fragment>
    );
  };

  renderErrors = () => {
    const { syntaxError, runtimeError } = this.state;
    return (
      <React.Fragment>
        {Boolean(syntaxError) && (
          <p className="p__Error">Syntax error: {syntaxError}</p>
        )}
        {Boolean(runtimeError) && (
          <p className="p__Error">Runtime error: {runtimeError}</p>
        )}
      </React.Fragment>
    );
  };

  renderArgumentInputs = () => {
    const { benchmark, benchmarkString, args, syntaxError } = this.state;
    let benchmarkArguments = [];
    try {
      benchmarkArguments = retrieveArguments(benchmark);
    } catch {
      if (!syntaxError) {
        benchmarkArguments = retrieveArrowArguments(benchmarkString);
      }
    }
    return benchmarkArguments.map((argument, idx) => (
      <label key={idx}>
        {argument} ={' '}
        <input
          name={argument}
          type="text"
          value={args[idx]}
          onChange={this.handleChangeArgument(idx)}
          disabled={syntaxError}
        />
        <br />
      </label>
    ));
  };

  renderOptions = () => {
    const { totalRenders, syntaxError } = this.state;
    return (
      <React.Fragment>
        <label>
          Total number of renders:{' '}
          <input
            name="total number of renders"
            type="number"
            value={totalRenders}
            onChange={this.handleChangeTotalRenders}
            disabled={syntaxError}
          />
        </label>
        <div className="radio">
          <label>
            <input
              type="radio"
              value="class"
              checked={this.isClassComponent()}
              onChange={this.handleChangeComponent('class')}
              disabled={syntaxError}
            />
            {componentDescriptionMap.class}
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              type="radio"
              value="functional"
              checked={this.isFunctionalComponent()}
              onChange={this.handleChangeComponent('functional')}
              disabled={syntaxError}
            />
            {componentDescriptionMap.functional}
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              type="radio"
              value="hooks"
              checked={this.isGenericHooksComponent()}
              onChange={this.handleChangeComponent('hooks')}
              disabled={syntaxError}
            />
            {componentDescriptionMap.hooks}
          </label>
        </div>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              value="hooksMemo"
              checked={this.isHooksMemoComponent()}
              onChange={this.handleChangeComponent('hooksMemo')}
              disabled={!this.isGenericHooksComponent() || syntaxError}
            />
            {componentDescriptionMap.hooksMemo}
          </label>
        </div>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              value="hooksFunction"
              checked={this.isHooksFunctionComponent()}
              onChange={this.handleChangeComponent('hooksFunction')}
              disabled={!this.isGenericHooksComponent() || syntaxError}
            />
            {componentDescriptionMap.hooksFunction}
          </label>
        </div>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              value="hooksRef"
              checked={this.isHooksRefComponent()}
              onChange={this.handleChangeComponent('hooksRef')}
              disabled={!this.isGenericHooksComponent() || syntaxError}
            />
            {componentDescriptionMap.hooksRef}
          </label>
        </div>
      </React.Fragment>
    );
  };

  renderGoButton = () => {
    const { syntaxError, component } = this.state;
    return (
      <button
        onClick={this.handleClickRunBenchmark}
        disabled={syntaxError || !component}
      >
        Go!
      </button>
    );
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

    const componentDescription = componentDescriptionMap[component];
    return (
      !runBenchmark &&
      Boolean(startTime) &&
      Boolean(stopTime) && (
        <p>
          Calculating the function {totalRenders} times took the{' '}
          {componentDescription} {stopTime.getTime() - startTime.getTime()}{' '}
          milliseconds.
        </p>
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
        <h1>Stress Testing React Hooks</h1>
        <form>
          {this.renderBenchmarkFunction()}
          {this.renderErrors()}
          {this.renderArgumentInputs()}
          {this.renderOptions()}
          {this.renderGoButton()}
        </form>
        {this.renderBenchmark()}
        {this.renderResults()}
        {this.renderBenchmarkCode()}
      </>
    );
  }
}

export default App;
