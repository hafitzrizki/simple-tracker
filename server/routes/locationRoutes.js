const express = require('express');
const {
  createLocation,
  listLocations,
  getLocationsByToken,
  exportLocationsCsv,
} = require('../controllers/locationController');

const router = express.Router();

router.post('/location', createLocation);
router.get('/location/export/csv', exportLocationsCsv);
router.get('/location', listLocations);
router.get('/location/:token', getLocationsByToken);

module.exports = router;
