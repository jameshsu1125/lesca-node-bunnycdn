function S(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var A = { exports: {} }, r = A.exports = {}, u, f;
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
function L(e) {
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
var d = [], w = !1, g, T = -1;
function P() {
  !w || !g || (w = !1, g.length ? d = g.concat(d) : T = -1, d.length && _());
}
function _() {
  if (!w) {
    var e = O(P);
    w = !0;
    for (var t = d.length; t; ) {
      for (g = d, d = []; ++T < t; )
        g && g[T].run();
      T = -1, t = d.length;
    }
    g = null, w = !1, L(e);
  }
}
r.nextTick = function(e) {
  var t = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var n = 1; n < arguments.length; n++)
      t[n - 1] = arguments[n];
  d.push(new F(e, t)), d.length === 1 && !w && O(_);
};
function F(e, t) {
  this.fun = e, this.array = t;
}
F.prototype.run = function() {
  this.fun.apply(null, this.array);
};
r.title = "browser";
r.browser = !0;
r.env = {};
r.argv = [];
r.version = "";
r.versions = {};
function h() {
}
r.on = h;
r.addListener = h;
r.once = h;
r.off = h;
r.removeListener = h;
r.removeAllListeners = h;
r.emit = h;
r.prependListener = h;
r.prependOnceListener = h;
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
var B = A.exports;
const p = /* @__PURE__ */ S(B), U = (e = {}) => ({
  region: e.region || p.env.BUNNY_REGION || "SG",
  baseHostName: "storage.bunnycdn.com",
  folderName: e.folderName || p.env.BUNNY_FOLDER_NAME || "",
  storageZone: e.storageZone || p.env.BUNNY_STORAGE_ZONE || "unset",
  password: e.password || p.env.BUNNY_PASSWORD || "unset"
}), C = ({ storageZone: e, password: t, region: n, folderName: l }) => {
  e && (p.env.BUNNY_STORAGE_ZONE = e), t && (p.env.BUNNY_PASSWORD = t), n && (p.env.BUNNY_REGION = n), l && (p.env.BUNNY_FOLDER_NAME = l);
}, H = async ({
  file: e,
  buffer: t,
  folder: n,
  ...l
}) => new Promise(
  async (o, m) => {
    try {
      !t && !e && m({ res: !1, message: "No file uploaded" });
      const s = U(l), c = t ? t.length : e.buffer.length, N = s.folderName ? `${s.folderName}/` : "", $ = n ? `${n}/` : "", a = `${(/* @__PURE__ */ new Date()).getTime()}.webp`, y = {
        method: "PUT",
        hostname: s.region ? `${s.region}.${s.baseHostName}` : s.baseHostName,
        port: 443,
        path: `/${s.storageZone}/${N}${$}${a}`,
        headers: {
          AccessKey: s.password,
          "Content-Type": "application/octet-stream",
          "Content-Length": c.toString()
        }
      }, i = await fetch(`https://${y.hostname}${y.path}`, {
        method: "PUT",
        headers: y.headers,
        body: t || e.buffer
      });
      if (i.status === 201) {
        const v = `https://${s.storageZone}.b-cdn.net/${N}${$}${a}`;
        o({ res: !0, message: "upload success", url: v });
      } else
        m({ res: !1, message: "Upload failed", error: await i.text() });
    } catch {
      m({ res: !1, message: "Server error" });
    }
  }
), R = async ({ folder: e = "", configOverrides: t = {} } = {}) => new Promise((n, l) => {
  try {
    const o = U(t), m = o.region ? `${o.region}.${o.baseHostName}` : o.baseHostName, s = o.folderName ? `${o.folderName}/` : "", c = e ? `${e}/` : "", N = `https://${m}/${o.storageZone}/${s}${c}`, $ = { AccessKey: o.password };
    fetch(N, { headers: $ }).then((a) => a.json()).then((a) => {
      const y = a.map((i) => {
        const v = `https://${o.storageZone}.b-cdn.net/${s}${c}${i.ObjectName}`;
        return { ...i, Url: v };
      });
      n({ res: !0, message: "List retrieved successfully", files: y });
    }).catch((a) => {
      l({ res: !1, message: "Network error", error: a });
    });
  } catch {
    l({ res: !1, message: "Server error" });
  }
}), D = ({
  ObjectName: e,
  href: t,
  ...n
}) => new Promise((l, o) => {
  if (!e && !t) {
    o({ res: !1, message: "No file specified for deletion" });
    return;
  }
  try {
    let m = "", s = "";
    if (t) {
      const a = t.split("/").filter((i) => i !== "" && !i.includes("http"));
      if ([...a].pop()?.includes(".") || !1) {
        const i = [...a];
        m = decodeURIComponent(i.pop() || ""), s = i.splice(1, 1).join("/");
      } else
        s = [...a].splice(1, 1).join("/");
    }
    const c = U(n), N = c.region ? `${c.region}.${c.baseHostName}` : c.baseHostName, $ = s ? `/${s}` : "";
    fetch(`https://${N}/${c.storageZone}${$}/${m}`, {
      method: "DELETE",
      headers: { AccessKey: c.password }
    }).then((a) => {
      a.status === 200 ? l({ res: !0, message: "File deleted successfully" }) : l({ res: !1, message: "Failed to delete file" });
    }).catch((a) => {
      o({ res: !1, message: "Network error", error: a });
    });
  } catch {
    o({ res: !1, message: "Server error" });
  }
}), Y = { install: C, upload: H, list: R, deleteFile: D };
export {
  Y as default,
  D as deleteFile,
  C as install,
  R as list,
  H as upload
};
