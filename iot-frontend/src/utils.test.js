const { describe, it } = require("node:test");
const assert = require("node:assert");
const { formatDevice } = require("./utils");

describe("formatDevice", () => {
  it("formats a device for display", () => {
    const device = { name: "Sensor A", type: "temperature", id: "device-1" };
    assert.strictEqual(formatDevice(device), "Sensor A (temperature) — device-1");
  });
});
