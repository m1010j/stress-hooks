import React, { useState, useRef } from 'react';

function RefHooksComponent(props) {
  const { benchmark, args } = props;
  const ref = useRef(null);
  if (ref.current === null) {
    ref.current = benchmark(...args);
  }
  const [result] = useState(ref.current);
  return (
    <>
      <h2>RefHooksComponent</h2>
      <div>
        <p>Result: {result}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}

export default RefHooksComponent;
