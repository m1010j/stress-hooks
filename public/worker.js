self.addEventListener('message', function(e) {
  var data = e.data;
  var args = JSON.parse(data.argsSerialized);
  var benchmark;
  eval(`benchmark = ${data.benchmarkString}`);
  try {
    benchmark.apply(null, args);
  } catch (error) {
    var runtimeError = error.message;
  }
  self.postMessage({ runtimeError: runtimeError || null });
});
