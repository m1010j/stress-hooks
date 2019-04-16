export const classComponentCode = `class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    const { benchmark, values } = this.props;
    this.state = { result: benchmark(...values) };
  }

  render() {
    return (
      <>
        <h2>Class Component</h2>
        <table>
          <tbody>
            <tr>
              <td>Result</td>
              <td>{this.state.result}</td>
            </tr>
            <tr>
              <td>Render #</td>
              <td>{this.props.renderNumber}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }
}`;

export const functionalComponentCode = `function FunctionalComponent(props) {
  const { benchmark, values } = props;
  const result = benchmark(...values);

  return (
    <>
      <h2>Functional component without Hooks</h2>
      <table>
        <tbody>
          <tr>
            <td>Result</td>
            <td>{result}</td>
          </tr>
          <tr>
            <td>Render #</td>
            <td>{props.renderNumber}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}`;

export const hooksComponentCode = `function HooksComponent(props) {
  const { benchmark, values } = props;
  const [result] = useState(benchmark(...values));
  return (
    <>
      <h2>Functional component with Hooks</h2>
      <table>
        <tbody>
          <tr>
            <td>Result</td>
            <td>{result}</td>
          </tr>
          <tr>
            <td>Render #</td>
            <td>{props.renderNumber}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}`;

export const hooksMemoComponentCode = `function HooksMemoComponent(props) {
  const { benchmark, values } = props;
  const calculatedResult = useMemo(() => benchmark(...values), props.values);
  const [result] = useState(calculatedResult);
  return (
    <>
      <h2>Functional component with Hooks</h2>
      <table>
        <tbody>
          <tr>
            <td>Result</td>
            <td>{result}</td>
          </tr>
          <tr>
            <td>Render #</td>
            <td>{props.renderNumber}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}`;

export const hooksFunctionComponentCode = `function HooksFunctionComponent(props) {
  const { benchmark, values } = props;
  const [result] = useState(() => benchmark(...values));
  return (
    <>
      <h2>Functional component with Hooks</h2>
      <table>
        <tbody>
          <tr>
            <td>Result</td>
            <td>{result}</td>
          </tr>
          <tr>
            <td>Render #</td>
            <td>{props.renderNumber}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}`;

export const hooksRefComponentCode = `function HooksRefComponent(props) {
  const { benchmark, values } = props;
  const ref = useRef(null);
  function getCalculatedResult() {
    let { current } = ref;
    if (current === null) {
      current = benchmark(...values);
    }
    return current;
  }
  const [result] = useState(getCalculatedResult());
  return (
    <>
      <h2>Functional component with Hooks</h2>
      <table>
        <tbody>
          <tr>
            <td>Result</td>
            <td>{result}</td>
          </tr>
          <tr>
            <td>Render #</td>
            <td>{props.renderNumber}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}`;
