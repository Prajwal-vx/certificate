const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Restrict CORS to trusted local origins and configured origins
const allowedPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedPattern.test(origin) || (process.env.ALLOWED_ORIGIN && origin === process.env.ALLOWED_ORIGIN)) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy: Origin not allowed.'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '25mb' }));

// Serve static frontend files from workspace root
app.use(express.static(__dirname));

// Validation & Sanitization Helpers
function isPrivateOrBlockedHost(host) {
  if (!host || typeof host !== 'string') return true;
  const trimmed = host.trim().toLowerCase();

  // Allow loopback/private for development ONLY if explicitly opted-in
  if (process.env.ALLOW_LOCAL_SMTP === 'true') {
    return false;
  }

  // Block obvious localhost / loopback identifiers
  if (trimmed === 'localhost' || trimmed === '127.0.0.1' || trimmed === '::1' || trimmed === '0.0.0.0') {
    return true;
  }

  // Validate standard hostname or IPv4 format
  const isHostname = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(trimmed);
  const ipv4Match = trimmed.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);

  if (!isHostname && !ipv4Match) {
    return true;
  }

  if (ipv4Match) {
    const [ , a, b, c, d ] = ipv4Match.map(Number);
    if (a > 255 || b > 255 || c > 255 || d > 255) return true;
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 127) return true; // loopback
    if (a === 169 && b === 254) return true; // cloud metadata / APIPA
    if (a === 0) return true;
  }

  if (trimmed.endsWith('.local') || trimmed.endsWith('.internal') || trimmed.endsWith('.localhost')) {
    return true;
  }

  return false;
}

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email.trim());
}

function sanitizeHeaderString(val) {
  if (!val || typeof val !== 'string') return '';
  return val.replace(/[\r\n]+/g, ' ').trim();
}

function sanitizeFilename(name) {
  if (!name || typeof name !== 'string') return 'certificate.png';
  const base = path.basename(name).replace(/[\r\n\t]+/g, '').replace(/[^\w\s.-]/g, '_');
  return base.slice(0, 80) || 'certificate.png';
}

function validateSmtpParams(smtp) {
  if (!smtp || typeof smtp !== 'object') {
    return 'Invalid SMTP configuration object.';
  }
  if (!smtp.host || typeof smtp.host !== 'string') {
    return 'SMTP host is required.';
  }
  if (isPrivateOrBlockedHost(smtp.host)) {
    return 'Invalid or forbidden SMTP host address (internal or loopback addresses are blocked for security).';
  }
  const port = parseInt(smtp.port, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    return 'Invalid SMTP port number (must be 1-65535).';
  }
  if (!smtp.user || typeof smtp.user !== 'string' || !smtp.user.trim()) {
    return 'SMTP username / email is required.';
  }
  if (!smtp.pass || typeof smtp.pass !== 'string') {
    return 'SMTP password is required.';
  }
  return null;
}

// Helper to create Nodemailer transport
function createTransport(smtp) {
  const port = parseInt(smtp.port, 10) || 587;
  const allowInvalid = smtp.allowInvalidTls === true;
  return nodemailer.createTransport({
    host: smtp.host.trim(),
    port,
    secure: port === 465,
    auth: {
      user: smtp.user.trim(),
      pass: smtp.pass,
    },
    tls: {
      rejectUnauthorized: !allowInvalid,
    },
  });
}

// Test SMTP Connection
app.post('/api/test-smtp', async (req, res) => {
  try {
    const { smtp } = req.body;
    const validationError = validateSmtpParams(smtp);
    if (validationError) {
      return res.status(400).json({ ok: false, error: validationError });
    }

    const transporter = createTransport(smtp);
    await transporter.verify();
    return res.json({ ok: true });
  } catch (err) {
    console.error('SMTP Verify Error:', err.message);
    return res.status(500).json({ ok: false, error: sanitizeHeaderString(err.message) || 'SMTP verification failed.' });
  }
});

// Send Email with Attachment
app.post('/api/send-email', async (req, res) => {
  try {
    const { smtp, to, subject, html, attachmentBase64, filename } = req.body;

    const validationError = validateSmtpParams(smtp);
    if (validationError) {
      return res.status(400).json({ ok: false, error: validationError });
    }

    if (!to || !isValidEmail(to)) {
      return res.status(400).json({ ok: false, error: 'Valid recipient email address is required.' });
    }

    if (!subject || typeof subject !== 'string') {
      return res.status(400).json({ ok: false, error: 'Subject is required.' });
    }

    if (!html || typeof html !== 'string') {
      return res.status(400).json({ ok: false, error: 'HTML email body is required.' });
    }

    if (!attachmentBase64 || typeof attachmentBase64 !== 'string') {
      return res.status(400).json({ ok: false, error: 'Attachment base64 data is required.' });
    }

    const cleanSubject = sanitizeHeaderString(subject);
    const cleanFromName = sanitizeHeaderString(smtp.fromName || '');
    const cleanFilename = sanitizeFilename(filename);

    const fromAddress = cleanFromName
      ? `"${cleanFromName.replace(/"/g, '')}" <${smtp.user.trim()}>`
      : smtp.user.trim();

    const transporter = createTransport(smtp);
    const mailOptions = {
      from: fromAddress,
      to: to.trim(),
      subject: cleanSubject,
      html,
      attachments: [
        {
          filename: cleanFilename,
          content: Buffer.from(attachmentBase64, 'base64'),
          contentType: 'image/png',
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    return res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('Send Mail Error:', err.message);
    return res.status(500).json({ ok: false, error: sanitizeHeaderString(err.message) || 'Failed to send email.' });
  }
});

// Fallback route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Certificate Generator Backend running on http://localhost:${PORT}`);
});