# Stress Testing React Hooks

[Stress Testing React Hooks](https://www.matthiasjenny.com/stress-hooks/) is a benchmark tool for [React Hooks](https://reactjs.org/docs/hooks-intro.html).

## Overview

Users can benchmark the following six components with a benchmark function of their choice:

### `ClassComponent`

```jsx
class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    const { benchmark, args } = this.props;
    this.state = { result: benchmark(...args) };
  }

  render() {
    return (
      <>
        <h2>ClassComponent</h2>
        <div>
          <p>Result: {this.state.result}</p>
          <p>Render #: {this.props.renderNumber}</p>
        </div>
      </>
    );
  }
}
```

### `FunctionalComponent`

```jsx
function FunctionalComponent(props) {
  const { benchmark, args } = props;
  const result = benchmark(...args);

  return (
    <>
      <h2>FunctionalComponent</h2>
      <div>
        <p>Result: {result}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}
```

### `HooksComponent`

```jsx
function NaiveHooksComponent(props) {
  const { benchmark, args } = props;
  const [result] = useState(benchmark(...args));
  return (
    <>
      <h2>HooksComponent</h2>
      <div>
        <p>Result: {result}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}
```

### `MemoHooksComponent`

```jsx
function MemoHooksComponent(props) {
  const { benchmark, args } = props;
  const calculatedResult = useMemo(() => benchmark(...args), props.args);
  const [result] = useState(calculatedResult);
  return (
    <>
      <h2>MemoHooksComponent</h2>
      <div>
        <p>Result: {result}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}
```

### `FunctionHooksComponent`

```jsx
function FunctionHooksComponent(props) {
  const { benchmark, args } = props;
  const [result] = useState(() => benchmark(...args));
  return (
    <>
      <h2>FunctionHooksComponent</h2>
      <div>
        <p>Result: {result}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}
```

### `RefHooksComponent`

```jsx
function RefHooksComponent(props) {
  const { benchmark, args } = props;
  const ref = useRef(null);
  if (ref.current === null) {
    ref.current = benchmark(...args);
  }
  const [result] = useState(ref.current);
  return (
    <>
      <h2>RefHooksComponent</h2>
      <div>
        <p>Result: {result}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}
```

## [Contributing](./CONTRIBUTING.md)

## [License](./LICENSE)
