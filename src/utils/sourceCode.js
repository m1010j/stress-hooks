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

export const hooksComponentCode = `function HooksComponent(props) {
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

export const hooksMemoComponentCode = `function HooksMemoComponent(props) {
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
}`;

export const hooksFunctionComponentCode = `function HooksFunctionComponent(props) {
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
}`;

export const hooksRefComponentCode = `function HooksRefComponent(props) {
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
}`;
