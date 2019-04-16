import React, { useState, useMemo } from 'react';

function HooksMemoComponent(props) {
  const { benchmark, args } = props;
  const calculatedResult = useMemo(() => benchmark(...args), props.args);
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

export default HooksMemoComponent;
