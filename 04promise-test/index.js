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

// promise函数
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
// getFileContent('a.json').then(aData => {
//   console.log('aData', aData);
//   return getFileContent(aData.next);
// }).then(bData => {
//   console.log('bData', bData);
//   return getFileContent(bData.next);
// }).then(cData => {
//   console.log('cData', cData)
// })

// async/await 实现, promise的语法糖
// async定义下的函数, 才能使用await
// async function readFileData() {
//   // 同步写法
//   // await 可以直接接受promise的resolve返回的值
//   const aData = await getFileContent('a.json');
//   console.log('aData', aData);
//   const bData = await getFileContent(aData.next);
//   console.log('bData', bData);
//   const cData = await getFileContent(bData.next);
//   console.log('cData', cData);
// }

// readFileData();

// await 返回的也是promise对象
async const readFileData = () => {
  const aData = await getFileContent('a.json');
  return aData;
}
async const test = () => {
  const aData = await readFileData();
  console.log(aData);
}
test();
