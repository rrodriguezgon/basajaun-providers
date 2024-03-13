const mongoose = require("mongoose");

const urlAnalized = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  url: {
    maindomain: String,
    domain: String,
    resource: String,
    path: String,
  },
  dns: {
    dns: String,
    country: String,
    createDate: Date,
  },
  server: {
    value: String,
    createDate: Date,
  },
  mimeType: {
    value: String,
    createDate: Date,
  },
  whoIs: {
    asn: String,
    registrant: String,
    abuseInfo: String,
    certificates: Array,
    createDate: Date,
  },
  screenshots: {
    value: String,
    createDate: Date,
  },
  categories: Array,
  externalLinks: Array,
  searches: Array,
  results: {
    brandTags: Array,
    score: Number,
    extractedLinks: Array,
    html: String,
    detectedTecnologies: Array,
    portsScan: Array,
  },
  createDate: Date,
  updateDate: Date,
  source: String,
  urlState: Number,
});

module.exports = mongoose.model("urlAnalized_test", urlAnalized);
