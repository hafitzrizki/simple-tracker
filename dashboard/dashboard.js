(() => {
  const tokenInput = document.getElementById('tokenFilter');
  const applyBtn = document.getElementById('applyFilter');
  const tbody = document.getElementById('logsBody');
  const exportLink = document.getElementById('exportCsv');

  const escapeHtml = (value) =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  const renderRows = (logs) => {
    if (!logs.length) {
      tbody.innerHTML = '<tr><td colspan="7">No location logs found.</td></tr>';
      return;
    }

    tbody.innerHTML = logs
      .map(
        (log) => `
          <tr>
            <td>${new Date(log.created_at).toLocaleString()}</td>
            <td>${escapeHtml(log.token)}</td>
            <td>${Number(log.latitude).toFixed(6)}</td>
            <td>${Number(log.longitude).toFixed(6)}</td>
            <td>${Number(log.accuracy).toFixed(2)}</td>
            <td>${escapeHtml(log.ip_address || '')}</td>
            <td>${escapeHtml(log.user_agent || '')}</td>
          </tr>
        `
      )
      .join('');
  };

  const loadLogs = async () => {
    const token = tokenInput.value.trim();
    const params = new URLSearchParams();

    if (token) {
      params.set('token', token);
      exportLink.href = `/api/location/export/csv?${params.toString()}`;
    } else {
      exportLink.href = '/api/location/export/csv';
    }

    const endpoint = `/api/location${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const res = await fetch(endpoint);
      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error || 'Failed to fetch location logs.');
      }

      renderRows(body.data || []);
    } catch (error) {
      tbody.innerHTML = `<tr><td colspan="7">${escapeHtml(error.message)}</td></tr>`;
    }
  };

  applyBtn.addEventListener('click', loadLogs);
  loadLogs();
})();
