// Adapted from https://stackoverflow.com/a/2901298

function numberWithCommas(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default numberWithCommas;
