// node_modules/vite-plugin-node-polyfills/shims/process/dist/index.js
function e(e) {
	return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var t = { exports: {} }, n = t.exports = {}, r, i;
function a() {
	throw Error("setTimeout has not been defined");
}
function o() {
	throw Error("clearTimeout has not been defined");
}
(function() {
	try {
		r = typeof setTimeout == "function" ? setTimeout : a;
	} catch {
		r = a;
	}
	try {
		i = typeof clearTimeout == "function" ? clearTimeout : o;
	} catch {
		i = o;
	}
})();
function s(e) {
	if (r === setTimeout) return setTimeout(e, 0);
	if ((r === a || !r) && setTimeout) return r = setTimeout, setTimeout(e, 0);
	try {
		return r(e, 0);
	} catch {
		try {
			return r.call(null, e, 0);
		} catch {
			return r.call(this, e, 0);
		}
	}
}
function c(e) {
	if (i === clearTimeout) return clearTimeout(e);
	if ((i === o || !i) && clearTimeout) return i = clearTimeout, clearTimeout(e);
	try {
		return i(e);
	} catch {
		try {
			return i.call(null, e);
		} catch {
			return i.call(this, e);
		}
	}
}
var l = [], u = !1, d, f = -1;
function p() {
	u && d && (u = !1, d.length ? l = d.concat(l) : f = -1, l.length && m());
}
function m() {
	if (!u) {
		var e = s(p);
		u = !0;
		for (var t = l.length; t;) {
			for (d = l, l = []; ++f < t;) d && d[f].run();
			f = -1, t = l.length;
		}
		d = null, u = !1, c(e);
	}
}
n.nextTick = function(e) {
	var t = Array(arguments.length - 1);
	if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
	l.push(new h(e, t)), l.length === 1 && !u && s(m);
};
function h(e, t) {
	this.fun = e, this.array = t;
}
h.prototype.run = function() {
	this.fun.apply(null, this.array);
}, n.title = "browser", n.browser = !0, n.env = {}, n.argv = [], n.version = "", n.versions = {};
function g() {}
n.on = g, n.addListener = g, n.once = g, n.off = g, n.removeListener = g, n.removeAllListeners = g, n.emit = g, n.prependListener = g, n.prependOnceListener = g, n.listeners = function(e) {
	return [];
}, n.binding = function(e) {
	throw Error("process.binding is not supported");
}, n.cwd = function() {
	return "/";
}, n.chdir = function(e) {
	throw Error("process.chdir is not supported");
}, n.umask = function() {
	return 0;
};
var _ = t.exports, v = /*@__PURE__*/ e(_), y = (e = {}) => ({
	region: e.region || v.env.BUNNY_REGION || "SG",
	baseHostName: "storage.bunnycdn.com",
	folderName: e.folderName || v.env.BUNNY_FOLDER_NAME || "",
	storageZone: e.storageZone || v.env.BUNNY_STORAGE_ZONE || "unset",
	password: e.password || v.env.BUNNY_PASSWORD || "unset"
}), b = ({ storageZone: e, password: t, region: n, folderName: r }) => {
	e && (v.env.BUNNY_STORAGE_ZONE = e), t && (v.env.BUNNY_PASSWORD = t), n && (v.env.BUNNY_REGION = n), r && (v.env.BUNNY_FOLDER_NAME = r);
}, x = (e = 8) => {
	let t = new Uint8Array(Math.ceil(e / 2));
	return globalThis.crypto?.getRandomValues ? globalThis.crypto.getRandomValues(t) : t.forEach((e, n) => t[n] = Math.floor(Math.random() * 256)), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("").slice(0, e);
}, S = async ({ file: e, buffer: t, folder: n, format: r, ...i }) => {
	let a = t || e?.buffer;
	if (!a) throw {
		res: !1,
		message: "No file uploaded"
	};
	try {
		let e = y(i), t = e.folderName ? `${e.folderName}/` : "", o = n ? `${n}/` : "", s = r || "jpg", c = `${(/* @__PURE__ */ new Date()).getTime()}-${x()}.${s}`, l = e.region ? `${e.region}.${e.baseHostName}` : e.baseHostName, u = await fetch(`https://${l}/${e.storageZone}/${t}${o}${c}`, {
			method: "PUT",
			headers: {
				AccessKey: e.password,
				"Content-Type": "application/octet-stream",
				"Content-Length": a.length.toString()
			},
			body: a
		});
		if (u.status === 201) return {
			res: !0,
			message: "upload success",
			url: `https://${e.storageZone}.b-cdn.net/${t}${o}${c}`
		};
		throw {
			res: !1,
			message: "Upload failed",
			error: await u.text()
		};
	} catch (e) {
		throw typeof e == "object" && e && "res" in e ? e : {
			res: !1,
			message: "Server error"
		};
	}
}, C = async ({ folder: e = "", configOverrides: t = {} } = {}) => new Promise((n, r) => {
	try {
		let i = y(t), a = i.region ? `${i.region}.${i.baseHostName}` : i.baseHostName, o = i.folderName ? `${i.folderName}/` : "", s = e ? `${e}/` : "", c = `https://${a}/${i.storageZone}/${o}${s}`, l = { AccessKey: i.password };
		fetch(c, { headers: l }).then((e) => e.json()).then((e) => {
			n({
				res: !0,
				message: "List retrieved successfully",
				files: e.map((e) => {
					let t = `https://${i.storageZone}.b-cdn.net/${o}${s}${e.ObjectName}`;
					return {
						...e,
						Url: t
					};
				})
			});
		}).catch((e) => {
			r({
				res: !1,
				message: "Network error",
				error: e
			});
		});
	} catch {
		r({
			res: !1,
			message: "Server error"
		});
	}
}), w = ({ ObjectName: e, href: t, ...n }) => new Promise((r, i) => {
	if (!e && !t) i({
		res: !1,
		message: "No file specified for deletion"
	});
	else try {
		let e = "", a = "";
		if (t) {
			let n = t.split("/").filter((e) => e !== "" && !e.includes("http"));
			if ([...n].pop()?.includes(".")) {
				let t = [...n];
				e = decodeURIComponent(t.pop() || ""), a = t.splice(1, 1).join("/");
			} else a = [...n].splice(1, 1).join("/");
		}
		let o = y(n), s = o.region ? `${o.region}.${o.baseHostName}` : o.baseHostName, c = a ? `/${a}` : "";
		fetch(`https://${s}/${o.storageZone}${c}/${e}`, {
			method: "DELETE",
			headers: { AccessKey: o.password }
		}).then((e) => {
			e.status === 200 ? r({
				res: !0,
				message: "File deleted successfully"
			}) : r({
				res: !1,
				message: "Failed to delete file"
			});
		}).catch((e) => {
			i({
				res: !1,
				message: "Network error",
				error: e
			});
		});
	} catch {
		i({
			res: !1,
			message: "Server error"
		});
	}
}), T = {
	install: b,
	upload: S,
	list: C,
	deleteFile: w
};
export { T as default, w as deleteFile, b as install, C as list, S as upload };
