
# Projet_IA_dans_lingnierie_des_systmes

# MailHog Spam Classification System

## Overview

This project is a local email simulation platform that integrates:

* MailHog as a local SMTP server and email testing environment
* A Python spam/phishing classification service using a Naive Bayes model
* A Node.js backend API
* A React (TSX + CSS) frontend mailbox interface

The system allows two-way email communication between local mailboxes while automatically classifying suspicious emails as spam.

If an email is detected as spam/phishing, the system automatically:

* adds `**` at the beginning of the email subject
* adds the header `X-Spam: yes`
* redirects the email to the Spam section in the frontend interface

---

# Project Architecture

```text
React Frontend (Mailbox UI)
        |
        v
Node.js Backend API
        |
        v
MailHog SMTP Server
        |
        v
Python Spam Classifier
(Naive Bayes Model)
```

---

# Features

## Frontend (React)

* Inbox mailbox
* Sent mailbox
* Spam mailbox
* Email sending interface
* Real-time mailbox refresh
* Filtering emails by mailbox address

## Backend (Node.js)

* Read emails from MailHog API
* Send emails through SMTP
* Provide REST API endpoints
* Separate Inbox / Spam / Sent messages

## Python Classification Service

* Download emails from MailHog API
* Extract email content
* Vectorize email text
* Predict spam probability using Naive Bayes
* Mark spam emails with `**`
* Re-upload processed emails to MailHog
* Prevent duplicate processing using email IDs

---

# Technologies Used

## Frontend

* React
* TypeScript (TSX)
* CSS
* Axios

## Backend

* Node.js
* Express.js
* Nodemailer

## AI / ML

* Python
* Scikit-learn
* Joblib
* Naive Bayes

## Mail Server

* MailHog
* Docker / Podman

---

# Project Structure

```text
project/
│
├── backend/
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── Mailbox.tsx
│   │   ├── styles.css
│
├── classifier/
│   ├── classify_and_upload_from_mailhog_nb.py
│   ├── phishing_model.pkl
│   ├── phishing_vectorizer.pkl
│   ├── processed_ids.txt
│
└── README.md
```

---

# Step 1 — Start MailHog

MailHog is used as a local SMTP server and email testing interface.

## Run MailHog

```bash
docker run -d --name mailhog \
-p 8025:8025 \
-p 1026:1026 \
docker.io/mailhog/mailhog \
-smtp-bind-addr 0.0.0.0:1026 \
-api-bind-addr 0.0.0.0:8025
```

---

## MailHog Ports

| Port | Role                |
| ---- | ------------------- |
| 1026 | SMTP Server         |
| 8025 | Web Interface + API |

---

## Access MailHog Interface

Open:

```text
http://localhost:8025
```

---

# Step 2 — Create Python Virtual Environment

## Create venv

```bash
python3 -m venv venv
```

## Activate venv

### Linux / Kali

```bash
source venv/bin/activate
```

---

# Step 3 — Install Python Dependencies

```bash
pip install --upgrade pip
```

```bash
pip install requests beautifulsoup4 numpy scikit-learn joblib
```

---

# Step 4 — Place the ML Model Files

Copy the following files into the `classifier/` directory:

```text
phishing_model.pkl
phishing_vectorizer.pkl
```

These files contain:

* trained Naive Bayes model
* TF-IDF vectorizer

---

# Step 5 — Start the Spam Classification Service

The Python script continuously:

1. downloads emails from MailHog
2. classifies emails
3. marks spam emails
4. re-uploads emails to MailHog

## Run the classifier

```bash
python classify_and_upload_from_mailhog_nb.py \
--mailhog-api http://localhost:8025 \
--model phishing_model.pkl \
--vectorizer phishing_vectorizer.pkl \
--smtp-host localhost \
--smtp-port 1026 \
--threshold 0.5 \
--skip-processed
```

---

# Step 6 — Start the Backend Server

## Install dependencies

```bash
npm install
```

## Start backend

```bash
node server.js
```

The backend:

* fetches emails from MailHog API
* filters emails by mailbox
* separates Inbox / Spam / Sent
* exposes REST APIs

---

# Backend API Endpoints

## Get mailbox messages

```http
GET /api/messages?mailbox=alice@local
```

---

## Send email

```http
POST /api/send
```

Example JSON body:

```json
{
  "from": "alice@local",
  "to": "bob@local",
  "subject": "Hello",
  "body": "Test message"
}
```

---

# Step 7 — Start the React Frontend

## Install dependencies

```bash
npm install
```

## Start React app

```bash
npm run dev
```

or:

```bash
npm start
```

---

# Step 8 — Open Two Mailboxes

Open two browser windows:

## Mailbox 1

```text
http://localhost:5173/?mailbox=alice@local
```

## Mailbox 2

```text
http://localhost:5173/?mailbox=bob@local
```

---

# Mailbox Filtering Logic

## Inbox

Emails received by the user and NOT marked as spam.

```text
To = mailbox
AND
Subject does not start with **
```

---

## Spam

Emails received by the user and marked as spam.

```text
To = mailbox
AND
Subject starts with **
```

---

## Sent

Emails sent by the current user.

```text
From = mailbox
```

---

# Anti-Duplication System

The classifier stores processed MailHog email IDs inside:

```text
processed_ids.txt
```

This prevents:

* infinite loops
* duplicate emails
* repeated classifications

---

# How Spam Detection Works

## Email Processing Pipeline

```text
Email arrives
      ↓
MailHog stores email
      ↓
Python classifier downloads email
      ↓
Vectorizer transforms text
      ↓
Naive Bayes predicts spam probability
      ↓
If spam:
    Add "**" to subject
      ↓
Re-upload email to MailHog
      ↓
Frontend displays message in Spam section
```

---

# Example Spam Email

## Original Email

```text
Subject: Win a free iPhone
```

## After Classification

```text
Subject: **Win a free iPhone
X-Spam: yes
```

---

# Future Improvements

* Real-time WebSocket updates
* User authentication
* Database integration
* IMAP support
* Advanced AI models
* Email attachments support
* Docker Compose deployment

---

# Author

Developed as a cybersecurity and AI integration project for local email spam/phishing detection.

