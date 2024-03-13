const { getItemsURLSCAN } = require("../services/providers");
const moment = require("moment");
const { crearAnalizedUrl } = require("../common/managerMongo");

// TERMINOS 
// {"busqueda": "all", "terminos": [ "" ]}
// {"busqueda": "santander", "terminos": [ "santander", "santder", "sentander" ]}
// {"busqueda": "bankia", "terminos": [ "bnkia", "b@nkia", "bancia" ]}
// {"busqueda": "caixa", "terminos": [ "coixa", "caixa", "cancha" ]}

module.exports = async function run() {
  getItemsURLSCAN("santander")
    .then(({ data }) => {
      const dia = moment();

      const unique = data.results.filter(
        (obj, index) =>
        data.results.findIndex((item) => item.page.apexDomain === obj.page.apexDomain) === index
      );

      unique.forEach((item) => {
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
          createDate: dia  
        };

        console.log(item);
        crearAnalizedUrl(dataUrl)
          .then(() => console.log("creado"))
          .catch((ex) => console.log(ex));
      });

      console.log({results: data.results.length});
      console.log({items: unique.length});
    })
    .catch((ex) => console.log(ex));
};
