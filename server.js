/* ============================================================
   Portfolio Server — Copyright (c) 2026 TechRoad Inc.
   No third-party form service — direct Gmail SMTP.
   ============================================================ */

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const isConfigured = config.EMAIL !== 'your-email@gmail.com' && config.APP_PASSWORD !== 'xxxx xxxx xxxx xxxx';

if (!isConfigured) {
  console.warn('\n⚠  Demo mode: Fill EMAIL + APP_PASSWORD in config.js to enable real sending.\n   Form will show demo success until you configure it.\n');
}

const transporter = isConfigured ? nodemailer.createTransport({
  service: 'gmail',
  auth: { user: config.EMAIL, pass: config.APP_PASSWORD },
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
}) : null;

/* verify on start */
if (transporter) {
  transporter.verify((err) => {
    if (err) console.error('SMTP error:', err.message);
    else console.log('✓ SMTP ready');
  });
}

app.get('/api/config', (req, res) => {
  res.json({ email: isConfigured ? config.EMAIL : 'demo@techroad.dev' });
});

app.post('/api/send', async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ ok: false, error: 'Missing fields' });

  if (!isConfigured) {
    // Demo mode — don't actually send, just simulate success for testing
    console.log(`[DEMO] Message from ${name} <${email}>: ${message.substring(0,80)}...`);
    await new Promise(r => setTimeout(r, 600));
    return res.json({ ok: true, demo: true });
  }

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:16px;overflow:hidden">
    <div style="background:#0a0a0a;padding:22px 24px;border-bottom:3px solid #c0392b">
      <div style="color:rgba(255,255,255,.5);font-family:monospace;font-size:11px;letter-spacing:.18em">✦ NEW MESSAGE ✦</div>
      <div style="color:#fff;font-size:18px;margin-top:8px">Someone contacted you via your portfolio</div>
    </div>
    <div style="padding:24px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="color:#888;padding:10px 0;width:110px">Name</td><td style="font-weight:600;color:#111">${name}</td></tr>
        <tr><td style="color:#888;padding:10px 0">Email</td><td><a href="mailto:${email}" style="color:#c0392b;text-decoration:none">${email}</a></td></tr>
        ${phone ? `<tr><td style="color:#888;padding:10px 0">Phone</td><td><a href="tel:${phone}" style="color:#c0392b;text-decoration:none">${phone}</a></td></tr>` : ''}
        <tr><td style="color:#888;padding:10px 0;vertical-align:top">Message</td><td style="color:#222;line-height:1.7;white-space:pre-wrap">${message.replace(/</g,'&lt;')}</td></tr>
      </table>
      <div style="margin-top:22px;padding-top:16px;border-top:1px solid #f0f0f0;color:#aaa;font-size:12px;text-align:center">Reply directly to this email to answer ${name} · TechRoad Inc.</div>
    </div>
  </div>`;

  try {
    await transporter.sendMail({
      from: `"${name} via Portfolio" <${config.EMAIL}>`,
      to: config.EMAIL,
      replyTo: `"${name}" <${email}>`,
      subject: `New portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone||'N/A'}\n\n${message}`,
      html,
    });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`\n✓ Portfolio running at http://localhost:${port}`);
    console.log(`  → ${isConfigured ? config.EMAIL : 'demo mode (configure config.js)'}\n`);
    if (port !== config.PORT) console.log(`  (port ${config.PORT} was busy, using ${port} instead)\n`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      throw err;
    }
  });
}
startServer(config.PORT);
