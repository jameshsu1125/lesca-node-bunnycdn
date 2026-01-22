function L(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var O = { exports: {} }, r = O.exports = {}, i, u;
function b() {
  throw new Error("setTimeout has not been defined");
}
function E() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? i = setTimeout : i = b;
  } catch {
    i = b;
  }
  try {
    typeof clearTimeout == "function" ? u = clearTimeout : u = E;
  } catch {
    u = E;
  }
})();
function _(e) {
  if (i === setTimeout)
    return setTimeout(e, 0);
  if ((i === b || !i) && setTimeout)
    return i = setTimeout, setTimeout(e, 0);
  try {
    return i(e, 0);
  } catch {
    try {
      return i.call(null, e, 0);
    } catch {
      return i.call(this, e, 0);
    }
  }
}
function F(e) {
  if (u === clearTimeout)
    return clearTimeout(e);
  if ((u === E || !u) && clearTimeout)
    return u = clearTimeout, clearTimeout(e);
  try {
    return u(e);
  } catch {
    try {
      return u.call(null, e);
    } catch {
      return u.call(this, e);
    }
  }
}
var l = [], N = !1, p, y = -1;
function B() {
  !N || !p || (N = !1, p.length ? l = p.concat(l) : y = -1, l.length && S());
}
function S() {
  if (!N) {
    var e = _(B);
    N = !0;
    for (var t = l.length; t; ) {
      for (p = l, l = []; ++y < t; )
        p && p[y].run();
      y = -1, t = l.length;
    }
    p = null, N = !1, F(e);
  }
}
r.nextTick = function(e) {
  var t = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var n = 1; n < arguments.length; n++)
      t[n - 1] = arguments[n];
  l.push(new A(e, t)), l.length === 1 && !N && _(S);
};
function A(e, t) {
  this.fun = e, this.array = t;
}
A.prototype.run = function() {
  this.fun.apply(null, this.array);
};
r.title = "browser";
r.browser = !0;
r.env = {};
r.argv = [];
r.version = "";
r.versions = {};
function f() {
}
r.on = f;
r.addListener = f;
r.once = f;
r.off = f;
r.removeListener = f;
r.removeAllListeners = f;
r.emit = f;
r.prependListener = f;
r.prependOnceListener = f;
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
var C = O.exports;
const h = /* @__PURE__ */ L(C), U = (e = {}) => ({
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
  ...c
}) => new Promise(
  async (s, a) => {
    try {
      !t && !e && a({ res: !1, message: "No file uploaded" });
      const o = U(c), g = t ? t.length : e.buffer.length, m = o.folderName ? `${o.folderName}/` : "", T = n ? `${n}/` : "", d = `${(/* @__PURE__ */ new Date()).getTime()}.webp`, $ = {
        method: "PUT",
        hostname: o.region ? `${o.region}.${o.baseHostName}` : o.baseHostName,
        port: 443,
        path: `/${o.storageZone}/${m}${T}${d}`,
        headers: {
          AccessKey: o.password,
          "Content-Type": "application/octet-stream",
          "Content-Length": g.toString()
        }
      }, w = await fetch(`https://${$.hostname}${$.path}`, {
        method: "PUT",
        headers: $.headers,
        body: t || e.buffer
      });
      if (w.status === 201) {
        const v = `https://${o.storageZone}.b-cdn.net/${m}${T}${d}`;
        s({ res: !0, message: "upload success", url: v });
      } else
        a({ res: !1, message: "Upload failed", error: await w.text() });
    } catch {
      a({ res: !1, message: "Server error" });
    }
  }
), P = async ({ folder: e = "", configOverrides: t = {} } = {}) => new Promise((n, c) => {
  try {
    const s = U(t), a = s.region ? `${s.region}.${s.baseHostName}` : s.baseHostName, o = s.folderName ? `${s.folderName}/` : "", g = e ? `${e}/` : "", m = `https://${a}/${s.storageZone}/${o}${g}`, T = { AccessKey: s.password };
    fetch(m, { headers: T }).then((d) => d.json()).then((d) => {
      const $ = d.map((w) => {
        const v = `https://${s.storageZone}.b-cdn.net/${o}${g}${w.ObjectName}`;
        return { ...w, Url: v };
      });
      n({ res: !0, message: "List retrieved successfully", files: $ });
    }).catch((d) => {
      c({ res: !1, message: "Network error", error: d });
    });
  } catch {
    c({ res: !1, message: "Server error" });
  }
}), Y = ({
  ObjectName: e,
  href: t,
  ...n
}) => new Promise((c, s) => {
  if (!e && !t) {
    s({ res: !1, message: "No file specified for deletion" });
    return;
  }
  try {
    const a = U(n), o = a.region ? `${a.region}.${a.baseHostName}` : a.baseHostName, g = t ? decodeURIComponent(t.split("/")[t.split("/").length - 1]) : e;
    fetch(`https://${o}/${a.storageZone}/${a.folderName}/${g}`, {
      method: "DELETE",
      headers: { AccessKey: a.password }
    }).then((m) => {
      m.status === 200 ? c({ res: !0, message: "File deleted successfully" }) : c({ res: !1, message: "Failed to delete file" });
    }).catch((m) => {
      s({ res: !1, message: "Network error", error: m });
    });
  } catch {
    s({ res: !1, message: "Server error" });
  }
}), Z = { install: R, upload: D, list: P, deleteFile: Y };
export {
  Z as default,
  Y as deleteFile,
  R as install,
  P as list,
  D as upload
};
