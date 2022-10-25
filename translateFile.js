import { createDataFilePromise, getAllFilesByFloderPath } from './lib/utils'
const utils = require('./lib/utils')
const outputPath = './translateResult'
const inputPath = './data'

const database_path = 'firestore.json';

//translate api key
const path = 'google-api-key.json';

const projectId = 'logical-hallway-352208';
const location = 'global';



const { TranslationServiceClient } = require('@google-cloud/translate');
// [END translate_v3_translate_text_0]


const translationClient = new TranslationServiceClient({ keyFilename: path });



const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: projectId,
  keyFilename: database_path,
});








const fs = require('fs')

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



async function translateOneFile(filePath) {
  const content = fs.readFileSync(filePath)
  const fileList = await getAllFilesByFloderPath(inputPath)
  console.log('fileList:', fileList)
  // console.log('content:', content.toString())
}

translateOneFile('./data/Albania/authority')

// walkSyncFolder('./data');






