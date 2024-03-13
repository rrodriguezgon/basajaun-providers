const { getItemsOPENPHISH } = require("../services/providers");
const moment = require("moment");
const { crearAnalizedUrl } = require("../common/managerMongo");

// TERMINOS

module.exports = async function run() {
  getItemsOPENPHISH()
    .then(({ data }) => {
      let items = [...new Set(data.split("\n"))];
      const dia = moment();

      items.forEach((item) => {
        const dataUrl = {
          url: {
            maindomain: item,
            domain: item,
          },
          source: "OPENPHISH",
          urlState: 1,
          createDate: dia,
        };

        crearAnalizedUrl(dataUrl)
          .then(() => console.log("creado"))
          .catch((ex) => console.log(ex));
      });
    })
    .catch((ex) => console.log(ex));
};
