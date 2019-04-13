export const fibClassCode = `
import React from 'react';

class FibClass extends React.Component {
  constructor(props) {
    super(props);
    const { benchmark, values } = props;
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
}
`;

export const fibFunctionalCode = `
import React from 'react';

function FibFunctional(props) {
  const { benchmark, values } = this.props;
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
}
`;

export const fibHooksCode = `
import React, { useState, useMemo } from 'react';

function FibHooks(props) {
  const { benchmark, values } = props;
  const calculatedResult = props.withMemo
    ? useMemo(() => benchmark(...values), props.n)
    : benchmark(...values);
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
}
`;
