const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");
const cheerio = require("cheerio");
const moment = require("moment");
const { crearAnalizedUrl } = require("../common/managerMongo");

async function run(account) {
    await mailReader(account);  
}

async function mailReader(account) {
  try {
    const connection = await imaps.connect(account.config);
    console.log(
      `CONNECTION SUCCESSFUL - ${account.name}:`,
      moment().format("DD/MM/YYYY HH:mm:ss")
    );

    for (const box of account.boxes) {
      await processMailBox(connection, account.name, box);
    }

    connection.end();
  } catch (error) {
    console.log(error);
  }
}

async function processMailBox(connection, accountName, box) {
  console.log(
    `LEYENDO - ${box}:`,
    moment().format("DD/MM/YYYY HH:mm:ss")
  );
  const searchCriteria = ["UNSEEN"];
  const fetchOptions = {
    bodies: [""],
    markSeen: true,
  };

  await connection.openBox(box);
  const results = await connection.search(searchCriteria, fetchOptions);

  for (const item of results) {
    const all = item.parts.find((part) => part.which === "");
    const id = item.attributes.uid;
    const idHeader = "Imap-Id: " + id + "\r\n";
    const mail = await parseMail(idHeader + all.body);
    await processMail(mail, accountName, box);
  }
}

async function parseMail(rawMail) {
  return new Promise((resolve, reject) => {
    simpleParser(rawMail, (err, mail) => {
      if (err) {
        reject(err);
      } else {
        resolve(mail);
      }
    });
  });
}

async function processMail(mail, accountName, box) {
  try {
    const { from, subject, date, html } = mail;
    const links = extractLinks(html);

    console.log({
      account: accountName,
      box,
      from: from.value,
      subject,
      date: moment(date).format("DD/MM/YYYY HH:mm:ss"),
      links,
    });

    for (const link of links) {
      const dataUrl = {
        url: {
          maindomain: link,
          domain: link,
        },
        source: `${accountName}/${box}`,
        urlState: 1,
        createDate: moment(),
      };

      await crearAnalizedUrl(dataUrl).catch((ex) => console.log(ex));
    }
  } catch (error) {
    console.log(error);
  }
}

function extractLinks(html) {
  const $ = cheerio.load(html);
  return $("a")
    .map((i, el) => $(el).attr("href"))
    .get()
    .filter((item) => item !== "" && item !== "#");
}

module.exports = run;
