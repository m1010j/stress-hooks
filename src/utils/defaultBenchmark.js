const defaultBenchmark = `function nthFibonacci(n) {
  n = Number(n)
  if (n <= 0) return 0;
  if (n === 1) return 1;

  return nthFibonacci(n - 1) + nthFibonacci(n - 2);
}`;

export default defaultBenchmark;
