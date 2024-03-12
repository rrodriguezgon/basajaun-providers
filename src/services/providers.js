const axios = require("axios");

const getItemsURLSCAN = () => axios.request({
    method: 'GET',
    url: 'https://urlscan.io/api/v1/search',
    headers: { "API-KEY": "0e7d5b88-aa4a-4aa4-8190-5b743142447c" }
});

module.exports = {
    getItemsURLSCAN,
};
