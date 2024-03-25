const responseMessage = (status, statusCode, msg, data = null) => {
  const res = { status,statusCode };
  if (status) {
      res.msg = msg;
      if (!(data == null)) {
          res.data = data;
      }
  }
  else {
      res.error = msg;
  }
  return res
}
module.exports = responseMessage;