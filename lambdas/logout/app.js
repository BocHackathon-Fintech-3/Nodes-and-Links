const AWS = require('aws-sdk');

exports.handler = async event => {
  const ssm = new AWS.SSM();
  await ssm
    .putParameter({
      Name: 'boccredentials',
      Type: 'String',
      Overwrite: true,
      Value: 'a'
    })
    .promise();
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
