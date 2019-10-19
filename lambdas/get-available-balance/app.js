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
  const balance = (await boc.getAvailBalanceForAccount(
    accountId
  ))[0].balances.find(b => b.balanceType === 'AVAILABLE').amount;
  return {
    body: JSON.stringify({ balance }),
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: 200
  };
};
