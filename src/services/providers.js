const axios = require("axios");
const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});
axios.defaults.httpsAgent = httpsAgent;

const getItemsURLSCAN = (term) => axios.request({
    method: 'GET',
    url: `https://urlscan.io/api/v1/search/?q=page.domain:(/${term}.*/)`,
    headers: { "API-Key": "0e7d5b88-aa4a-4aa4-8190-5b743142447c" }
});

const getItemsOPENPHISH = () => axios.request({
    method: 'GET',
    url: 'https://www.openphish.com/feed.txt',
});

const getItemsPHISHTANK = () => axios.request({
    method: 'GET',
    url: 'http://data.phishtank.com/data/f945cbf52dcd3caf32d7ace8c3f90e341fe73089ce9758c29ab0be608df44662/online-valid.json',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
        'Accept': 'application/json', // Si es necesario, ajusta el tipo de contenido que aceptas
    }
});

module.exports = {
    getItemsURLSCAN,
    getItemsOPENPHISH,
    getItemsPHISHTANK,
};
