import React from 'react';
import Benchmark from './components/Benchmark';
import FibClass from './components/FibClass';
import FibFunctional from './components/FibFunctional';
import FibHooks from './components/FibHooks';
import {
  fibClassCode,
  fibFunctionalCode,
  fibHooksCode,
} from './utils/sourceCode';
import './App.css';

const componentMap = {
  class: FibClass,
  functional: FibFunctional,
  hooks: FibHooks,
};

const componentDescriptionMap = {
  class: 'class component',
  functional: 'functional component without hooks',
  hooks: 'functional component with hooks',
};

const componentCodeMap = {
  class: fibClassCode,
  functional: fibFunctionalCode,
  hooks: fibHooksCode,
};

const clearedTimes = { startTime: null, endTime: null };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null,
      runBenchmark: false,
      withMemo: false,
      n: 35,
      startTime: null,
      stopTime: null,
      totalRenders: 10,
    };
  }

  handleChangeN = e => {
    this.setState({ n: e.currentTarget.value, ...clearedTimes });
  };

  handleChangeTotalRenders = e => {
    this.setState({ totalRenders: e.currentTarget.value, ...clearedTimes });
  };

  handleChangeComponent = component => {
    return () => {
      this.setState({ component, ...clearedTimes });
    };
  };

  handleChangeWithMemo = () => {
    this.setState(state => ({ withMemo: !state.withMemo, ...clearedTimes }));
  };

  handleClickRunBenchmark = e => {
    e.preventDefault();
    this.setState({ runBenchmark: true, startTime: new Date() });
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

  render() {
    const {
      component,
      runBenchmark,
      withMemo,
      n,
      startTime,
      stopTime,
      totalRenders,
    } = this.state;

    const componentDescription = this.isHooksComponent()
      ? `${componentDescriptionMap[component]} ${
          withMemo ? '' : 'without '
        }using useMemo`
      : componentDescriptionMap[component];

    const propsString = `
props: {
n: ${n || 'undefined'},
withMemo: ${withMemo},
}
`;

    return (
      <>
        <h1>Stress Testing Hooks</h1>
        <form>
          <label>
            n:
            <input
              name="n"
              type="number"
              value={n}
              onChange={this.handleChangeN}
            />
          </label>
          <label>
            Total number of renders:
            <input
              name="total number of renders"
              type="number"
              value={totalRenders}
              onChange={this.handleChangeTotalRenders}
            />
          </label>
          <div className="radio">
            <label>
              <input
                type="radio"
                value="class"
                checked={this.isClassComponent()}
                onChange={this.handleChangeComponent('class')}
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
              />
              {componentDescriptionMap.functional}
            </label>
          </div>
          <div className="radio">
            <label>
              <input
                type="radio"
                value="hooks"
                checked={this.isHooksComponent()}
                onChange={this.handleChangeComponent('hooks')}
              />
              {componentDescriptionMap.hooks}
            </label>
          </div>
          <label>
            Use useMemo:
            <input
              name="withMemo"
              type="checkbox"
              checked={withMemo}
              onChange={this.handleChangeWithMemo}
              disabled={!this.isHooksComponent()}
            />
          </label>
          <button onClick={this.handleClickRunBenchmark} disabled={!component}>
            Go!
          </button>
        </form>
        {runBenchmark && (
          <Benchmark
            component={componentMap[component]}
            n={n}
            totalRenders={totalRenders}
            withMemo={withMemo}
            stopBenchmark={this.stopBenchmark}
          />
        )}
        {!runBenchmark && Boolean(startTime) && Boolean(stopTime) && (
          <p>
            Displaying the {n}th Fibonacci number {totalRenders} many times took
            the {componentDescription}{' '}
            {stopTime.getTime() - startTime.getTime()} milliseconds.
          </p>
        )}
        {Boolean(component) && (
          <>
            <xmp>{componentCodeMap[component]}</xmp>
            <xmp>{propsString}</xmp>
          </>
        )}
      </>
    );
  }
}

export default App;
