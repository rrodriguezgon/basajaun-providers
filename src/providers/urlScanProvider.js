const { getItemsURLSCAN } = require("../services/providers");
const { crearAnalizedUrl } = require("../common/managerMongo");
const moment = require("moment");

module.exports = async function run(terminos) {
  console.log(`INICIADO URLSCAN - ${moment().format("DD/MM HH:mm:ss")}`, terminos);

  for (const termino of terminos) {
    await getUrls(termino);
  }

  console.log(`TERMINADO URLSCAN - ${moment().format("DD/MM HH:mm:ss")}`);
};

async function getUrls(termino) {
  console.log(`INICIADO URLSCAN - ${termino} - ${moment().format("DD/MM HH:mm:ss")}`);

  try {
    const { data } = await getItemsURLSCAN(termino);
    const dia = moment();

    const unique = data.results.filter(
      (obj, index) =>
        data.results.findIndex(
          (item) => item.page.apexDomain === obj.page.apexDomain
        ) === index
    );

    console.log({ results: data.results.length });
    console.log({ items: unique.length });

    for (const item of unique) {
      const dataUrl = {
        url: item.page.url
          ? {
              maindomain: item.page.apexDomain,
              domain: item.page.url,
            }
          : undefined,
        dns: item.page.country
          ? {
              country: item.page.country,
              createDate: dia,
            }
          : undefined,
        server: item.page.server
          ? {
              value: item.page.server,
              createDate: dia,
            }
          : undefined,
        mimeType: item.page.mimeType
          ? {
              value: item.page.mimeType,
              createDate: dia,
            }
          : undefined,
        whoIs: item.page.asn
          ? {
              asn: `${item.page.asn} / ${item.page.asnname}`,
              createDate: dia,
            }
          : undefined,
        screenshots: item.screenshot
          ? {
              value: item.screenshot,
              createDate: dia,
            }
          : undefined,
        externalLinks: [item.result],
        source: "URLSCAN",
        urlState: 1,
        createDate: dia,
      };

      await crearAnalizedUrl(dataUrl);
    }
  } catch (ex) {
    console.log(ex);
  }

  console.log(`TERMINADO URLSCAN - ${termino} - ${moment().format("DD/MM HH:mm:ss")}`);
}
