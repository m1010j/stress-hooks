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
function HooksComponent(props) {
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

### `HooksMemoComponent`

```jsx
function HooksMemoComponent(props) {
  const { benchmark, args } = props;
  const calculatedResult = useMemo(() => benchmark(...args), props.args);
  const [result] = useState(calculatedResult);
  return (
    <>
      <h2>HooksMemoComponent</h2>
      <div>
        <p>Result: {result}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}
```

### `HooksFunctionComponent`

```jsx
function HooksFunctionComponent(props) {
  const { benchmark, args } = props;
  const [result] = useState(() => benchmark(...args));
  return (
    <>
      <h2>HooksFunctionComponent</h2>
      <div>
        <p>Result: {result}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}
```

### `HooksRefComponent`

```jsx
function HooksRefComponent(props) {
  const { benchmark, args } = props;
  const ref = useRef(null);
  if (ref.current === null) {
    ref.current = benchmark(...args);
  }
  const [result] = useState(ref.current);
  return (
    <>
      <h2>HooksRefComponent</h2>
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
