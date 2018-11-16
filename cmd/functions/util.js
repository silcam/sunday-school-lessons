function zeroPad(numStr, numberOfDigits) {
  if (numStr.length >= numberOfDigits) return numStr;
  const zeros = new Array(numberOfDigits - numStr.length).fill("0");
  return zeros + numStr;
}

module.exports = {
  zeroPad: zeroPad
};
