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
```

<!-- Tech Stack Section -->
<section id="tech-stack">
  <h2>⚙️ Tech Stack</h2>
  <table>
    <thead>
      <tr>
        <th>Layer</th>
        <th>Technology</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Backend</strong></td>
        <td>Node.js, Express, TypeScript</td>
      </tr>
      <tr>
        <td><strong>Queue</strong></td>
        <td>Redis + BullMQ</td>
      </tr>
      <tr>
        <td><strong>Database</strong></td>
        <td>MongoDB with Mongoose</td>
      </tr>
      <tr>
        <td><strong>Parsing</strong></td>
        <td><code>xml2js</code> (convert XML feeds to JSON)</td>
      </tr>
      <tr>
        <td><strong>Cron</strong></td>
        <td><code>node-cron</code> (or external CRON trigger)</td>
      </tr>
      <tr>
        <td><strong>Logging</strong></td>
        <td>Import logs stored in MongoDB</td>
      </tr>
    </tbody>
  </table>
</section>

<!-- Setup Instructions Section -->
<section id="setup-instructions">
  <h2>📦 Setup Instructions</h2>
  <ol>
    <li>
      <strong>Clone the Repository</strong><br>
      <pre><code>git clone https://github.com/Animesh-Pradhan/importSystem.git
cd importSystem</code></pre>
    </li>
    <li>
      <strong>Install Server Dependencies</strong><br>
      <pre><code>cd server
npm install</code></pre>
    </li>
    <li>
      <strong>Configure Environment Variables</strong><br>
      Create a file named <code>.env</code> inside <code>/server</code> with:
      <pre><code>PORT=5000
MONGO_URI=mongodb://localhost:27017/job_imports
REDIS_URL_SERVER=redis.com</code></pre>
    </li>
    <li>
      <strong>Start the Development Server</strong><br>
      <pre><code>npm run dev</code></pre>
      <p>🎉 Your API will now be running on <code>http://localhost:3001</code> and ready to import job feeds!</p>
    </li>
  </ol>
</section>

