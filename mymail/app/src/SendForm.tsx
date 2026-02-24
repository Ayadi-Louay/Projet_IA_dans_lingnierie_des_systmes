"use client";

import React, { useState } from "react";
const API = process.env.REACT_APP_API_BASE || "http://localhost:3001";

export default function SendForm({
  mailbox,
  onSent,
}: {
  mailbox: string;
  onSent: () => void;
}) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const r = await fetch(`${API}/api/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: mailbox, to, subject, body }),
      });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setTo("");
      setSubject("");
      setBody("");
      onSent();
    } catch (err: any) {
      alert("Send error: " + err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="sendform" onSubmit={submit}>
      <h3>Send</h3>
      <input
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="To (e.g. bob@local)"
      />
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
      />
      <button type="submit" disabled={sending}>
        {sending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}

