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
      fs.mkdirSync(proPath);
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
module.exports = {
  createDataFilePromise,
  getAllFilesByFloderPath
}