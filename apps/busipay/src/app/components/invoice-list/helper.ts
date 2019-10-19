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
    kvs[key] = { val, block: valueBlock };
  });
  return kvs;
};

export const computePairs = result => {
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
  return kvs;
};
