const path = require('path');
const { validateToken } = require('./locationController');

const renderTrackingPage = (req, res) => {
  const { token } = req.params;

  if (!validateToken(token)) {
    return res.status(400).send('Invalid tracking token.');
  }

  return res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
};

module.exports = {
  renderTrackingPage,
};
