import React from 'react';
import Editor from 'react-simple-code-editor';
import debounce from 'lodash/debounce';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import Modal from './components/Modal';
import Benchmark from './components/Benchmark';
import ComponentSelect from './components/ComponentSelect';
import ParametersSelect from './components/ParametersSelect';
import {
  componentMap,
  componentFullDescriptionMap,
} from './utils/componentMaps';
import { specializedHooksComponentStrings } from './utils/stringSets';
import defaultBenchmark from './utils/defaultBenchmark';
import numberWithCommas from './utils/numberWithCommas';
import './App.css';

const clearedTimesState = { startTime: null, endTime: null };

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
      args: [32],
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
    this.setState({ benchmarkString: value }, this.handleUpdateBenchmark);
  };

  handleUpdateBenchmark = () => {
    try {
      let benchmark;
      /* eslint-disable no-eval */
      eval(`benchmark = ${this.state.benchmarkString}`);
      /* eslint-enable no-eval */
      this.setState({ benchmark, syntaxError: null, runtimeError: null });
    } catch (error) {
      this.setState({
        syntaxError: error.message,
        benchmark: null,
        runtimeError: null,
      });
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
        this.setState({ component: 'naiveHooks', ...clearedTimesState });
      } else {
        this.setState({ component, ...clearedTimesState });
      }
    };
  };

  handleRunBenchmark = e => {
    e.preventDefault();
    this.setState({ runValidation: true });
  };

  runBenchmarkAfterValidation = () => {
    this.setState({
      runBenchmark: true,
      runValidation: false,
      runtimeError: null,
      startTime: new Date(),
    });
  };

  stopBenchmark = () => {
    const stopTime = new Date();
    setTimeout(() => {
      this.setState({ runBenchmark: false, stopTime });
    }, 1000);
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

  renderSyntaxError = () => {
    const { syntaxError } = this.state;
    return (
      Boolean(syntaxError) && (
        <p className="p--Error">Syntax error: {syntaxError}</p>
      )
    );
  };

  renderRuntimeError = () => {
    const { runtimeError } = this.state;
    return (
      Boolean(runtimeError) && (
        <p className="p--Error">Runtime error: {runtimeError}</p>
      )
    );
  };

  renderTotalRendersError = () => {
    const { totalRenders } = this.state;
    if (!totalRenders || totalRenders < 1) {
      return (
        <p className="p--Error">Total number of renders must be at least 0.</p>
      );
    }
    return null;
  };

  renderRunButton = () => {
    const { component, totalRenders, syntaxError } = this.state;
    if (!component) return null;
    const runButtonClassName = `runButton${
      !totalRenders || totalRenders < 1 || syntaxError
        ? ' runButton--disabled'
        : ''
    }`;
    return (
      <button onClick={this.handleRunBenchmark} className={runButtonClassName}>
        4. Run benchmark
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
              this.runBenchmarkAfterValidation();
            }
          }, 500);
        };
      } else {
        try {
          benchmark(...args);
          this.runBenchmarkAfterValitation();
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
      runValidation,
    } = this.state;

    const componentDescription = componentFullDescriptionMap[component];
    return (
      !runValidation &&
      !runBenchmark &&
      Boolean(startTime) &&
      Boolean(stopTime) && (
        <Modal handleCloseModal={this.handleCloseModal}>
          <h2>Result</h2>
          <p>
            It took the {componentDescription}{' '}
            {numberWithCommas(stopTime.getTime() - startTime.getTime())}{' '}
            milliseconds to render {totalRenders} times.
          </p>
          <div className="modal__buttonContainer">
            <button onClick={this.runBenchmarkAfterValidation}>
              Run again
            </button>
            <button onClick={this.handleCloseModal}>Close</button>
          </div>
        </Modal>
      )
    );
  };

  render() {
    const {
      args,
      benchmark,
      benchmarkString,
      component,
      syntaxError,
      totalRenders,
    } = this.state;

    return (
      <>
        <h1 className="h1__title">Stress Testing React Hooks</h1>
        <div className="div__subtitle">
          <span className="authorLink">
            by <a href="https://www.matthiasjenny.com/#home">Matthias Jenny</a>
          </span>
          <a href="https://github.com/m1010j/stress-hooks">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a
            className="mediumLink"
            href="https://medium.com/@_m1010j_/how-to-avoid-this-react-hooks-performance-pitfall-28770ad9abe0"
          >
            Discussion
          </a>
        </div>
        <form>
          {this.renderBenchmarkFunction()}
          {this.renderSyntaxError()}
          <ParametersSelect
            args={args}
            benchmark={benchmark}
            benchmarkString={benchmarkString}
            handleChangeArgument={this.handleChangeArgument}
            handleChangeTotalRenders={this.handleChangeTotalRenders}
            syntaxError={syntaxError}
            totalRenders={totalRenders}
          />
          {this.renderRuntimeError()}
          {this.renderTotalRendersError()}
          <ComponentSelect
            syntaxError={syntaxError}
            component={component}
            handleChangeComponent={this.handleChangeComponent}
          />
          {this.renderRunButton()}
        </form>
        {this.renderValidation()}
        {this.renderBenchmark()}
        {this.renderResults()}
      </>
    );
  }
}

export default App;
