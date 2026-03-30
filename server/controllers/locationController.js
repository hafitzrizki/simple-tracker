const {
  insertLocationLog,
  getAllLocationLogs,
  getLocationLogsByToken,
} = require('../models/locationModel');

const TOKEN_REGEX = /^[A-Za-z0-9_-]{6,128}$/;

const validateToken = (token) => TOKEN_REGEX.test(token);

const getRequestIp = (req) => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  return req.ip;
};

const createLocation = async (req, res, next) => {
  try {
    const { token, latitude, longitude, accuracy, timestamp } = req.body;

    if (!validateToken(token)) {
      return res.status(400).json({ error: 'Invalid token format.' });
    }

    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      typeof accuracy !== 'number'
    ) {
      return res.status(400).json({
        error: 'latitude, longitude, and accuracy must be numeric values.',
      });
    }

    const capturedAt = timestamp ? new Date(timestamp) : new Date();

    if (Number.isNaN(capturedAt.getTime())) {
      return res.status(400).json({ error: 'Invalid timestamp.' });
    }

    const location = await insertLocationLog({
      token,
      latitude,
      longitude,
      accuracy,
      ipAddress: getRequestIp(req),
      userAgent: req.get('user-agent') || 'Unknown',
      capturedAt,
    });

    return res.status(201).json({
      message: 'Location stored successfully.',
      data: location,
    });
  } catch (err) {
    return next(err);
  }
};

const listLocations = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (token && !validateToken(token)) {
      return res.status(400).json({ error: 'Invalid token format.' });
    }

    const locations = await getAllLocationLogs(token);
    return res.status(200).json({ data: locations });
  } catch (err) {
    return next(err);
  }
};

const getLocationsByToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!validateToken(token)) {
      return res.status(400).json({ error: 'Invalid token format.' });
    }

    const locations = await getLocationLogsByToken(token);
    return res.status(200).json({ data: locations });
  } catch (err) {
    return next(err);
  }
};

const exportLocationsCsv = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (token && !validateToken(token)) {
      return res.status(400).json({ error: 'Invalid token format.' });
    }

    const rows = await getAllLocationLogs(token);

    const csvHeader = [
      'id',
      'token',
      'latitude',
      'longitude',
      'accuracy',
      'ip_address',
      'user_agent',
      'created_at',
    ];

    const sanitizeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const raw = String(value).replace(/"/g, '""');
      return `"${raw}"`;
    };

    const csvRows = rows.map((row) =>
      [
        row.id,
        row.token,
        row.latitude,
        row.longitude,
        row.accuracy,
        row.ip_address,
        row.user_agent,
        row.created_at.toISOString(),
      ]
        .map(sanitizeCsv)
        .join(',')
    );

    const csvData = [csvHeader.join(','), ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="location-logs${token ? `-${token}` : ''}.csv"`
    );

    return res.status(200).send(csvData);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  TOKEN_REGEX,
  validateToken,
  createLocation,
  listLocations,
  getLocationsByToken,
  exportLocationsCsv,
};
