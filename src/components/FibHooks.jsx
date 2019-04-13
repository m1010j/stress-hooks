import React, { useState, useMemo } from 'react';

function FibHooks(props) {
  const { benchmark, values, catchRuntimeError } = props;
  let calculatedResult;
  try {
    calculatedResult = props.withMemo
      ? useMemo(() => benchmark(...values), props.n)
      : benchmark(...values);
  } catch (error) {
    catchRuntimeError(error.message);
  }
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
