import React, { useState } from 'react';

function NaiveHooksComponent(props) {
  const { benchmark, args } = props;
  const [result] = useState(benchmark(...args));
  return (
    <>
      <h2>HooksComponent</h2>
      <div>
        <p>Result: {result}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}

export default NaiveHooksComponent;
