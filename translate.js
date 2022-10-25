const { Translate } = require('@google-cloud/translate').v2;

let projectId = 'logical-hallway-352208'
// Instantiates a client
const translate = new Translate({ projectId });


async function start() {
  const text = 'Hello, world!';

  // The target language
  const target = 'zh-cn';

  // Translates some text into Russian
  const [translation] = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
}
start()
