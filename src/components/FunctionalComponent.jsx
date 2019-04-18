import React from 'react';

function FunctionalComponent(props) {
  const { benchmark, args } = props;
  const result = benchmark(...args);

  return (
    <>
      <h2>FunctionalComponent</h2>
      <div>
        <p>Result: {result}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}

export default FunctionalComponent;
