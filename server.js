const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Helper to create Nodemailer transport
function createTransport(smtp) {
  return nodemailer.createTransport({
    host: smtp.host,
    port: parseInt(smtp.port, 10) || 587,
    secure: parseInt(smtp.port, 10) === 465,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

// Test SMTP Connection
app.post('/api/test-smtp', async (req, res) => {
  try {
    const { smtp } = req.body;
    if (!smtp || !smtp.host || !smtp.user || !smtp.pass) {
      return res.status(400).json({ ok: false, error: 'Missing required SMTP parameters.' });
    }
    const transporter = createTransport(smtp);
    await transporter.verify();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Send Email with Attachment
app.post('/api/send-email', async (req, res) => {
  try {
    const { smtp, to, subject, html, attachmentBase64, filename } = req.body;

    if (!smtp || !to || !subject || !html || !attachmentBase64) {
      return res.status(400).json({ error: 'Missing required payload parameters.' });
    }

    const transporter = createTransport(smtp);
    const mailOptions = {
      from: smtp.fromName ? `"${smtp.fromName}" <${smtp.user}>` : smtp.user,
      to,
      subject,
      html,
      attachments: [
        {
          filename: filename || 'certificate.png',
          content: Buffer.from(attachmentBase64, 'base64'),
          contentType: 'image/png',
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    return res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Certificate Generator Backend running on http://localhost:${PORT}`);
});