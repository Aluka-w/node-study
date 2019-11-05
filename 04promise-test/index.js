const fs = require('fs');
const path = require('path');

// callBack函数的方式
// const getFileContent = (filePath, callBack) => {
//   const fullFilePath = path.resolve(__dirname, 'file', filePath);
//   fs.readFile(fullFilePath, (err, data) => {
//     if (err) {
//       throw err;
//     }
//     callBack(JSON.parse(data));
//   })
// }

// getFileContent('a.json', aData => {
//   console.log('aData', aData);
//   getFileContent(aData.next, bData => {
//     console.log('bData', bData);
//     getFileContent(bData.next, cData => {
//       console.log('cData', cData);
//     })
//   })
// })

const getFileContent = (filePath) => {
  return new Promise((resolve, reject) => {
    const fullFilePath = path.resolve(__dirname, 'file', filePath);
    fs.readFile(fullFilePath, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    })
  })
}
getFileContent('a.json').then(aData => {
  console.log('aData', aData);
  return getFileContent(aData.next);
}).then(bData => {
  console.log('bData', bData);
  return getFileContent(bData.next);
}).then(cData => {
  console.log('cData', cData)
})