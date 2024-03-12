const { getItemsURLSCAN } = require('../services/providers');


module.exports = async function run(){
    getItemsURLSCAN()
        .then(({data}) => {
            console.log(data.results);
        })
        .catch((ex) => console.log(ex));
}