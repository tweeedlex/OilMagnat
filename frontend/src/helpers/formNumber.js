const formNumber = (number, toFloat = true) => {
  if (number < 1000) {
    return number;
  }
  if (number < 1000000) {
    return (number / 1000).toFixed(toFloat ? 1 : 0) + "K";
  }
  if (number < 1000000000) {
    return (number / 1000000).toFixed(toFloat ? 1 : 0) + "M";
  }
  return (number / 1000000000).toFixed(toFloat ? 1 : 0) + "B";
};

export default formNumber;