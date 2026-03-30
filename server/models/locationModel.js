const pool = require('../db');

const insertLocationLog = async ({
  token,
  latitude,
  longitude,
  accuracy,
  ipAddress,
  userAgent,
  capturedAt,
}) => {
  const query = `
    INSERT INTO location_logs (
      token,
      latitude,
      longitude,
      accuracy,
      ip_address,
      user_agent,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    token,
    latitude,
    longitude,
    accuracy,
    ipAddress,
    userAgent,
    capturedAt,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllLocationLogs = async (token) => {
  const baseQuery = `
    SELECT id, token, latitude, longitude, accuracy, ip_address, user_agent, created_at
    FROM location_logs
  `;

  if (token) {
    const { rows } = await pool.query(
      `${baseQuery} WHERE token = $1 ORDER BY created_at DESC;`,
      [token]
    );
    return rows;
  }

  const { rows } = await pool.query(`${baseQuery} ORDER BY created_at DESC;`);
  return rows;
};

const getLocationLogsByToken = async (token) => {
  const query = `
    SELECT id, token, latitude, longitude, accuracy, ip_address, user_agent, created_at
    FROM location_logs
    WHERE token = $1
    ORDER BY created_at DESC;
  `;

  const { rows } = await pool.query(query, [token]);
  return rows;
};

module.exports = {
  insertLocationLog,
  getAllLocationLogs,
  getLocationLogsByToken,
};
