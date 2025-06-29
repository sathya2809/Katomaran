module.exports = {
  successResponse: (res, message, data, statusCode = 200) => {
    res.status(statusCode).json({ status: "success", message, data });
  },
  errorResponse: (res, message, error, statusCode = 400) => {
    res
      .status(statusCode)
      .json({
        status: "error",
        message,
        details: error.message,
        issue: error.detail,
        duplicate: error.duplicate,
        noArray: error.noArray,
        noCompleted: error.noCompleted,
      });
  },
};
