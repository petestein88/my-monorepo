const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert");
const { devices, handleRequest } = require("./index");
const http = require("http");

function createMockReq(method, url, body) {
  const { Readable } = require("stream");
  const req = new Readable({ read() {} });
  req.method = method;
  req.url = url;
  if (body) {
    process.nextTick(() => {
      req.push(JSON.stringify(body));
      req.push(null);
    });
  }
  return req;
}

function createMockRes() {
  let statusCode;
  let headers = {};
  let data = "";
  return {
    setHeader(key, val) { headers[key] = val; },
    writeHead(code) { statusCode = code; },
    end(chunk) { data = chunk || ""; },
    get statusCode() { return statusCode; },
    get data() { return data; },
  };
}

describe("IoT backend", () => {
  beforeEach(() => {
    devices.clear();
  });

  it("returns health status", () => {
    const req = createMockReq("GET", "/api/health");
    const res = createMockRes();
    handleRequest(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(JSON.parse(res.data), { status: "ok" });
  });

  it("returns empty device list initially", () => {
    const req = createMockReq("GET", "/api/devices");
    const res = createMockRes();
    handleRequest(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(JSON.parse(res.data), []);
  });

  it("returns 404 for unknown routes", () => {
    const req = createMockReq("GET", "/unknown");
    const res = createMockRes();
    handleRequest(req, res);
    assert.strictEqual(res.statusCode, 404);
  });
});
