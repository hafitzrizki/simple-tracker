(() => {
  const tokenInput = document.getElementById('tokenFilter');
  const applyBtn = document.getElementById('applyFilter');

  const map = L.map('dashboard-map').setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  let markersLayer = L.layerGroup().addTo(map);

  const loadMapLogs = async () => {
    const token = tokenInput.value.trim();
    const params = new URLSearchParams();

    if (token) {
      params.set('token', token);
    }

    const endpoint = `/api/location${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const res = await fetch(endpoint);
      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error || 'Failed to fetch locations.');
      }

      const logs = body.data || [];
      markersLayer.clearLayers();

      if (!logs.length) {
        return;
      }

      const latLngs = [];

      logs.forEach((log) => {
        const lat = Number(log.latitude);
        const lng = Number(log.longitude);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        latLngs.push([lat, lng]);

        const popup = `
          <strong>Token:</strong> ${log.token}<br>
          <strong>Time:</strong> ${new Date(log.created_at).toLocaleString()}<br>
          <strong>Accuracy:</strong> ${Number(log.accuracy).toFixed(2)}m
        `;

        L.marker([lat, lng]).bindPopup(popup).addTo(markersLayer);
      });

      if (latLngs.length === 1) {
        map.setView(latLngs[0], 13);
      } else if (latLngs.length > 1) {
        map.fitBounds(latLngs, { padding: [30, 30] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  applyBtn.addEventListener('click', loadMapLogs);
  loadMapLogs();
})();
