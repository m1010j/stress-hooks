import React, { useState, useRef } from 'react';

function HooksRefComponent(props) {
  const { benchmark, args } = props;
  const ref = useRef(null);
  if (ref.current === null) {
    ref.current = benchmark(...args);
  }
  const [result] = useState(ref.current);
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

export default HooksRefComponent;
