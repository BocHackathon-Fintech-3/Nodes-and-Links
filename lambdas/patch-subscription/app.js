const boc = require('boc');
const AWS = require('aws-sdk');

exports.handler = async event => {
  const ssm = new AWS.SSM();
  const param = await ssm.getParameter({ Name: 'boccredentials' }).promise();
  console.log(JSON.stringify(param));
  const { subId, accessToken } = JSON.parse(param.Parameter.Value);

  boc.access_token = accessToken;
  boc.sub_id = subId;

  const code = event.queryStringParameters.code;
  const newCode = await boc.getOAuthCode2(code);
  const { selectedAccounts } = (await boc.getSubIdInfo(boc.sub_id))[0];
  console.log(JSON.stringify(selectedAccounts));
  const resp = await boc.updateSubId(boc.sub_id, newCode, selectedAccounts);
  console.log(JSON.stringify(resp));

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
