import React from 'react';

function FunctionalComponent(props) {
  const { benchmark, args } = props;
  const result = benchmark(...args);

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

export default FunctionalComponent;
