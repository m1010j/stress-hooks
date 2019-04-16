onmessage = function(e) {
  const { benchmarkString, serializedArgs } = e.data;

  // /* eslint-disable no-eval */
  // let benchmark;
  // eval(`benchmark = ${benchmarkString}`);
  // /* eslint-enable no-eval */
  // const args = JSON.parse(serializedArgs);

  // let result;
  // let errorMessage;
  // // try {
  // result = benchmark(args);
  // // } catch (error) {
  // //   errorMessage = error.message;
  // // }

  postMessage({ benchmarkString, serializedArgs });
};
