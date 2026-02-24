"use client";

import React, { useEffect, useState } from "react";
import Mailbox from "./Mailbox";
import "./App.css";

function App() {
  const [mailbox, setMailbox] = useState("alice@local");

  useEffect(() => {
    // mailbox from query string ?mailbox=alice@local
    const params = new URLSearchParams(window.location.search);
    const mb =
      params.get("mailbox") || process.env.REACT_APP_MAILBOX || "alice@local";
    setMailbox(mb);
  }, []);

  return (
    <div className="app">
      <Mailbox mailbox={mailbox} />
    </div>
  );
}
export default App;

