const formNumber = (number) => {
  if (number < 1000) {
    return number;
  }
  if (number < 1000000) {
    return (number / 1000).toFixed(1) + "K";
  }
  if (number < 1000000000) {
    return (number / 1000000).toFixed(1) + "M";
  }
  return (number / 1000000000).toFixed(1) + "B";
};

export default formNumber;