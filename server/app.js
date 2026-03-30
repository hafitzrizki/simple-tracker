const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const locationRoutes = require('./routes/locationRoutes');
const linkRoutes = require('./routes/linkRoutes');

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('combined'));
app.use(express.json({ limit: '1mb' }));

app.use('/api', locationRoutes);
app.use(linkRoutes);

app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/dashboard', express.static(path.join(__dirname, '..', 'dashboard')));

app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'success.html'));
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled application error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`Simple tracker listening on port ${port}`);
});
