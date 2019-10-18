module.exports = {
  name: 'busipay',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/busipay',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
