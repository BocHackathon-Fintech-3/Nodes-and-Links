const boc = require('boc');
const AWS = require('aws-sdk');

exports.handler = async event => {
  const ssm = new AWS.SSM();
  const param = await ssm.getParameter({ Name: 'boccredentials' }).promise();
  const { subId, accessToken } = JSON.parse(param.Parameter.Value);

  boc.access_token = accessToken;
  boc.sub_id = subId;
  const accountId = await new Promise((res, rej) => {
    boc.getAccounts((err, data) => {
      if (err) rej(err);
      else {
        res(data[0].accountId);
      }
    });
  });
  const promisable = (fn, ...args) => {
    return new Promise((res, rej) => {
      args.push((err, data) => {
        if (err) {
          rej(err);
        } else {
          res(data);
        }
      });
      fn(...args);
    });
  };
  const payments = JSON.parse(event.body);
  for (var i = 0; i < payments.length; i++) {
    const payment = payments[i];

    const payload = await promisable(
      boc.signPaymentRequest,
      accountId,
      payment.iban,
      payment.amount,
      'from lambda'
    );
    const paymentContainer = await promisable(boc.createPayment, payload);
    const paymentResponse = await promisable(
      boc.approvePayment,
      paymentContainer.payment.paymentId
    );
  }
  return {
    body: JSON.stringify({ message: 'done!' }),
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: 200
  };
};
