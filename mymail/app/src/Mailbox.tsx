"use client";

import React, { useEffect, useState } from "react";
import SendForm from "./SendForm";

type Msg = {
  id: string;
  from: string;
  tos: string[];
  subject: string;
  body: string;
};

const API = process.env.REACT_APP_API_BASE || "http://localhost:3001";

function Mailbox({ mailbox }: { mailbox: string }) {
  const [inbox, setInbox] = useState<Msg[]>([]);
  const [spam, setSpam] = useState<Msg[]>([]);
  const [sent, setSent] = useState<Msg[]>([]);
  const [tab, setTab] = useState<"inbox" | "sent" | "spam">("inbox");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(
        `${API}/api/messages?mailbox=${encodeURIComponent(mailbox)}`,
      );
      const data = await r.json();
      setInbox(data.inbox || []);
      setSpam(data.spam || []);
      setSent(data.sent || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [mailbox]);

  return (
    <div className="mailbox">
      <div className="sidebar">
        <button
          className={tab === "inbox" ? "active" : ""}
          onClick={() => setTab("inbox")}
        >
          Inbox ({inbox.length})
        </button>
        <button
          className={tab === "sent" ? "active" : ""}
          onClick={() => setTab("sent")}
        >
          Sent ({sent.length})
        </button>
        <button
          className={tab === "spam" ? "active" : ""}
          onClick={() => setTab("spam")}
        >
          Spam ({spam.length})
        </button>
        <button className="refresh" onClick={load}>
          Refresh
        </button>
      </div>

      <div className="content">
        <h1>{mailbox}</h1>
        {loading && <div>Loading…</div>}
        <div className="list">
          {tab === "inbox" && inbox.map((m) => <MailItem key={m.id} m={m} />)}
          {tab === "sent" && sent.map((m) => <MailItem key={m.id} m={m} />)}
          {tab === "spam" && spam.map((m) => <MailItem key={m.id} m={m} />)}
        </div>
        <SendForm mailbox={mailbox} onSent={load} />
      </div>
    </div>
  );
}

const MailItem = ({ m }: { m: Msg }) => (
  <div className="message">
    <div className="meta">
      <strong>{m.subject}</strong> <span className="from">From: {m.from}</span>
    </div>
    <pre className="body">{m.body}</pre>
  </div>
);

export default Mailbox;

