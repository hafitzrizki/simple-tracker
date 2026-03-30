(() => {
  const statusEl = document.getElementById('status');

  const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };

  const setStatus = (message) => {
    statusEl.textContent = message;
  };

  const token = window.location.pathname.split('/').filter(Boolean).pop();

  if (!token) {
    setStatus('Invalid tracking link. Missing token.');
    return;
  }

  if (!navigator.geolocation) {
    setStatus('Geolocation is not supported by this browser.');
    return;
  }

  const onSuccess = async (position) => {
    setStatus('Location received. Saving now…');

    const payload = {
      token,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date(position.timestamp).toISOString(),
    };

    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to store location.');
      }

      const params = new URLSearchParams({
        lat: String(payload.latitude),
        lng: String(payload.longitude),
        acc: String(payload.accuracy),
        token,
      });

      window.location.assign(`/success?${params.toString()}`);
    } catch (error) {
      setStatus(`Failed to save location: ${error.message}`);
    }
  };

  const onError = (error) => {
    const messages = {
      1: 'Permission denied. Please allow location access and retry.',
      2: 'Location unavailable. Please retry.',
      3: 'Location request timed out. Please retry.',
    };

    setStatus(messages[error.code] || 'Unable to get your location.');
  };

  navigator.geolocation.getCurrentPosition(onSuccess, onError, geolocationOptions);
})();
