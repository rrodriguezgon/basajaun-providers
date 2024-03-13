const axios = require("axios");

const getItemsURLSCAN = (term) => axios.request({
    method: 'GET',
    url: `https://urlscan.io/api/v1/search/?q=page.domain:(/${term}.*/)`,
    headers: { "API-Key": "0e7d5b88-aa4a-4aa4-8190-5b743142447c" }
});

const getItemsOPENPHISH = () => axios.request({
    method: 'GET',
    url: 'https://www.openphish.com/feed.txt',
});

module.exports = {
    getItemsURLSCAN,
    getItemsOPENPHISH,
};
