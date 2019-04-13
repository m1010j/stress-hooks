import React, { useState, useMemo } from 'react';
import nthFib from '../utils/nthFib';

function FibHooks(props) {
  const calculatedResult = props.withMemo
    ? useMemo(() => nthFib(props.n), props.n)
    : nthFib(props.n);
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
