(() => {
  const params = new URLSearchParams(window.location.search);
  const lat = Number(params.get('lat'));
  const lng = Number(params.get('lng'));
  const accuracy = Number(params.get('acc'));
  const token = params.get('token') || 'N/A';

  const detailsEl = document.getElementById('details');

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    detailsEl.textContent = 'Location details not found.';
    return;
  }

  detailsEl.textContent = `Token: ${token} · Lat: ${lat.toFixed(6)} · Lng: ${lng.toFixed(
    6
  )} · Accuracy: ${accuracy.toFixed(2)}m`;

  const map = L.map('success-map').setView([lat, lng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`Captured location for token: ${token}`)
    .openPopup();

  if (Number.isFinite(accuracy)) {
    L.circle([lat, lng], {
      radius: accuracy,
      color: '#2563eb',
      fillOpacity: 0.12,
    }).addTo(map);
  }
})();
