const { getItemsPHISHTANK } = require("../services/providers");
const { crearAnalizedUrl } = require("../common/managerMongo");
const moment = require("moment");

module.exports = async function run() {
  console.log(`INICIADO PHISTANK ${moment().format("DD/MM HH:mm:ss")}`);
  await processUrls();
  console.log(`TERMINADO  PHISTANK ${moment().format("DD/MM HH:mm:ss")}`);
};

async function processUrls() {
  try {
    const { data } = await getItemsPHISHTANK();

    let items = data.filter(
      (item) =>
        moment(item.verification_time).format("DD/MM/YYYY") ===
        moment().format("DD/MM/YYYY")
    );

    console.log(
      "Empezado - total:",
      items.length,
      moment().format("DD/MM HH:mm:ss")
    );

    for (const item of items) {
      const dataUrl = {
        url: {
          domain: item.url,
          maindomain: item.url,
        },
        dns: item.details.length
          ? {
              country: item.details[0].country,
              createDate: moment(),
            }
          : undefined,
        whoIs: item.details.length
          ? {
              asn: `${item.details[0].announcing_network} / ${item.details[0].rir}`,
              createDate: moment(),
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
    }
    console.log(
      "Terminado - total:",
      items.length,
      moment().format("DD/MM HH:mm:ss")
    );
  } catch (ex) {
    console.error(ex);
  }
}
