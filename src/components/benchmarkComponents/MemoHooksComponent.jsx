import React, { useMemo } from 'react';

function MemoHooksComponent(props) {
  const { benchmark, args } = props;
  const result = useMemo(() => benchmark(...args), args);
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
