const boc = require('boc');
const AWS = require('aws-sdk');

exports.handler = async event => {
  const ssm = new AWS.SSM();
  const param = await ssm.getParameter({ Name: 'boccredentials' }).promise();
  console.log(JSON.stringify(param));
  const { subId, accessToken } = JSON.parse(param.Parameter.Value);

  return {
    body: JSON.stringify({ subId }),
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: 200
  };
};
