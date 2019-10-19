const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const findValueBlock = (keyBlock, valueMap) => {
  let valueBlock;

  keyBlock.Relationships.forEach(relationship => {
    if (relationship.Type === 'VALUE') {
      const valueId = relationship.Ids[0];
      valueBlock = valueMap[valueId];
    }
  });
  return valueBlock;
};

const getText = (results, blocksMap) => {
  let text = '';
  if (results.Relationships) {
    results.Relationships.forEach(relationship => {
      if (relationship.Type === 'CHILD') {
        relationship.Ids.forEach(childId => {
          const word = blocksMap[childId];
          if (word.BlockType === 'WORD') text += word.Text + ' ';
          if (word.BlockType === 'SELECTION_ELEMENT')
            if (word.SelectionStatus === 'SELECTED') text += 'X ';
        });
      }
    });
  }
  text = text.slice(0, -1);
  return text;
};

const getKvRelationship = (keyMap, blockMap) => {
  const kvs = {};
  Object.keys(keyMap).forEach(blockId => {
    const keyBlock = keyMap[blockId];
    const valueBlock = findValueBlock(keyBlock, blockMap);
    const key = getText(keyBlock, blockMap);
    const val = getText(valueBlock, blockMap);
    kvs[key] = val;
  });
  return kvs;
};

var textract = new AWS.Textract();

exports.handler = async event => {
  const { uploadTimestamp, S3Object } = JSON.parse(event.body);
  console.log(S3Object);
  const params = {
    Document: {
      /* required */
      S3Object: {
        Bucket: S3Object.Bucket,
        Name: S3Object.key
      }
    },
    FeatureTypes: [
      /* required */
      'FORMS'
    ]
  };
  let result = await textract.analyzeDocument(params).promise();
  const blocks = result.Blocks;
  const keyMap = {};
  const blockMap = {};

  blocks.forEach(block => {
    const blockId = block.Id;
    blockMap[blockId] = block;
    if (block.BlockType === 'KEY_VALUE_SET' && block.EntityTypes[0] === 'KEY')
      keyMap[blockId] = block;
  });

  const kvs = getKvRelationship(keyMap, blockMap);

  // console.log(JSON.stringify(kvs));
  console.log(JSON.stringify(result));
  const fileUploadPromise = await s3
    .upload({
      Key: S3Object.key.replace(/\.[^/.]+$/, '') + '.json',
      Bucket: S3Object.Bucket,
      Body: JSON.stringify(result),
      ACL: 'private'
    })
    .promise();

  const response = {
    body: JSON.stringify({ message: 'done!' }),
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: 200
  };
  return response;
};
