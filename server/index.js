const express = require("express");
const axios = require("axios");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const MAILHOG_API = process.env.MAILHOG_API || "http://localhost:8025";
const SMTP_HOST = process.env.SMTP_HOST || "localhost";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "1026", 10);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/api/messages", async (req, res) => {
  try {
    const mailbox = req.query.mailbox;
    const r = await axios.get(`${MAILHOG_API}/api/v2/messages`);
    const items = r.data.items || [];
    const inbox = [], spam = [], sent = [];
    for (const it of items) {
      const headers = (it.Content && it.Content.Headers) || {};
      const subject = (headers.Subject && headers.Subject[0]) || "";
      const fromHdr = (headers.From && headers.From[0]) || "";
      const tosArr = (it.To || []).map(t => `${t.Mailbox||""}@${t.Domain||""}`.replace(/^@|@$/,""));
      // Sent: if from includes mailbox
      if (mailbox && fromHdr.includes(mailbox)) {
        sent.push({id: it.ID, from: fromHdr, tos: tosArr, subject, body: it.Content && it.Content.Body});
        continue;
      }
      if (!mailbox || tosArr.includes(mailbox)) {
        if (subject.startsWith("**") || ((headers["X-Spam"]||[])[0] || "").toLowerCase() === "yes") {
          spam.push({id: it.ID, from: fromHdr, tos: tosArr, subject, body: it.Content && it.Content.Body});
        } else {
          inbox.push({id: it.ID, from: fromHdr, tos: tosArr, subject, body: it.Content && it.Content.Body});
        }
      }
    }
    res.json({ inbox, spam, sent });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/send", async (req, res) => {
  try {
    const { from, to, subject, body } = req.body;
    const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: SMTP_PORT, secure: false });
    const info = await transporter.sendMail({ from, to, subject, text: body });
    res.json({ ok: true, info });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API listening on ${port}`));