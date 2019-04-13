import React from 'react';
import nthFib from '../utils/nthFib';

function FibFunctional(props) {
  const result = nthFib(props.n);

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
