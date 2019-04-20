import React, { useRef } from 'react';

function RefHooksComponent(props) {
  const { benchmark, args } = props;
  const ref = useRef(null);
  if (ref.current === null) {
    ref.current = benchmark(...args);
  }
  return (
    <>
      <h2>RefHooksComponent</h2>
      <div>
        <p>Result: {ref.current}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}

export default RefHooksComponent;
