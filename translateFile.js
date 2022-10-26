const utils = require('./lib/utils')
const path = require('path')
const fs = require('fs')
// 输出文件路径
const outputPath = './translateResult'
const inputPath = './data'
//translate api key

const location = 'global';
const { Translate } = require('@google-cloud/translate').v2;
let projectId = 'logical-hallway-352208'
// Instantiates a client
const translate = new Translate({ projectId });

async function translateWord(content) {
  const target = 'zh-cn';
  const [translation] = await translate.translate(content, target);
  return translation
}



function getFileInfo(filePath) {
  let fileName = path.basename(filePath)
  let dirName = path.dirname(filePath)
  let fileOutDir = path.join(outputPath, path.basename(dirName))
  // 文件路径、文件名、文件夹路径、输出文件夹路径
  return {
    filePath,
    fileName,
    dirName,
    fileOutDir
  }
}

// const fileList = await utils.getAllFilesByFloderPath(inputPath)
// const fileObjList = fileList.map(filePath => {
//   let fileName = path.basename(filePath)
//   let dirName = path.dirname(filePath)
//   let fileOutPath = path.join(outputPath, path.basename(dirName))
//   return {
//     filePath,
//     fileName,
//     dirName,
//     fileOutPath
//   }
// })

async function translateOneFile(filePath) {
  console.log('开始翻译')
  const content = fs.readFileSync(filePath)
  const translatedContent = await translateWord(content)
  console.log('translatedContent:',translatedContent)
  
  let fileInfo = getFileInfo(filePath)
  await utils.createDataFilePromise(fileInfo.fileName, translatedContent, fileInfo.fileOutDir)
  // console.log('fileObjList:', fileObjList.slice(0, 2))
  // console.log('content:', content.toString())
}

translateOneFile('./data/Albania/authority')

// walkSyncFolder('./data');






