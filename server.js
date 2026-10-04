const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const dns = require('dns').promises;
const net = require('net');

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const HOST = '127.0.0.1';

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

function isAllowedOrigin(origin) {
  if (process.env.ALLOWED_ORIGIN && origin === process.env.ALLOWED_ORIGIN) return true;
  try {
    const parsed = new URL(origin);
    const port = Number(parsed.port || (parsed.protocol === 'https:' ? 443 : 80));
    return ['http:', 'https:'].includes(parsed.protocol)
      && ['localhost', '127.0.0.1'].includes(parsed.hostname)
      && port === PORT;
  } catch (_) {
    return false;
  }
}

app.use((req, res, next) => {
  const origin = req.get('Origin');
  if (origin && !isAllowedOrigin(origin)) {
    return res.status(403).json({ ok: false, error: 'Origin not allowed.' });
  }
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '12mb' }));

// Validation & Sanitization Helpers
function isPrivateOrBlockedHost(host) {
  if (!host || typeof host !== 'string') return true;
  const trimmed = host.trim().toLowerCase();

  if (trimmed === 'localhost' || trimmed.endsWith('.localhost') || net.isIP(trimmed) === 6) {
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
    const address = (((a * 256 + b) * 256 + c) * 256 + d) >>> 0;
    const blockedRanges = [
      [0x00000000, 8], [0x0a000000, 8], [0x64400000, 10], [0x7f000000, 8],
      [0xa9fe0000, 16], [0xac100000, 12], [0xc0000000, 24], [0xc0000200, 24],
      [0xc0586300, 24], [0xc0a80000, 16], [0xc6120000, 15], [0xc6336400, 24],
      [0xcb007100, 24], [0xe0000000, 4], [0xf0000000, 4],
    ];
    if (blockedRanges.some(([network, prefix]) => {
      const mask = (0xffffffff << (32 - prefix)) >>> 0;
      return ((address & mask) >>> 0) === network;
    })) return true;
  }

  if (trimmed.endsWith('.local') || trimmed.endsWith('.internal')) {
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

async function validateSmtpParams(smtp) {
  if (!smtp || typeof smtp !== 'object') {
    return { error: 'Invalid SMTP configuration object.' };
  }
  if (!smtp.host || typeof smtp.host !== 'string' || smtp.host.trim().length > 253) {
    return { error: 'A valid SMTP host is required.' };
  }
  if (isPrivateOrBlockedHost(smtp.host)) {
    return { error: 'Invalid or forbidden SMTP host address.' };
  }
  const port = Number(smtp.port);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return { error: 'Invalid SMTP port number (must be 1-65535).' };
  }
  if (!smtp.user || typeof smtp.user !== 'string' || !smtp.user.trim()) {
    return { error: 'SMTP username / email is required.' };
  }
  if (smtp.user.length > 254 || !smtp.pass || typeof smtp.pass !== 'string' || smtp.pass.length > 1024) {
    return { error: 'SMTP username or password is invalid.' };
  }

  try {
    const ipVersion = net.isIP(smtp.host.trim());
    const addresses = ipVersion === 4
      ? [{ address: smtp.host.trim() }]
      : await dns.lookup(smtp.host.trim(), { all: true, family: 4, verbatim: true });
    if (!addresses.length || addresses.some(({ address }) => isPrivateOrBlockedHost(address))) {
      return { error: 'SMTP host resolves to a forbidden or non-public address.' };
    }
    return {
      target: {
        host: addresses[0].address,
        servername: ipVersion === 4 ? undefined : smtp.host.trim(),
      },
    };
  } catch (_) {
    return { error: 'SMTP host could not be resolved to a public IPv4 address.' };
  }
}

// Helper to create Nodemailer transport
function createTransport(smtp, target) {
  const port = Number(smtp.port);
  return nodemailer.createTransport({
    host: target.host,
    port,
    secure: port === 465,
    auth: {
      user: smtp.user.trim(),
      pass: smtp.pass,
    },
    tls: {
      rejectUnauthorized: true,
      ...(target.servername ? { servername: target.servername } : {}),
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
}

// Test SMTP Connection
app.post('/api/test-smtp', async (req, res) => {
  try {
    const { smtp } = req.body;
    const validation = await validateSmtpParams(smtp);
    if (validation.error) {
      return res.status(400).json({ ok: false, error: validation.error });
    }

    const transporter = createTransport(smtp, validation.target);
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

    const validation = await validateSmtpParams(smtp);
    if (validation.error) {
      return res.status(400).json({ ok: false, error: validation.error });
    }

    if (!to || typeof to !== 'string' || to.length > 254 || !isValidEmail(to)) {
      return res.status(400).json({ ok: false, error: 'Valid recipient email address is required.' });
    }

    if (!subject || typeof subject !== 'string' || subject.length > 200) {
      return res.status(400).json({ ok: false, error: 'Subject is required.' });
    }

    if (!html || typeof html !== 'string' || html.length > 200000) {
      return res.status(400).json({ ok: false, error: 'HTML email body is required.' });
    }

    if (!attachmentBase64 || typeof attachmentBase64 !== 'string' || attachmentBase64.length > 11200000
      || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(attachmentBase64)) {
      return res.status(400).json({ ok: false, error: 'Attachment base64 data is required.' });
    }

    const attachment = Buffer.from(attachmentBase64, 'base64');
    if (attachment.length > 8 * 1024 * 1024 || !attachment.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) {
      return res.status(400).json({ ok: false, error: 'Attachment must be a PNG file no larger than 8 MB.' });
    }

    const cleanSubject = sanitizeHeaderString(subject);
    const cleanFromName = sanitizeHeaderString(smtp.fromName || '');
    const cleanFilename = sanitizeFilename(filename);

    const fromAddress = cleanFromName
      ? `"${cleanFromName.replace(/"/g, '')}" <${smtp.user.trim()}>`
      : smtp.user.trim();

    const transporter = createTransport(smtp, validation.target);
    const mailOptions = {
      from: fromAddress,
      to: to.trim(),
      subject: cleanSubject,
      html,
      attachments: [
        {
          filename: cleanFilename,
          content: attachment,
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

for (const asset of ['index.html', 'app.js', 'style.css', 'image.jpeg']) {
  app.get(`/${asset}`, (req, res) => res.sendFile(path.join(__dirname, asset)));
}

app.use((req, res) => res.status(404).json({ ok: false, error: 'Not found.' }));

app.listen(PORT, HOST, () => {
  console.log(`Certificate Generator Backend running on http://${HOST}:${PORT}`);
});