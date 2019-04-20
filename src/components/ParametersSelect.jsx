import React from 'react';
import retrieveArguments from 'retrieve-arguments';
import retrieveArrowArguments from '../utils/retrieveArrowArguments';

const space = '\u00A0';

function ParametersSelect(props) {
  const {
    args,
    benchmark,
    benchmarkString,
    handleChangeArgument,
    handleChangeTotalRenders,
    syntaxError,
    totalRenders,
  } = props;
  let benchmarkArguments = [];
  try {
    benchmarkArguments = retrieveArguments(benchmark);
  } catch {
    if (!syntaxError) {
      benchmarkArguments = retrieveArrowArguments(benchmarkString);
    }
  }
  const benchmarkArgumentInputs = benchmarkArguments.map((argument, idx) => {
    const benchmarkArgumentInputItemClassName = `benchmarkArgumentInputItem${
      benchmarkArguments.length > 1
        ? ' benchmarkArgumentInputItem--multipleArgs'
        : ''
    }${idx % 3 === 2 ? ' benchmarkArgumentInputItem--lastInRow' : ''}`;

    return (
      <div className={benchmarkArgumentInputItemClassName} key={idx}>
        <label htmlFor={`benchmarkArgument_${idx}`}>
          {argument}
          {space}={space}
        </label>
        <input
          id={`benchmarkArgument_${idx}`}
          name={argument}
          type="text"
          value={args[idx]}
          onChange={handleChangeArgument(idx)}
          disabled={syntaxError}
        />
      </div>
    );
  });

  const totalRendersContainerClassName = `totalRendersContainer${
    benchmarkArguments.length === 2 ? ' totalRendersContainer--twoArgs' : ''
  }`;
  const totalRendersContainer = (
    <div className={totalRendersContainerClassName}>
      <label htmlFor="totalRendersInput">
        Total number of renders:{space}
        {space}
      </label>
      <input
        id="totalRendersInput"
        name="total number of renders"
        type="number"
        value={totalRenders}
        onChange={handleChangeTotalRenders}
        disabled={syntaxError}
      />
    </div>
  );
  return (
    <React.Fragment>
      <p
        className={`p__parameters${
          syntaxError ? ' p__parameters--disabled' : ''
        }`}
      >
        2. Select parameters (or use the ones provided)
      </p>
      <div
        className={`parametersContainer${
          syntaxError ? ' parametersContainer--disabled' : ''
        }`}
      >
        {benchmarkArgumentInputs}
        {benchmarkArguments.length < 3 && totalRendersContainer}
      </div>
      {benchmarkArguments.length > 2 && totalRendersContainer}
    </React.Fragment>
  );
}

export default ParametersSelect;
