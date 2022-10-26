const fs = require('fs')
const path = require('path')
/**
 * 创建文件
 * @param {String} fileName  文件名
 * @param {String} dataStr 文件内容
 * @param {String} basePath  文件路径 
 */

function createDataFilePromise(fileName, dataStr, basePath = '.') {
  return new Promise((resolve) => {
    const proPath = path.join('./', basePath);
    const filePath = path.join('./', basePath, fileName);
    const proPathExits = fs.existsSync(proPath);
    if (!proPathExits) {
      fs.mkdirSync(proPath, { recursive: true });
    }

    // 此时路径都已经存在
    fs.writeFileSync(filePath, dataStr, {
      encoding: 'utf-8',
    });
    console.log(`${fileName}创建完成`);
    resolve(filePath)
  })
}

/**
 * 遍历文件夹，得到该文件夹下的所有文件
 * @param {String} floderPath  文件夹路径
 * @returns { Array } 返回文件地址构成的数组
 */
function getAllFilesByFloderPath(floderPath) {
  function traversalFile(baseDir, allFilesPath) {
    try {
      const files = fs.readdirSync(baseDir)

      for (const file of files) {
        const fileDir = path.join(baseDir, file)
        let state = fs.statSync(fileDir)
        if (state.isDirectory()) {
          let subPath = traversalFile(fileDir, [])
          allFilesPath = allFilesPath.concat(subPath)
        } else if (state.isFile()) {
          allFilesPath.push(fileDir)
        }
      }
      return allFilesPath
    } catch (error) {
      console.error(error)
    }
  }
  return traversalFile(floderPath, [])
}


/**
 * 顺序执行，需要异步操作的数组元素
 * @param {Number} index 数组元素索引
 * @param {Array} list 数组
 * @param {Function} callback 回调函数，参数为每个数组元素。
 * @param {Function} finallyFn 全部数据处理完成后，调用的回调函数
 */
 async function getNextItem(index, list, callback, finallyFn) {
  if (index < list.length) {
    let item = list[index]
    console.log('正处理数据索引:', index)
    await callback(item, index)
    index++
    await getNextItem(index, list, callback, finallyFn)
  } else {
    // 全部处理完成，执行结束函数
    if (typeof finallyFn === 'function') {
      finallyFn()
    }

  }
}

module.exports = {
  getNextItem,
  createDataFilePromise,
  getAllFilesByFloderPath
}