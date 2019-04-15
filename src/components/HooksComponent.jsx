import React, { useState, useMemo } from 'react';

function HooksComponent(props) {
  const { benchmark, values, catchRuntimeError } = props;
  let calculatedResult;
  try {
    console.log(props.withMemo);
    calculatedResult = props.withMemo
      ? useMemo(() => benchmark(...values), props.values)
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

export default HooksComponent;
