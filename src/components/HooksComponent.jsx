import React, { useState } from 'react';

function HooksComponent(props) {
  const { benchmark, args } = props;
  const [result] = useState(benchmark(...args));
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
