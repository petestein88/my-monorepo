/**
 * Format a device object for display.
 * @param {{ name: string, type: string, id: string }} device
 * @returns {string}
 */
function formatDevice(device) {
  return `${device.name} (${device.type}) — ${device.id}`;
}

module.exports = { formatDevice };
