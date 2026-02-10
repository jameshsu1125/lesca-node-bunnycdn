function P(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var F = { exports: {} }, r = F.exports = {}, u, f;
function b() {
  throw new Error("setTimeout has not been defined");
}
function E() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? u = setTimeout : u = b;
  } catch {
    u = b;
  }
  try {
    typeof clearTimeout == "function" ? f = clearTimeout : f = E;
  } catch {
    f = E;
  }
})();
function O(e) {
  if (u === setTimeout)
    return setTimeout(e, 0);
  if ((u === b || !u) && setTimeout)
    return u = setTimeout, setTimeout(e, 0);
  try {
    return u(e, 0);
  } catch {
    try {
      return u.call(null, e, 0);
    } catch {
      return u.call(this, e, 0);
    }
  }
}
function B(e) {
  if (f === clearTimeout)
    return clearTimeout(e);
  if ((f === E || !f) && clearTimeout)
    return f = clearTimeout, clearTimeout(e);
  try {
    return f(e);
  } catch {
    try {
      return f.call(null, e);
    } catch {
      return f.call(this, e);
    }
  }
}
var m = [], $ = !1, g, v = -1;
function C() {
  !$ || !g || ($ = !1, g.length ? m = g.concat(m) : v = -1, m.length && _());
}
function _() {
  if (!$) {
    var e = O(C);
    $ = !0;
    for (var t = m.length; t; ) {
      for (g = m, m = []; ++v < t; )
        g && g[v].run();
      v = -1, t = m.length;
    }
    g = null, $ = !1, B(e);
  }
}
r.nextTick = function(e) {
  var t = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var n = 1; n < arguments.length; n++)
      t[n - 1] = arguments[n];
  m.push(new S(e, t)), m.length === 1 && !$ && O(_);
};
function S(e, t) {
  this.fun = e, this.array = t;
}
S.prototype.run = function() {
  this.fun.apply(null, this.array);
};
r.title = "browser";
r.browser = !0;
r.env = {};
r.argv = [];
r.version = "";
r.versions = {};
function d() {
}
r.on = d;
r.addListener = d;
r.once = d;
r.off = d;
r.removeListener = d;
r.removeAllListeners = d;
r.emit = d;
r.prependListener = d;
r.prependOnceListener = d;
r.listeners = function(e) {
  return [];
};
r.binding = function(e) {
  throw new Error("process.binding is not supported");
};
r.cwd = function() {
  return "/";
};
r.chdir = function(e) {
  throw new Error("process.chdir is not supported");
};
r.umask = function() {
  return 0;
};
var H = F.exports;
const h = /* @__PURE__ */ P(H), U = (e = {}) => ({
  region: e.region || h.env.BUNNY_REGION || "SG",
  baseHostName: "storage.bunnycdn.com",
  folderName: e.folderName || h.env.BUNNY_FOLDER_NAME || "",
  storageZone: e.storageZone || h.env.BUNNY_STORAGE_ZONE || "unset",
  password: e.password || h.env.BUNNY_PASSWORD || "unset"
}), R = ({ storageZone: e, password: t, region: n, folderName: c }) => {
  e && (h.env.BUNNY_STORAGE_ZONE = e), t && (h.env.BUNNY_PASSWORD = t), n && (h.env.BUNNY_REGION = n), c && (h.env.BUNNY_FOLDER_NAME = c);
}, D = async ({
  file: e,
  buffer: t,
  folder: n,
  format: c,
  ...o
}) => new Promise(
  async (p, l) => {
    try {
      !t && !e && l({ res: !1, message: "No file uploaded" });
      const s = U(o), y = t ? t.length : e.buffer.length, N = s.folderName ? `${s.folderName}/` : "", a = n ? `${n}/` : "", w = c || "jpg", i = `${(/* @__PURE__ */ new Date()).getTime()}.${w}`, T = {
        method: "PUT",
        hostname: s.region ? `${s.region}.${s.baseHostName}` : s.baseHostName,
        port: 443,
        path: `/${s.storageZone}/${N}${a}${i}`,
        headers: {
          AccessKey: s.password,
          "Content-Type": "application/octet-stream",
          "Content-Length": y.toString()
        }
      }, A = await fetch(`https://${T.hostname}${T.path}`, {
        method: "PUT",
        headers: T.headers,
        body: t || e.buffer
      });
      if (A.status === 201) {
        const L = `https://${s.storageZone}.b-cdn.net/${N}${a}${i}`;
        p({ res: !0, message: "upload success", url: L });
      } else
        l({ res: !1, message: "Upload failed", error: await A.text() });
    } catch {
      l({ res: !1, message: "Server error" });
    }
  }
), Y = async ({ folder: e = "", configOverrides: t = {} } = {}) => new Promise((n, c) => {
  try {
    const o = U(t), p = o.region ? `${o.region}.${o.baseHostName}` : o.baseHostName, l = o.folderName ? `${o.folderName}/` : "", s = e ? `${e}/` : "", y = `https://${p}/${o.storageZone}/${l}${s}`, N = { AccessKey: o.password };
    fetch(y, { headers: N }).then((a) => a.json()).then((a) => {
      const w = a.map((i) => {
        const T = `https://${o.storageZone}.b-cdn.net/${l}${s}${i.ObjectName}`;
        return { ...i, Url: T };
      });
      n({ res: !0, message: "List retrieved successfully", files: w });
    }).catch((a) => {
      c({ res: !1, message: "Network error", error: a });
    });
  } catch {
    c({ res: !1, message: "Server error" });
  }
}), Z = ({
  ObjectName: e,
  href: t,
  ...n
}) => new Promise((c, o) => {
  if (!e && !t) {
    o({ res: !1, message: "No file specified for deletion" });
    return;
  }
  try {
    let p = "", l = "";
    if (t) {
      const a = t.split("/").filter((i) => i !== "" && !i.includes("http"));
      if ([...a].pop()?.includes(".") || !1) {
        const i = [...a];
        p = decodeURIComponent(i.pop() || ""), l = i.splice(1, 1).join("/");
      } else
        l = [...a].splice(1, 1).join("/");
    }
    const s = U(n), y = s.region ? `${s.region}.${s.baseHostName}` : s.baseHostName, N = l ? `/${l}` : "";
    fetch(`https://${y}/${s.storageZone}${N}/${p}`, {
      method: "DELETE",
      headers: { AccessKey: s.password }
    }).then((a) => {
      a.status === 200 ? c({ res: !0, message: "File deleted successfully" }) : c({ res: !1, message: "Failed to delete file" });
    }).catch((a) => {
      o({ res: !1, message: "Network error", error: a });
    });
  } catch {
    o({ res: !1, message: "Server error" });
  }
}), x = { install: R, upload: D, list: Y, deleteFile: Z };
export {
  x as default,
  Z as deleteFile,
  R as install,
  Y as list,
  D as upload
};
