import React, { useState, useMemo } from 'react';

function MemoHooksComponent(props) {
  const { benchmark, args } = props;
  const calculatedResult = useMemo(() => benchmark(...args), props.args);
  const [result] = useState(calculatedResult);
  return (
    <>
      <h2>MemoHooksComponent</h2>
      <div>
        <p>Result: {result}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}

export default MemoHooksComponent;
