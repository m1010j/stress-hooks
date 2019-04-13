import React from 'react';

function FibFunctional(props) {
  const { benchmark, values, catchRuntimeError } = props;
  let result;
  try {
    result = benchmark(...values);
  } catch (error) {
    catchRuntimeError(error.message);
  }

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

export default FibFunctional;
