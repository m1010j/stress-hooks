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

export default FibHooks;
