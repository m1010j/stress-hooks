export const classComponentCode = `class ClassComponent extends React.Component {
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
}`;

export const functionalComponentCode = `function FunctionalComponent(props) {
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
}`;

export const naiveHooksComponentCode = `function NaiveHooksComponent(props) {
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
}`;

export const memoHooksComponentCode = `function MemoHooksComponent(props) {
  const { benchmark, args } = props;
  const result = useMemo(() => benchmark(...args), args);
  return (
    <>
      <h2>MemoHooksComponent</h2>
      <div>
        <p>Result: {result}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}`;

export const functionHooksComponentCode = `function FunctionHooksComponent(props) {
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
}`;

export const refHooksComponentCode = `function RefHooksComponent(props) {
  const { benchmark, args } = props;
  const ref = useRef(null);
  if (ref.current === null) {
    ref.current = benchmark(...args);
  }
  return (
    <>
      <h2>RefHooksComponent</h2>
      <div>
        <p>Result: {ref.current}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}`;
