const { getItemsOPENPHISH } = require("../services/providers");
const { crearAnalizedUrl } = require("../common/managerMongo");
const moment = require("moment");

module.exports = async function run() {
  await processUrls();
};

async function processUrls() {
  console.log(`INICIADO OPENPHISH ${moment().format('DD/MM HH:mm:ss')}`);

  try {
    const { data } = await getItemsOPENPHISH();
    const items = [...new Set(data.split("\n"))];
    console.log(items.length);
    
    const dia = moment();

    for (const item of items) {
      const dataUrl = {
        url: {
          maindomain: item,
          domain: item,
        },
        source: "OPENPHISH",
        urlState: 1,
        createDate: dia,
      };

      await crearAnalizedUrl(dataUrl).catch((ex) => console.log(ex));
    }

    console.log(`TERMINADO OPENPHISH ${moment().format('DD/MM HH:mm:ss')}`);
  } catch (ex) {
    console.log(ex);
  }
}
