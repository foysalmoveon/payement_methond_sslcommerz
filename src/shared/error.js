const formatError = async (error) => {
  try {
    return {
      error: {
        code: error.response?.status || 500,
        message: error.response?.data || "Unknown error occurred.",
      },
    };
  } catch (error) {
    return error;
  }
};

module.exports = { formatError };
