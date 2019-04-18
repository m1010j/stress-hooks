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
      <h2>HooksRefComponent</h2>
      <div>
        <p>Result: {result}</p>
        <p>Render #: {props.renderNumber}</p>
      </div>
    </>
  );
}

export default HooksRefComponent;
