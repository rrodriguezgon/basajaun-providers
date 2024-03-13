// Importaciones base
const mongoose = require("mongoose");

const analizedUrlModel = require('../models/urlAnalized');

function connectBBDD() {
    if (mongoose.connection.readyState === 0) {
        try {
            // Connect to the MongoDB cluster
            mongoose.set("strictQuery", false);
            mongoose.connect(
                "mongodb+srv://basajaunUser:LQ5TaCWdoCkWeHmD@cluster0.ebssp.mongodb.net/basajaunDB?retryWrites=true&w=majority",
                { useNewUrlParser: true }
            ).then(() => console.log("Mongoose connected!!"));

        } catch (e) {
            console.log(e);
            console.log("could not connect");
        }
    }
}

async function crearAnalizedUrl(analizedUrl) {
    connectBBDD();

    const filter = { "url.domain": analizedUrl.url.domain };

    await analizedUrlModel.findOneAndUpdate(filter, analizedUrl, {
        new: true,
        upsert: true // Make this update into an upsert
      }).catch(ex => console.log(ex));
}

module.exports = {
    connectBBDD,
    crearAnalizedUrl,
}
