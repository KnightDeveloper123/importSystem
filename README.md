<h1 align="center">📦 Job Import System</h1>

<p align="center">
  A scalable background job processing system for importing and syncing job feeds from multiple external APIs. Built with ❤️ using Node.js, TypeScript, MongoDB, Redis, and BullMQ.
</p>

<p align="center">
  <img src="https://img.shields.io/github/languages/top/Animesh-Pradhan/importSystem?style=flat-square" />
  <img src="https://img.shields.io/github/last-commit/Animesh-Pradhan/importSystem?style=flat-square" />
  <img src="https://img.shields.io/github/license/Animesh-Pradhan/importSystem?style=flat-square" />
</p>

---

## ✨ Features

- 🔄 **Multi-Feed XML Import** – Supports importing from multiple RSS/XML job feeds
- ⚙️ **XML to JSON Conversion** – Parses XML responses to structured job objects
- 🧠 **Deduplication & Diffing** – Avoids redundant DB updates via deep object comparison
- 🛠 **Worker-Based Processing** – BullMQ handles scalable, asynchronous imports
- 📊 **Detailed Import Logs** – Tracks fetched, inserted, updated, skipped, and failed jobs
- 🧱 **Modular Folder Structure** – Clean services, workers, queues, and routes
- 🕐 **Cron Job Ready** – Easily attach to cron for automatic hourly imports

---

## 🗂️ Project Structure

```bash
/importSystem
├── client/                 # (Optional) Frontend for viewing logs
├── server/
│   ├── src/            
│   |  ├── models/             # MongoDB schemas (Job, ImportLog)
│   |  ├── routes/             # Express route definitions
│   |  ├── services/           # Business logic (fetch, queue, import)
│   |  ├── queues/             # BullMQ setup
│   |  ├── utils/              # XML parser, object comparison, etc.
│   |  ├── cron/               # Cron job definitions
│   ├── index.ts               # Express app setup
├   |── .env                   # Environment variables
├── .gitignore              # Ignore node_modules, envs, etc.
├── README.md               # You're here 📘
