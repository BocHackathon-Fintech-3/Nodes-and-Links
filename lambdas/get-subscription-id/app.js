const boc = require('boc');
const AWS = require('aws-sdk');

exports.handler = async event => {
  const ssm = new AWS.SSM();
  await boc.init();
  const subId = await boc.checkAndCreateSubId();
  const accessToken = boc.access_token;
  const loginUrl = boc.get_login_url();
  await ssm
    .putParameter({
      Name: 'boccredentials',
      Type: 'String',
      Overwrite: true,
      Value: JSON.stringify({ subId, accessToken })
    })
    .promise();
  return {
    body: JSON.stringify({ loginUrl }),
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: 200
  };
};
