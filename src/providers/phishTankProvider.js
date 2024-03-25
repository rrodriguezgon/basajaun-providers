const { getItemsPHISHTANK } = require("../services/providers");
const { crearAnalizedUrl } = require("../common/managerMongo");
const moment = require("moment");

module.exports = async function run() {
  console.log(`INICIADO PHISTANK ${moment().format('DD/MM HH:mm:ss')}`);
  await processUrls();
  console.log(`TERMINADO  PHISTANK ${moment().format('DD/MM HH:mm:ss')}`);
};

async function processUrls() {
  try {
    const { data } = await getItemsPHISHTANK();
    const dia = moment();

    let count = 0;
    
    for (const item of data) {
      const dataUrl = {
        url: {
          domain: item.url,
          maindomain: item.url,
        },
        dns: item.details.length
          ? {
              country: item.details[0].country,
              createDate: dia,
            }
          : undefined,
        whoIs: item.details.length
          ? {
              asn: `${item.details[0].announcing_network} / ${item.details[0].rir}`,
              createDate: dia,
            }
          : undefined,
        externalLinks: [item.phish_detail_url],
        results: {
          brandTags: [item.target],
        },
        source: "PHISHTANK",
        urlState: 1,
        createDate: moment(),
      };

      await crearAnalizedUrl(dataUrl).catch((ex) => console.error(ex));
      count++;
      console.log('total:', data.length, moment().format('DD/MM HH:mm'));
      console.log('creados:', count);
      console.log('creado',dataUrl.url.domain);
    }
  } catch (ex) {
    console.error(ex);
  }
}
