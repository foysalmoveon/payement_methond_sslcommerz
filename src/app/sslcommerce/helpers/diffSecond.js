const diffSeconds = (expires_in) => {
  const diff = Date.now() - expires_in;

  return diff / 1000;
};

module.exports = { diffSeconds };
