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
  let fileOutDir = path.join(outputPath, dirName)
  // 文件路径、文件名、文件夹路径、输出文件夹路径
  return {
    filePath,
    fileName,
    dirName,
    fileOutDir
  }
}



async function translateOneFile(filePath) {
  // console.log('开始翻译')
  let content = fs.readFileSync(filePath)
  content = content.toString()
  const translatedContent = await translateWord(content)
  // console.log('translatedContent:',translatedContent)
  
  let fileInfo = getFileInfo(filePath)
  let fileDirName_zn = await translateWord(fileInfo.dirName)
  // 文件夹名称  英文-中文
  let fileDir = fileInfo.dirName+'-'+fileDirName_zn
  let fileOutDir = path.join(outputPath, fileDir)
  // 文件统一改成txt文件
  await utils.createDataFilePromise(fileInfo.fileName+'.html', translatedContent, fileOutDir)
}

function translateFinally(){
  console.log('全部文件翻译完毕')
}

async function translateAllFile(dirName){
  // 获取所有文件路径
  let fileList = await utils.getAllFilesByFloderPath(dirName)
  fileList = fileList.slice(0,2)

  utils.getNextItem(0,fileList,async function(filePath,index){
    console.log('正在翻译第'+index+'文件')
    await translateOneFile(filePath)
  },translateFinally)
}

async function delteOneFileChar(filePath,beDelChar) {
  // console.log('开始翻译')
  let content = fs.readFileSync(filePath)
  content = content.toString().replaceAll(beDelChar,'')
  let fileInfo = getFileInfo(filePath)
  
  await utils.createDataFilePromise(fileInfo.fileName, content, fileInfo.fileOutDir)
}

// 批量删除文件里的字符
async function deleteAllFilesChar(dirName,beDelChar){
  const fileList = await utils.getAllFilesByFloderPath(dirName)
  utils.getNextItem(0,fileList,async function(filePath,index){
    console.log('正在处理第'+index+'文件')
    await delteOneFileChar(filePath,beDelChar)
  },translateFinally)
}
// deleteAllFilesChar('./translateResult','undefined')

// translateOneFile('./data/Albania/authority')
// 翻译data文件夹下的所有文件
translateAllFile(inputPath)








