const utils = require('./lib/utils')
const path = require('path')
const fs = require('fs')
// 输出文件路径
const outputPath = './translateResult'
const inputPath = './data'
//translate api key

const googleKeyPath = 'google-api-key.json';
const projectId = 'logical-hallway-352208';
const location = 'global';
const database_path = 'firestore.json';



const { TranslationServiceClient } = require('@google-cloud/translate');

const translationClient = new TranslationServiceClient({ keyFilename: googleKeyPath });



const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: projectId,
  keyFilename: database_path,
});








function redDetailFile(filepath) {

  var temparr = filepath.split('/');
  var folderName = temparr[temparr.length - 2];
  //console.log(folderName)
  var filename = temparr[temparr.length - 1];
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    translateText(folderName, data, filename)
  })
}



//const filePath =  '';

function walkSync(currentDirPath, callback) {
  var fs = require('fs'),
    path = require('path');
  fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function (dirent) {
    var filePath = path.join(currentDirPath, dirent.name);
    if (dirent.isFile()) {
      callback(filePath, dirent);
    } else if (dirent.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

var index = 0;


//save data to database

async function createDoc(folderName, translate_name) {
  var countryRef = db.collection('country');  //collect
  await countryRef.doc(folderName).set({ name: String(translate_name) });

}

async function saveData(folderName, filename, englishString, chineseString) {
  const countryRef = db.collection('country');  //collect

  const doc = await countryRef.doc(folderName);

  var name_cn = filename + '_cn';
  var name_en = filename + '_en';
  doc.update({
    [name_en]: englishString,
    [name_cn]: chineseString
  })


}


//save data to database end 





async function translateText(folderName, textString, filename) {
  // [START translate_v3_translate_text_2]
  // Construct request

  var englishString = textString;

  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [textString],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    sourceLanguageCode: 'en',
    targetLanguageCode: 'zh-cn',
  };
  // [END translate_v3_translate_text_2]

  // [START translate_v3_translate_text_3]
  // Run request
  const [response] = await translationClient.translateText(request);

  for (const translation of response.translations) {

    var chineseString = `${translation.translatedText}`;
    saveData(folderName, filename, englishString, chineseString);
  }
  // [END translate_v3_translate_text_3]
}


//遍历目录


function walkSyncFolder(currentDirPath) {
  var fs = require('fs'),
    path = require('path');


  fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function (dirent) {
    var folderPath = path.join(currentDirPath, dirent.name);
    if (dirent.isDirectory()) {

      translateWord(dirent.name, createDoc);

      walkSync(folderPath, function (filePath, stat) {
        redDetailFile(filePath);
      });


    }
  });
}

async function translateWord(textString) {
  var request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [textString],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    sourceLanguageCode: 'en',
    targetLanguageCode: 'zh-cn',
  };

  var [response] = await translationClient.translateText(request);

  var chineseString;

  for (const translation of response.translations) {
    console.log('translation.translatedText:', `${translation.translatedText}`)
    chineseString = `${translation.translatedText}`;
  }
  createDoc(textString, chineseString);
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
  const content = fs.readFileSync(filePath)

  let fileInfo = getFileInfo(filePath)
  await utils.createDataFilePromise(fileInfo.fileName, content, fileInfo.fileOutDir)
  // console.log('fileObjList:', fileObjList.slice(0, 2))
  // console.log('content:', content.toString())
}

translateOneFile('./data/Albania/authority')

// walkSyncFolder('./data');






