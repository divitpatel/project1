/* jstz.min.js Version: 1.0.6 */
!function (e) { var a = function () { "use strict"; var e = "s", s = { DAY: 864e5, HOUR: 36e5, MINUTE: 6e4, SECOND: 1e3, BASELINE_YEAR: 2014, MAX_SCORE: 864e6, AMBIGUITIES: { "America/Denver": ["America/Mazatlan"], "Europe/London": ["Africa/Casablanca"], "America/Chicago": ["America/Mexico_City"], "America/Asuncion": ["America/Campo_Grande", "America/Santiago"], "America/Montevideo": ["America/Sao_Paulo", "America/Santiago"], "Asia/Beirut": ["Asia/Amman", "Asia/Jerusalem", "Europe/Helsinki", "Asia/Damascus", "Africa/Cairo", "Asia/Gaza", "Europe/Minsk"], "Pacific/Auckland": ["Pacific/Fiji"], "America/Los_Angeles": ["America/Santa_Isabel"], "America/New_York": ["America/Havana"], "America/Halifax": ["America/Goose_Bay"], "America/Godthab": ["America/Miquelon"], "Asia/Dubai": ["Asia/Yerevan"], "Asia/Jakarta": ["Asia/Krasnoyarsk"], "Asia/Shanghai": ["Asia/Irkutsk", "Australia/Perth"], "Australia/Sydney": ["Australia/Lord_Howe"], "Asia/Tokyo": ["Asia/Yakutsk"], "Asia/Dhaka": ["Asia/Omsk"], "Asia/Baku": ["Asia/Yerevan"], "Australia/Brisbane": ["Asia/Vladivostok"], "Pacific/Noumea": ["Asia/Vladivostok"], "Pacific/Majuro": ["Asia/Kamchatka", "Pacific/Fiji"], "Pacific/Tongatapu": ["Pacific/Apia"], "Asia/Baghdad": ["Europe/Minsk", "Europe/Moscow"], "Asia/Karachi": ["Asia/Yekaterinburg"], "Africa/Johannesburg": ["Asia/Gaza", "Africa/Cairo"] } }, i = function (e) { var a = -e.getTimezoneOffset(); return null !== a ? a : 0 }, r = function () { var a = i(new Date(s.BASELINE_YEAR, 0, 2)), r = i(new Date(s.BASELINE_YEAR, 5, 2)), n = a - r; return 0 > n ? a + ",1" : n > 0 ? r + ",1," + e : a + ",0" }, n = function () { var e, a; if ("undefined" != typeof Intl && "undefined" != typeof Intl.DateTimeFormat && (e = Intl.DateTimeFormat(), "undefined" != typeof e && "undefined" != typeof e.resolvedOptions)) return a = e.resolvedOptions().timeZone, a && (a.indexOf("/") > -1 || "UTC" === a) ? a : void 0 }, o = function (e) { for (var a = new Date(e, 0, 1, 0, 0, 1, 0).getTime(), s = new Date(e, 12, 31, 23, 59, 59).getTime(), i = a, r = new Date(i).getTimezoneOffset(), n = null, o = null; s - 864e5 > i;) { var t = new Date(i), A = t.getTimezoneOffset(); A !== r && (r > A && (n = t), A > r && (o = t), r = A), i += 864e5 } return n && o ? { s: u(n).getTime(), e: u(o).getTime() } : !1 }, u = function l(e, a, i) { "undefined" == typeof a && (a = s.DAY, i = s.HOUR); for (var r = new Date(e.getTime() - a).getTime(), n = e.getTime() + a, o = new Date(r).getTimezoneOffset(), u = r, t = null; n - i > u;) { var A = new Date(u), c = A.getTimezoneOffset(); if (c !== o) { t = A; break } u += i } return a === s.DAY ? l(t, s.HOUR, s.MINUTE) : a === s.HOUR ? l(t, s.MINUTE, s.SECOND) : t }, t = function (e, a, s, i) { if ("N/A" !== s) return s; if ("Asia/Beirut" === a) { if ("Africa/Cairo" === i.name && 13983768e5 === e[6].s && 14116788e5 === e[6].e) return 0; if ("Asia/Jerusalem" === i.name && 13959648e5 === e[6].s && 14118588e5 === e[6].e) return 0 } else if ("America/Santiago" === a) { if ("America/Asuncion" === i.name && 14124816e5 === e[6].s && 1397358e6 === e[6].e) return 0; if ("America/Campo_Grande" === i.name && 14136912e5 === e[6].s && 13925196e5 === e[6].e) return 0 } else if ("America/Montevideo" === a) { if ("America/Sao_Paulo" === i.name && 14136876e5 === e[6].s && 1392516e6 === e[6].e) return 0 } else if ("Pacific/Auckland" === a && "Pacific/Fiji" === i.name && 14142456e5 === e[6].s && 13961016e5 === e[6].e) return 0; return s }, A = function (e, i) { for (var r = function (a) { for (var r = 0, n = 0; n < e.length; n++) if (a.rules[n] && e[n]) { if (!(e[n].s >= a.rules[n].s && e[n].e <= a.rules[n].e)) { r = "N/A"; break } if (r = 0, r += Math.abs(e[n].s - a.rules[n].s), r += Math.abs(a.rules[n].e - e[n].e), r > s.MAX_SCORE) { r = "N/A"; break } } return r = t(e, i, r, a) }, n = {}, o = a.olson.dst_rules.zones, u = o.length, A = s.AMBIGUITIES[i], c = 0; u > c; c++) { var m = o[c], l = r(o[c]); "N/A" !== l && (n[m.name] = l) } for (var f in n) if (n.hasOwnProperty(f)) for (var d = 0; d < A.length; d++) if (A[d] === f) return f; return i }, c = function (e) { var s = function () { for (var e = [], s = 0; s < a.olson.dst_rules.years.length; s++) { var i = o(a.olson.dst_rules.years[s]); e.push(i) } return e }, i = function (e) { for (var a = 0; a < e.length; a++) if (e[a] !== !1) return !0; return !1 }, r = s(), n = i(r); return n ? A(r, e) : e }, m = function () { var e = n(); return e || (e = a.olson.timezones[r()], "undefined" != typeof s.AMBIGUITIES[e] && (e = c(e))), { name: function () { return e } } }; return { determine: m } }(); a.olson = a.olson || {}, a.olson.timezones = { "-720,0": "Etc/GMT+12", "-660,0": "Pacific/Pago_Pago", "-660,1,s": "Pacific/Apia", "-600,1": "America/Adak", "-600,0": "Pacific/Honolulu", "-570,0": "Pacific/Marquesas", "-540,0": "Pacific/Gambier", "-540,1": "America/Anchorage", "-480,1": "America/Los_Angeles", "-480,0": "Pacific/Pitcairn", "-420,0": "America/Phoenix", "-420,1": "America/Denver", "-360,0": "America/Guatemala", "-360,1": "America/Chicago", "-360,1,s": "Pacific/Easter", "-300,0": "America/Bogota", "-300,1": "America/New_York", "-270,0": "America/Caracas", "-240,1": "America/Halifax", "-240,0": "America/Santo_Domingo", "-240,1,s": "America/Asuncion", "-210,1": "America/St_Johns", "-180,1": "America/Godthab", "-180,0": "America/Argentina/Buenos_Aires", "-180,1,s": "America/Montevideo", "-120,0": "America/Noronha", "-120,1": "America/Noronha", "-60,1": "Atlantic/Azores", "-60,0": "Atlantic/Cape_Verde", "0,0": "UTC", "0,1": "Europe/London", "60,1": "Europe/Berlin", "60,0": "Africa/Lagos", "60,1,s": "Africa/Windhoek", "120,1": "Asia/Beirut", "120,0": "Africa/Johannesburg", "180,0": "Asia/Baghdad", "180,1": "Europe/Moscow", "210,1": "Asia/Tehran", "240,0": "Asia/Dubai", "240,1": "Asia/Baku", "270,0": "Asia/Kabul", "300,1": "Asia/Yekaterinburg", "300,0": "Asia/Karachi", "330,0": "Asia/Kolkata", "345,0": "Asia/Kathmandu", "360,0": "Asia/Dhaka", "360,1": "Asia/Omsk", "390,0": "Asia/Rangoon", "420,1": "Asia/Krasnoyarsk", "420,0": "Asia/Jakarta", "480,0": "Asia/Shanghai", "480,1": "Asia/Irkutsk", "525,0": "Australia/Eucla", "525,1,s": "Australia/Eucla", "540,1": "Asia/Yakutsk", "540,0": "Asia/Tokyo", "570,0": "Australia/Darwin", "570,1,s": "Australia/Adelaide", "600,0": "Australia/Brisbane", "600,1": "Asia/Vladivostok", "600,1,s": "Australia/Sydney", "630,1,s": "Australia/Lord_Howe", "660,1": "Asia/Kamchatka", "660,0": "Pacific/Noumea", "690,0": "Pacific/Norfolk", "720,1,s": "Pacific/Auckland", "720,0": "Pacific/Majuro", "765,1,s": "Pacific/Chatham", "780,0": "Pacific/Tongatapu", "780,1,s": "Pacific/Apia", "840,0": "Pacific/Kiritimati" }, a.olson.dst_rules = { years: [2008, 2009, 2010, 2011, 2012, 2013, 2014], zones: [{ name: "Africa/Cairo", rules: [{ e: 12199572e5, s: 12090744e5 }, { e: 1250802e6, s: 1240524e6 }, { e: 12858804e5, s: 12840696e5 }, !1, !1, !1, { e: 14116788e5, s: 1406844e6 }] }, { name: "Africa/Casablanca", rules: [{ e: 12202236e5, s: 12122784e5 }, { e: 12508092e5, s: 12438144e5 }, { e: 1281222e6, s: 12727584e5 }, { e: 13120668e5, s: 13017888e5 }, { e: 13489704e5, s: 1345428e6 }, { e: 13828392e5, s: 13761e8 }, { e: 14142888e5, s: 14069448e5 }] }, { name: "America/Asuncion", rules: [{ e: 12050316e5, s: 12243888e5 }, { e: 12364812e5, s: 12558384e5 }, { e: 12709548e5, s: 12860784e5 }, { e: 13024044e5, s: 1317528e6 }, { e: 1333854e6, s: 13495824e5 }, { e: 1364094e6, s: 1381032e6 }, { e: 13955436e5, s: 14124816e5 }] }, { name: "America/Campo_Grande", rules: [{ e: 12032172e5, s: 12243888e5 }, { e: 12346668e5, s: 12558384e5 }, { e: 12667212e5, s: 1287288e6 }, { e: 12981708e5, s: 13187376e5 }, { e: 13302252e5, s: 1350792e6 }, { e: 136107e7, s: 13822416e5 }, { e: 13925196e5, s: 14136912e5 }] }, { name: "America/Goose_Bay", rules: [{ e: 122559486e4, s: 120503526e4 }, { e: 125704446e4, s: 123648486e4 }, { e: 128909886e4, s: 126853926e4 }, { e: 13205556e5, s: 129998886e4 }, { e: 13520052e5, s: 13314456e5 }, { e: 13834548e5, s: 13628952e5 }, { e: 14149044e5, s: 13943448e5 }] }, { name: "America/Havana", rules: [{ e: 12249972e5, s: 12056436e5 }, { e: 12564468e5, s: 12364884e5 }, { e: 12885012e5, s: 12685428e5 }, { e: 13211604e5, s: 13005972e5 }, { e: 13520052e5, s: 13332564e5 }, { e: 13834548e5, s: 13628916e5 }, { e: 14149044e5, s: 13943412e5 }] }, { name: "America/Mazatlan", rules: [{ e: 1225008e6, s: 12074724e5 }, { e: 12564576e5, s: 1238922e6 }, { e: 1288512e6, s: 12703716e5 }, { e: 13199616e5, s: 13018212e5 }, { e: 13514112e5, s: 13332708e5 }, { e: 13828608e5, s: 13653252e5 }, { e: 14143104e5, s: 13967748e5 }] }, { name: "America/Mexico_City", rules: [{ e: 12250044e5, s: 12074688e5 }, { e: 1256454e6, s: 12389184e5 }, { e: 12885084e5, s: 1270368e6 }, { e: 1319958e6, s: 13018176e5 }, { e: 13514076e5, s: 13332672e5 }, { e: 13828572e5, s: 13653216e5 }, { e: 14143068e5, s: 13967712e5 }] }, { name: "America/Miquelon", rules: [{ e: 12255984e5, s: 12050388e5 }, { e: 1257048e6, s: 12364884e5 }, { e: 12891024e5, s: 12685428e5 }, { e: 1320552e6, s: 12999924e5 }, { e: 13520016e5, s: 1331442e6 }, { e: 13834512e5, s: 13628916e5 }, { e: 14149008e5, s: 13943412e5 }] }, { name: "America/Santa_Isabel", rules: [{ e: 12250116e5, s: 1207476e6 }, { e: 12564612e5, s: 12389256e5 }, { e: 12885156e5, s: 12703752e5 }, { e: 13199652e5, s: 13018248e5 }, { e: 13514148e5, s: 13332744e5 }, { e: 13828644e5, s: 13653288e5 }, { e: 1414314e6, s: 13967784e5 }] }, { name: "America/Santiago", rules: [{ e: 1206846e6, s: 1223784e6 }, { e: 1237086e6, s: 12552336e5 }, { e: 127035e7, s: 12866832e5 }, { e: 13048236e5, s: 13138992e5 }, { e: 13356684e5, s: 13465584e5 }, { e: 1367118e6, s: 13786128e5 }, { e: 13985676e5, s: 14100624e5 }] }, { name: "America/Sao_Paulo", rules: [{ e: 12032136e5, s: 12243852e5 }, { e: 12346632e5, s: 12558348e5 }, { e: 12667176e5, s: 12872844e5 }, { e: 12981672e5, s: 1318734e6 }, { e: 13302216e5, s: 13507884e5 }, { e: 13610664e5, s: 1382238e6 }, { e: 1392516e6, s: 14136876e5 }] }, { name: "Asia/Amman", rules: [{ e: 1225404e6, s: 12066552e5 }, { e: 12568536e5, s: 12381048e5 }, { e: 12883032e5, s: 12695544e5 }, { e: 13197528e5, s: 13016088e5 }, !1, !1, { e: 14147064e5, s: 13959576e5 }] }, { name: "Asia/Damascus", rules: [{ e: 12254868e5, s: 120726e7 }, { e: 125685e7, s: 12381048e5 }, { e: 12882996e5, s: 12701592e5 }, { e: 13197492e5, s: 13016088e5 }, { e: 13511988e5, s: 13330584e5 }, { e: 13826484e5, s: 1364508e6 }, { e: 14147028e5, s: 13959576e5 }] }, { name: "Asia/Dubai", rules: [!1, !1, !1, !1, !1, !1, !1] }, { name: "Asia/Gaza", rules: [{ e: 12199572e5, s: 12066552e5 }, { e: 12520152e5, s: 12381048e5 }, { e: 1281474e6, s: 126964086e4 }, { e: 1312146e6, s: 130160886e4 }, { e: 13481784e5, s: 13330584e5 }, { e: 13802292e5, s: 1364508e6 }, { e: 1414098e6, s: 13959576e5 }] }, { name: "Asia/Irkutsk", rules: [{ e: 12249576e5, s: 12068136e5 }, { e: 12564072e5, s: 12382632e5 }, { e: 12884616e5, s: 12697128e5 }, !1, !1, !1, !1] }, { name: "Asia/Jerusalem", rules: [{ e: 12231612e5, s: 12066624e5 }, { e: 1254006e6, s: 1238112e6 }, { e: 1284246e6, s: 12695616e5 }, { e: 131751e7, s: 1301616e6 }, { e: 13483548e5, s: 13330656e5 }, { e: 13828284e5, s: 13645152e5 }, { e: 1414278e6, s: 13959648e5 }] }, { name: "Asia/Kamchatka", rules: [{ e: 12249432e5, s: 12067992e5 }, { e: 12563928e5, s: 12382488e5 }, { e: 12884508e5, s: 12696984e5 }, !1, !1, !1, !1] }, { name: "Asia/Krasnoyarsk", rules: [{ e: 12249612e5, s: 12068172e5 }, { e: 12564108e5, s: 12382668e5 }, { e: 12884652e5, s: 12697164e5 }, !1, !1, !1, !1] }, { name: "Asia/Omsk", rules: [{ e: 12249648e5, s: 12068208e5 }, { e: 12564144e5, s: 12382704e5 }, { e: 12884688e5, s: 126972e7 }, !1, !1, !1, !1] }, { name: "Asia/Vladivostok", rules: [{ e: 12249504e5, s: 12068064e5 }, { e: 12564e8, s: 1238256e6 }, { e: 12884544e5, s: 12697056e5 }, !1, !1, !1, !1] }, { name: "Asia/Yakutsk", rules: [{ e: 1224954e6, s: 120681e7 }, { e: 12564036e5, s: 12382596e5 }, { e: 1288458e6, s: 12697092e5 }, !1, !1, !1, !1] }, { name: "Asia/Yekaterinburg", rules: [{ e: 12249684e5, s: 12068244e5 }, { e: 1256418e6, s: 1238274e6 }, { e: 12884724e5, s: 12697236e5 }, !1, !1, !1, !1] }, { name: "Asia/Yerevan", rules: [{ e: 1224972e6, s: 1206828e6 }, { e: 12564216e5, s: 12382776e5 }, { e: 1288476e6, s: 12697272e5 }, { e: 13199256e5, s: 13011768e5 }, !1, !1, !1] }, { name: "Australia/Lord_Howe", rules: [{ e: 12074076e5, s: 12231342e5 }, { e: 12388572e5, s: 12545838e5 }, { e: 12703068e5, s: 12860334e5 }, { e: 13017564e5, s: 1317483e6 }, { e: 1333206e6, s: 13495374e5 }, { e: 13652604e5, s: 1380987e6 }, { e: 139671e7, s: 14124366e5 }] }, { name: "Australia/Perth", rules: [{ e: 12068136e5, s: 12249576e5 }, !1, !1, !1, !1, !1, !1] }, { name: "Europe/Helsinki", rules: [{ e: 12249828e5, s: 12068388e5 }, { e: 12564324e5, s: 12382884e5 }, { e: 12884868e5, s: 1269738e6 }, { e: 13199364e5, s: 13011876e5 }, { e: 1351386e6, s: 13326372e5 }, { e: 13828356e5, s: 13646916e5 }, { e: 14142852e5, s: 13961412e5 }] }, { name: "Europe/Minsk", rules: [{ e: 12249792e5, s: 12068352e5 }, { e: 12564288e5, s: 12382848e5 }, { e: 12884832e5, s: 12697344e5 }, !1, !1, !1, !1] }, { name: "Europe/Moscow", rules: [{ e: 12249756e5, s: 12068316e5 }, { e: 12564252e5, s: 12382812e5 }, { e: 12884796e5, s: 12697308e5 }, !1, !1, !1, !1] }, { name: "Pacific/Apia", rules: [!1, !1, !1, { e: 13017528e5, s: 13168728e5 }, { e: 13332024e5, s: 13489272e5 }, { e: 13652568e5, s: 13803768e5 }, { e: 13967064e5, s: 14118264e5 }] }, { name: "Pacific/Fiji", rules: [!1, !1, { e: 12696984e5, s: 12878424e5 }, { e: 13271544e5, s: 1319292e6 }, { e: 1358604e6, s: 13507416e5 }, { e: 139005e7, s: 1382796e6 }, { e: 14215032e5, s: 14148504e5 }] }, { name: "Europe/London", rules: [{ e: 12249828e5, s: 12068388e5 }, { e: 12564324e5, s: 12382884e5 }, { e: 12884868e5, s: 1269738e6 }, { e: 13199364e5, s: 13011876e5 }, { e: 1351386e6, s: 13326372e5 }, { e: 13828356e5, s: 13646916e5 }, { e: 14142852e5, s: 13961412e5 }] }] }, "undefined" != typeof module && "undefined" != typeof module.exports ? module.exports = a : "undefined" != typeof define && null !== define && null != define.amd ? define([], function () { return a }) : "undefined" == typeof e ? window.jstz = a : e.jstz = a }();
/* ua-parser-js Version: 0.7.10 */
!function (i, s) { "use strict"; var e = "0.7.10", o = "", r = "?", n = "function", a = "undefined", t = "object", w = "string", l = "major", d = "model", p = "name", c = "type", u = "vendor", m = "version", f = "architecture", b = "console", g = "mobile", h = "tablet", v = "smarttv", x = "wearable", y = "embedded", k = { extend: function (i, s) { var e = {}; for (var o in i) e[o] = s[o] && s[o].length % 2 === 0 ? s[o].concat(i[o]) : i[o]; return e }, has: function (i, s) { return "string" == typeof i ? -1 !== s.toLowerCase().indexOf(i.toLowerCase()) : !1 }, lowerize: function (i) { return i.toLowerCase() }, major: function (i) { return typeof i === w ? i.split(".")[0] : s } }, A = { rgx: function () { for (var i, e, o, r, w, l, d, p = 0, c = arguments; p < c.length && !l;) { var u = c[p], m = c[p + 1]; if (typeof i === a) { i = {}; for (r in m) m.hasOwnProperty(r) && (w = m[r], typeof w === t ? i[w[0]] = s : i[w] = s) } for (e = o = 0; e < u.length && !l;) if (l = u[e++].exec(this.getUA())) for (r = 0; r < m.length; r++) d = l[++o], w = m[r], typeof w === t && w.length > 0 ? 2 == w.length ? i[w[0]] = typeof w[1] == n ? w[1].call(this, d) : w[1] : 3 == w.length ? i[w[0]] = typeof w[1] !== n || w[1].exec && w[1].test ? d ? d.replace(w[1], w[2]) : s : d ? w[1].call(this, d, w[2]) : s : 4 == w.length && (i[w[0]] = d ? w[3].call(this, d.replace(w[1], w[2])) : s) : i[w] = d ? d : s; p += 2 } return i }, str: function (i, e) { for (var o in e) if (typeof e[o] === t && e[o].length > 0) { for (var n = 0; n < e[o].length; n++) if (k.has(e[o][n], i)) return o === r ? s : o } else if (k.has(e[o], i)) return o === r ? s : o; return i } }, E = { browser: { oldsafari: { version: { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" } } }, device: { amazon: { model: { "Fire Phone": ["SD", "KF"] } }, sprint: { model: { "Evo Shift 4G": "7373KT" }, vendor: { HTC: "APA", Sprint: "Sprint" } } }, os: { windows: { version: { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2000: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" } } } }, S = { browser: [[/(opera\smini)\/([\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, /(opera).+version\/([\w\.]+)/i, /(opera)[\/\s]+([\w\.]+)/i], [p, m], [/(OPiOS)[\/\s]+([\w\.]+)/i], [[p, "Opera Mini"], m], [/\s(opr)\/([\w\.]+)/i], [[p, "Opera"], m], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i, /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i, /(?:ms|\()(ie)\s([\w\.]+)/i, /(rekonq)\/([\w\.]+)*/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i], [p, m], [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i], [[p, "IE"], m], [/(edge)\/((\d+)?[\w\.]+)/i], [p, m], [/(yabrowser)\/([\w\.]+)/i], [[p, "Yandex"], m], [/(comodo_dragon)\/([\w\.]+)/i], [[p, /_/g, " "], m], [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i, /(qqbrowser)[\/\s]?([\w\.]+)/i], [p, m], [/(uc\s?browser)[\/\s]?([\w\.]+)/i, /ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i, /JUC.+(ucweb)[\/\s]?([\w\.]+)/i], [[p, "UCBrowser"], m], [/(dolfin)\/([\w\.]+)/i], [[p, "Dolphin"], m], [/((?:android.+)crmo|crios)\/([\w\.]+)/i], [[p, "Chrome"], m], [/XiaoMi\/MiuiBrowser\/([\w\.]+)/i], [m, [p, "MIUI Browser"]], [/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i], [m, [p, "Android Browser"]], [/FBAV\/([\w\.]+);/i], [m, [p, "Facebook"]], [/fxios\/([\w\.-]+)/i], [m, [p, "Firefox"]], [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i], [m, [p, "Mobile Safari"]], [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i], [m, p], [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i], [p, [m, A.str, E.browser.oldsafari.version]], [/(konqueror)\/([\w\.]+)/i, /(webkit|khtml)\/([\w\.]+)/i], [p, m], [/(navigator|netscape)\/([\w\.-]+)/i], [[p, "Netscape"], m], [/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i, /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i, /(links)\s\(([\w\.]+)/i, /(gobrowser)\/?([\w\.]+)*/i, /(ice\s?browser)\/v?([\w\._]+)/i, /(mosaic)[\/\s]([\w\.]+)/i], [p, m]], cpu: [[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i], [[f, "amd64"]], [/(ia32(?=;))/i], [[f, k.lowerize]], [/((?:i[346]|x)86)[;\)]/i], [[f, "ia32"]], [/windows\s(ce|mobile);\sppc;/i], [[f, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i], [[f, /ower/, "", k.lowerize]], [/(sun4\w)[;\)]/i], [[f, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i], [[f, k.lowerize]]], device: [[/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i], [d, u, [c, h]], [/applecoremedia\/[\w\.]+ \((ipad)/], [d, [u, "Apple"], [c, h]], [/(apple\s{0,1}tv)/i], [[d, "Apple TV"], [u, "Apple"]], [/(archos)\s(gamepad2?)/i, /(hp).+(touchpad)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i], [u, d, [c, h]], [/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i], [d, [u, "Amazon"], [c, h]], [/(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i], [[d, A.str, E.device.amazon.model], [u, "Amazon"], [c, g]], [/\((ip[honed|\s\w*]+);.+(apple)/i], [d, u, [c, g]], [/\((ip[honed|\s\w*]+);/i], [d, [u, "Apple"], [c, g]], [/(blackberry)[\s-]?(\w+)/i, /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i], [u, d, [c, g]], [/\(bb10;\s(\w+)/i], [d, [u, "BlackBerry"], [c, g]], [/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i], [d, [u, "Asus"], [c, h]], [/(sony)\s(tablet\s[ps])\sbuild\//i, /(sony)?(?:sgp.+)\sbuild\//i], [[u, "Sony"], [d, "Xperia Tablet"], [c, h]], [/(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i], [[u, "Sony"], [d, "Xperia Phone"], [c, g]], [/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i], [u, d, [c, b]], [/android.+;\s(shield)\sbuild/i], [d, [u, "Nvidia"], [c, b]], [/(playstation\s[34portablevi]+)/i], [d, [u, "Sony"], [c, b]], [/(sprint\s(\w+))/i], [[u, A.str, E.device.sprint.vendor], [d, A.str, E.device.sprint.model], [c, g]], [/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i], [u, d, [c, h]], [/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, /(zte)-(\w+)*/i, /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i], [u, [d, /_/g, " "], [c, g]], [/(nexus\s9)/i], [d, [u, "HTC"], [c, h]], [/[\s\(;](xbox(?:\sone)?)[\s\);]/i], [d, [u, "Microsoft"], [c, b]], [/(kin\.[onetw]{3})/i], [[d, /\./g, " "], [u, "Microsoft"], [c, g]], [/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i, /mot[\s-]?(\w+)*/i, /(XT\d{3,4}) build\//i, /(nexus\s[6])/i], [d, [u, "Motorola"], [c, g]], [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i], [d, [u, "Motorola"], [c, h]], [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i, /((SM-T\w+))/i], [[u, "Samsung"], d, [c, h]], [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-n900))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i, /sec-((sgh\w+))/i], [[u, "Samsung"], d, [c, g]], [/(samsung);smarttv/i], [u, d, [c, v]], [/\(dtv[\);].+(aquos)/i], [d, [u, "Sharp"], [c, v]], [/sie-(\w+)*/i], [d, [u, "Siemens"], [c, g]], [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]+)*/i], [[u, "Nokia"], d, [c, g]], [/android\s3\.[\s\w;-]{10}(a\d{3})/i], [d, [u, "Acer"], [c, h]], [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i], [[u, "LG"], d, [c, h]], [/(lg) netcast\.tv/i], [u, d, [c, v]], [/(nexus\s[45])/i, /lg[e;\s\/-]+(\w+)*/i], [d, [u, "LG"], [c, g]], [/android.+(ideatab[a-z0-9\-\s]+)/i], [d, [u, "Lenovo"], [c, h]], [/linux;.+((jolla));/i], [u, d, [c, g]], [/((pebble))app\/[\d\.]+\s/i], [u, d, [c, x]], [/android.+;\s(glass)\s\d/i], [d, [u, "Google"], [c, x]], [/android.+(\w+)\s+build\/hm\1/i, /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, /android.+(mi[\s\-_]*(?:one|one[\s_]plus)?[\s_]*(?:\d\w)?)\s+build/i], [[d, /_/g, " "], [u, "Xiaomi"], [c, g]], [/\s(tablet)[;\/\s]/i, /\s(mobile)[;\/\s]/i], [[c, k.lowerize], u, d]], engine: [[/windows.+\sedge\/([\w\.]+)/i], [m, [p, "EdgeHTML"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i], [p, m], [/rv\:([\w\.]+).*(gecko)/i], [m, p]], os: [[/microsoft\s(windows)\s(vista|xp)/i], [p, m], [/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i], [p, [m, A.str, E.os.windows.version]], [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i], [[p, "Windows"], [m, A.str, E.os.windows.version]], [/\((bb)(10);/i], [[p, "BlackBerry"], m], [/(blackberry)\w*\/?([\w\.]+)*/i, /(tizen)[\/\s]([\w\.]+)/i, /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i, /linux;.+(sailfish);/i], [p, m], [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i], [[p, "Symbian"], m], [/\((series40);/i], [p], [/mozilla.+\(mobile;.+gecko.+firefox/i], [[p, "Firefox OS"], m], [/(nintendo|playstation)\s([wids34portablevu]+)/i, /(mint)[\/\s\(]?(\w+)*/i, /(mageia|vectorlinux)[;\s]/i, /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i, /(hurd|linux)\s?([\w\.]+)*/i, /(gnu)\s?([\w\.]+)*/i], [p, m], [/(cros)\s[\w]+\s([\w\.]+\w)/i], [[p, "Chromium OS"], m], [/(sunos)\s?([\w\.]+\d)*/i], [[p, "Solaris"], m], [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i], [p, m], [/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i], [[p, "iOS"], [m, /_/g, "."]], [/(mac\sos\sx)\s?([\w\s\.]+\w)*/i, /(macintosh|mac(?=_powerpc)\s)/i], [[p, "Mac OS"], [m, /_/g, "."]], [/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i, /(haiku)\s(\w+)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i, /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i, /(unix)\s?([\w\.]+)*/i], [p, m]] }, T = function (s, e) { if (!(this instanceof T)) return new T(s, e).getResult(); var r = s || (i && i.navigator && i.navigator.userAgent ? i.navigator.userAgent : o), n = e ? k.extend(S, e) : S; return this.getBrowser = function () { var i = A.rgx.apply(this, n.browser); return i.major = k.major(i.version), i }, this.getCPU = function () { return A.rgx.apply(this, n.cpu) }, this.getDevice = function () { return A.rgx.apply(this, n.device) }, this.getEngine = function () { return A.rgx.apply(this, n.engine) }, this.getOS = function () { return A.rgx.apply(this, n.os) }, this.getResult = function () { return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() } }, this.getUA = function () { return r }, this.setUA = function (i) { return r = i, this }, this }; T.VERSION = e, T.BROWSER = { NAME: p, MAJOR: l, VERSION: m }, T.CPU = { ARCHITECTURE: f }, T.DEVICE = { MODEL: d, VENDOR: u, TYPE: c, CONSOLE: b, MOBILE: g, SMARTTV: v, TABLET: h, WEARABLE: x, EMBEDDED: y }, T.ENGINE = { NAME: p, VERSION: m }, T.OS = { NAME: p, VERSION: m }, typeof exports !== a ? (typeof module !== a && module.exports && (exports = module.exports = T), exports.UAParser = T) : typeof define === n && define.amd ? define("ua-parser-js", [], function () { return T }) : i.UAParser = T; var N = i.jQuery || i.Zepto; if (typeof N !== a) { var O = new T; N.ua = O.getResult(), N.ua.get = function () { return O.getUA() }, N.ua.set = function (i) { O.setUA(i); var s = O.getResult(); for (var e in s) N.ua[e] = s[e] } } }("object" == typeof window ? window : this);

/* see http://stackoverflow.com/q/7616461/940217 */
function hashCode(str) {
    str += "";
    var hash = 0;
    if (str.length === 0) return "0";
    for (var i = 0; i < str.length; i++) {
        var character = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

var secureAuth = secureAuth || {};

secureAuth.fingerprint = (function () {
    'use strict';

    var dfp = {}; // digital fingerprint data
    var uaParser = new UAParser();
    var userAgentString = uaParser.getUA();

    var checkVal = function(value)
    {
        return typeof value === 'undefined' ? null : value;
    }

    var osName = function(userAgent)
    {
        switch (true)
        {
            case (userAgent.indexOf('windows phone') >= 0):
                return 'Windows Phone';
            case (userAgent.indexOf('win') >= 0):
                return 'Windows';
            case (userAgent.indexOf('android') >= 0):
                return 'Android';
            case (userAgent.indexOf('linux') >= 0):
                return 'Linux';
            case (userAgent.indexOf('iphone') >= 0 || userAgent.indexOf('ipad') >= 0):
                return 'iOS';
            case (userAgent.indexOf('mac') >= 0):
                return 'Mac';
            default:
        }

        return 'Other';
    }

    var browserName = function(userAgent)
    {
        switch (true)
        {
            case (userAgent.indexOf('firefox') >= 0):
                return 'Firefox';
            case (userAgent.indexOf('opera') >= 0 || userAgent.indexOf('opr') >= 0):
                return 'Opera';
            case (userAgent.indexOf('chrome') >= 0):
                return 'Chrome';
            case (userAgent.indexOf('safari') >= 0):
                return 'Safari';
            case (userAgent.indexOf('trident') >= 0):
                return 'Internet Explorer';
        }

        return 'Other';
    }

    var htmlEscape = function (str) {
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
    };

    var isIE = function () {
        if (navigator.appName === 'Microsoft Internet Explorer') {
            return true;
        } else if (navigator.appName === 'Netscape' && /Trident/.test(userAgentString)) {
            return true;
        }
        return false;
    };

    var isMobileDevice = function()
    {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    };

    var hasCanvas = function () {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    var hasWebGl = function () {
        if (!hasCanvas()) {
            return false;
        } else {
            var canvas = document.createElement('canvas');
            var glContext;
            try {
                glContext = canvas.getContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
            } catch (e) {
                glContext = false;
            }
            return !!window.WebGLRenderingContext && !!glContext;
        }
    };

    var userAgentBrowserResult = function ()
    {
        var browser = uaParser.getBrowser();
        dfp.uaBrowser =
            { name: checkVal(browser.name), version: checkVal(browser.version), major: checkVal(browser.major) };
    };

    var userAgentStringResult = function ()
    {
        dfp.uaString = userAgentString;
    };

    var userAgentDeviceResult = function ()
    {
        var device = uaParser.getDevice();
        dfp.uaDevice =
            { model: checkVal(device.model), type: checkVal(device.type), vendor: checkVal(device.vendor) };
    };

    var userAgentEngineResult = function ()
    {
        var engine = uaParser.getEngine();
        dfp.uaEngine = { name: checkVal(engine.name), version: checkVal(engine.version) };
    };

    var userAgentOSResult = function ()
    {
        var os = uaParser.getOS();
        dfp.uaOS = { name: checkVal(os.name), version: checkVal(os.version) };
    };

    var userAgentCPUResult = function ()
    {
        var cpu = uaParser.getCPU();
        dfp.uaCPU = { architecture: checkVal(cpu.architecture) };
    };

    var userAgentPlatformResult = function ()
    {
        dfp.uaPlatform = navigator.platform || null;
    };

    var languageResult = function ()
    {
        // Using `navigator.language`. IE 9,10 on Windows 10 has no results
        dfp.language = navigator.language || navigator.userLanguage || navigator.browserLanguage ||
            navigator.systemLanguage || null;
    };

    var colorDepthResult = function ()
    {
        dfp.colorDepth = screen.colorDepth || null;
    };

    var pixelRatioResult = function ()
    {
        dfp.pixelRatio = window.devicePixelRatio || null;
    };

    var screenResolutionResult = function ()
    {
        if (screen.height > screen.width)
            dfp.screenResolution = screen.height + 'x' + screen.width;
        else
            dfp.screenResolution = screen.width + 'x' + screen.height;
    };

    var availableScreenResolutionResult = function ()
    {
        dfp.availableScreenResolution = null;

        if (screen.availWidth && screen.availHeight)
        {
            if (screen.availHeight > screen.availWidth)
                dfp.availableScreenResolution = screen.availHeight + 'x' + screen.availWidth;
            else
                dfp.availableScreenResolution = screen.availWidth + 'x' + screen.availHeight;
        }
    };

    var timeZoneResult = function ()
    {
        dfp.timezone = jstz.determine().name();
    };

    var timezoneOffsetResult = function ()
    {
        dfp.timezoneOffset = (new Date()).getTimezoneOffset();
    };

    var localStorageResult = function ()
    {
        try
        {
            localStorage.setItem('sa', 'true');
            localStorage.removeItem('sa');

            dfp.localStorage =  true;
        }
        catch (e)
        {
            dfp.localStorage =  false;
        }
    };

    var sessionStorageResult = function ()
    {
        try
        {
            sessionStorage.setItem('sa', 'true');
            sessionStorage.removeItem('sa');

            dfp.sessionStorage = true;
        }
        catch (e)
        {
            dfp.sessionStorage = false;
        }
    };

    var indexedDbResult = function ()
    {
        try
        {
            // access may result in exception if cookies are disabled
            dfp.indexedDb = !!window.indexedDB;
        }
        catch (e)
        {
            dfp.indexedDb = false;
        }
    };

    var addBehaviorResult = function ()
    {
        dfp.addBehavior = (document.body && document.body.addBehavior) ? true : false;
    };

    var openDatabaseResult = function ()
    {
        dfp.openDatabase = window.openDatabase ? true : false;
    };

    var cpuClassResult = function ()
    {
        dfp.cpuClass = navigator.cpuClass ? navigator.cpuClass : null;
    };

    var platformResult = function ()
    {
        dfp.platform = navigator.platform ? navigator.platform : null;
    };

    var doNotTrackResult = function ()
    {
        dfp.doNotTrack = checkVal(navigator.doNotTrack);

        if (dfp.doNotTrack == null)
            dfp.doNotTrack = checkVal(window.doNotTrack); // for recent versions of IE and Safari
    };

    var sortPlugin = function () {
        var sorted = false;
        var sortPluginsFor = [/palemoon/i];
        for (var i = 0, l = sortPluginsFor.length; i < l; i++) {
            var re = sortPluginsFor[i];
            if (userAgentString.match(re)) {
                sorted = true;
                break;
            }
        }
        return sorted;
    };

    var regularPlugins = function ()
    {
        var result = [];
        var plugins = [];

        for (var i = 0, l = navigator.plugins.length; i < l; i++) {
            plugins.push(navigator.plugins[i]);
        }

        if (sortPlugin()) {
            plugins = plugins.sort(function (x, y) {
                if (x.name > y.name) { return 1; }
                if (x.name < y.name) { return -1; }
                return 0;
            });
        }

        plugins.map(function(mime)
        {
            var description = (mime[0].description !== '') ? mime[0].description + '.' : '';
            var type = (mime[0].type !== '') ? mime[0].type : '';
            var suffixes = (mime[0].suffixes !== '') ? '::' + mime[0].suffixes : '';
            var names = htmlEscape((description + type + suffixes).toString());
            result.push(names);
        });

        dfp.plugins = result.join();
    };

    var iePlugins = function () {
        var data;
        var result = [];
        if ((Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, 'ActiveXObject')) || ('ActiveXObject' in window)) {
            var names = [
              'AcroPDF.PDF', // Adobe PDF reader 7+
              'Adodb.Stream',
              'AgControl.AgControl', // Silverlight
              'DevalVRXCtrl.DevalVRXCtrl.1',
              'MacromediaFlashPaper.MacromediaFlashPaper',
              'Msxml2.DOMDocument',
              'Msxml2.XMLHTTP',
              'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
              'QuickTime.QuickTime', // QuickTime
              'QuickTimeCheckObject.QuickTimeCheck.1',
              'RealPlayer',
              'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
              'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
              'Scripting.Dictionary',
              'SWCtl.SWCtl', // ShockWave player
              'Shell.UIHelper',
              'ShockwaveFlash.ShockwaveFlash', //flash plugin
              'Skype.Detection',
              'TDCCtl.TDCCtl',
              'WMPlayer.OCX', // Windows media player
              'rmocx.RealPlayer G2 Control',
              'rmocx.RealPlayer G2 Control.1'
            ];
            names.map(function (name) {
                try {
                    new ActiveXObject(name);
                    result.push(name);
                } catch (e) { }
            });
            data = result.join();
            dfp.plugins = data;
        }
    };

    var pluginsResult = function () {
        if (isIE()) {
            iePlugins();
        } else {
            regularPlugins();
        }
    };

    var canvasSignature = function () {
        var data = [];

        var canvas = document.createElement('canvas');
        canvas.width = 2000;
        canvas.height = 200;
        canvas.style.display = 'inline';
        var ctx = canvas.getContext('2d');

        ctx.rect(0, 0, 10, 10);
        ctx.rect(2, 2, 6, 6);

        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';

        ctx.font = '11pt Arial';
        ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.2)';
        ctx.font = '18pt Arial';
        ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 4, 45);

        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgb(255,0,255)';
        ctx.beginPath();
        ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgb(0,255,255)';
        ctx.beginPath();
        ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgb(255,255,0)';
        ctx.beginPath();
        ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgb(255,0,255)';

        ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
        ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
        ctx.fill('evenodd');

        data.push(canvas.toDataURL());
        data.push('winding: ' + (ctx.isPointInPath(5, 5, 'evenodd') === false) ? 'yes' : 'no');

        return data.join();
    };

    var canvasResult = function ()
    {
        dfp.canvas = hasCanvas() ? "" + hashCode(canvasSignature()) :
            { winding: undefined, signature: undefined };
    };

    var webglCanvas = function () {
        var canvas = document.createElement('canvas');
        var gl = null;
        try {
            gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        } catch (e) { }
        if (!gl) {
            gl = null;
        }
        return gl;
    };

    var webglSignature = function () {
        var data = [];
        var gl;

        var frame = function (i) {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            return '[' + i[0] + ', ' + i[1] + ']';
        };

        var maxAnisotropy = function (gl) {
            var anisotropy, ext = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
            return ext ? (anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 0 === anisotropy && (anisotropy = 2), anisotropy) : null;
        };

        gl = webglCanvas();

        if (!gl) {
            return null;
        }

        var vShaderTemplate = 'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}';
        var fShaderTemplate = 'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}';
        var vertexPosBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);

        var vertices = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0]);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        vertexPosBuffer.itemSize = 3;
        vertexPosBuffer.numItems = 3;

        var program = gl.createProgram(), vshader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vshader, vShaderTemplate);
        gl.compileShader(vshader);

        var fshader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fshader, fShaderTemplate);
        gl.compileShader(fshader);
        gl.attachShader(program, vshader);
        gl.attachShader(program, fshader);
        gl.linkProgram(program);
        gl.useProgram(program);
        program.vertexPosAttrib = gl.getAttribLocation(program, 'attrVertex');
        program.offsetUniform = gl.getUniformLocation(program, 'uniformOffset');
        gl.enableVertexAttribArray(program.vertexPosArray);
        gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
        gl.uniform2f(program.offsetUniform, 1, 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);

        if (gl.canvas != null) {
            data.push(gl.canvas.toDataURL());
        }

        data.push('extensions:' + gl.getSupportedExtensions().join(';'));
        data.push('webgl aliased line width range:' + frame(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)));
        data.push('webgl aliased point size range:' + frame(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)));
        data.push('webgl alpha bits:' + gl.getParameter(gl.ALPHA_BITS));
        data.push('webgl antialiasing:' + (gl.getContextAttributes().antialias ? 'yes' : 'no'));
        data.push('webgl blue bits:' + gl.getParameter(gl.BLUE_BITS));
        data.push('webgl depth bits:' + gl.getParameter(gl.DEPTH_BITS));
        data.push('webgl green bits:' + gl.getParameter(gl.GREEN_BITS));
        data.push('webgl max anisotropy:' + maxAnisotropy(gl));
        data.push('webgl max combined texture image units:' + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
        data.push('webgl max cube map texture size:' + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
        data.push('webgl max fragment uniform vectors:' + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
        data.push('webgl max render buffer size:' + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
        data.push('webgl max texture image units:' + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
        data.push('webgl max texture size:' + gl.getParameter(gl.MAX_TEXTURE_SIZE));
        data.push('webgl max varying vectors:' + gl.getParameter(gl.MAX_VARYING_VECTORS));
        data.push('webgl max vertex attribs:' + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
        data.push('webgl max vertex texture image units:' + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
        data.push('webgl max vertex uniform vectors:' + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
        data.push('webgl max viewport dims:' + frame(gl.getParameter(gl.MAX_VIEWPORT_DIMS)));
        data.push('webgl red bits:' + gl.getParameter(gl.RED_BITS));
        data.push('webgl renderer:' + gl.getParameter(gl.RENDERER));
        data.push('webgl shading language version:' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
        data.push('webgl stencil bits:' + gl.getParameter(gl.STENCIL_BITS));
        data.push('webgl vendor:' + gl.getParameter(gl.VENDOR));
        data.push('webgl version:' + gl.getParameter(gl.VERSION));

        if (!gl.getShaderPrecisionFormat) {
            if (typeof NODEBUG === 'undefined') {
                console.log('WebGL fingerprinting is incomplete, because your browser does not support getShaderPrecisionFormat');
            }
            return data.join();
        }

        data.push('webgl vertex shader high float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision);
        data.push('webgl vertex shader high float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).rangeMin);
        data.push('webgl vertex shader high float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).rangeMax);
        data.push('webgl vertex shader medium float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision);
        data.push('webgl vertex shader medium float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).rangeMin);
        data.push('webgl vertex shader medium float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).rangeMax);
        data.push('webgl vertex shader low float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).precision);
        data.push('webgl vertex shader low float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).rangeMin);
        data.push('webgl vertex shader low float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).rangeMax);
        data.push('webgl fragment shader high float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision);
        data.push('webgl fragment shader high float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).rangeMin);
        data.push('webgl fragment shader high float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).rangeMax);
        data.push('webgl fragment shader medium float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision);
        data.push('webgl fragment shader medium float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).rangeMin);
        data.push('webgl fragment shader medium float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).rangeMax);
        data.push('webgl fragment shader low float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).precision);
        data.push('webgl fragment shader low float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).rangeMin);
        data.push('webgl fragment shader low float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).rangeMax);
        data.push('webgl vertex shader high int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).precision);
        data.push('webgl vertex shader high int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).rangeMin);
        data.push('webgl vertex shader high int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).rangeMax);
        data.push('webgl vertex shader medium int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).precision);
        data.push('webgl vertex shader medium int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).rangeMin);
        data.push('webgl vertex shader medium int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).rangeMax);
        data.push('webgl vertex shader low int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).precision);
        data.push('webgl vertex shader low int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).rangeMin);
        data.push('webgl vertex shader low int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).rangeMax);
        data.push('webgl fragment shader high int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).precision);
        data.push('webgl fragment shader high int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).rangeMin);
        data.push('webgl fragment shader high int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).rangeMax);
        data.push('webgl fragment shader medium int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).precision);
        data.push('webgl fragment shader medium int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).rangeMin);
        data.push('webgl fragment shader medium int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).rangeMax);
        data.push('webgl fragment shader low int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).precision);
        data.push('webgl fragment shader low int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).rangeMin);
        data.push('webgl fragment shader low int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).rangeMax);

        return data.join();
    };

    var webglResult = function ()
    {
        dfp.webGl = hasWebGl() ? "" + hashCode(webglSignature()) : null;
    };

    var adBlockResult = function ()
    {
        var ad = document.createElement('div');
        var adClass = 'adsbox pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links';
        var adStyle = 'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;';

        ad.setAttribute('class', adClass);
        ad.setAttribute('style', adStyle);
        window.document.body.appendChild(ad);
        dfp.adBlock = document.getElementsByClassName('adsbox')[0].offsetHeight === 0;
        setTimeout(function () { window.document.body.removeChild(ad); }, 0);
    };

    var userTamperLanguageResults = function ()
    {
        dfp.userTamperLanguage = false;

        if (typeof navigator.languages !== 'undefined')
        {
            try
            {
                if (navigator.languages[0].substr(0, 2) !== navigator.language.substr(0, 2))
                {
                    dfp.userTamperLanguage = true;
                }
            }
            catch (err)
            {
                dfp.userTamperLanguage = true;
            }
        }
    };

    var userTamperScreenResolutionResults = function ()
    {
        dfp.userTamperScreenResolution = (screen.width < screen.availWidth) ||
            (screen.height < screen.availHeight);
    };

    var userTamperOSResults = function ()
    {
        var userAgent = userAgentString.toLowerCase();
        var oscpu = navigator.oscpu;
        var platform = navigator.platform.toLowerCase();
        var os = osName(userAgent);
        var data = false;

        if (isMobileDevice() && os !== 'Windows Phone' && os !== 'Android' && os !== 'iOS' && os !== 'Other')
        {
            data = true;
        }

        if (typeof oscpu !== 'undefined')
        {
            oscpu = oscpu.toLowerCase();
            switch (true)
            {
                case (oscpu.indexOf('win') >= 0 && os !== 'Windows' && os !== 'Windows Phone'):
                    data = true;
                    break;
                case (oscpu.indexOf('linux') >= 0 && os !== 'Linux' && os !== 'Android'):
                    data = true;
                    break;
                case (oscpu.indexOf('mac') >= 0 && os !== 'Mac' && os !== 'iOS'):
                    data = true;
                    break;
                case (oscpu.indexOf('win') === 0 && oscpu.indexOf('linux') === 0 && oscpu.indexOf('mac') >= 0 && os !== 'other'):
                    data = true;
                    break;
            }
        }

        switch (true)
        {
            case (platform.indexOf('win') >= 0 && os !== 'Windows' && os !== 'Windows Phone'):
                data = true;
                break;
            case ((platform.indexOf('linux') >= 0 || platform.indexOf('android') >= 0 || platform.indexOf('pike') >= 0) && os !== 'Linux' && os !== 'Android'):
                data = true;
                break;
            case ((platform.indexOf('mac') >= 0 || platform.indexOf('ipad') >= 0 || platform.indexOf('ipod') >= 0 || platform.indexOf('iphone') >= 0) && os !== 'Mac' && os !== 'iOS'):
                data = true;
                break;
            case (platform.indexOf('win') === 0 && platform.indexOf('linux') === 0 && platform.indexOf('mac') >= 0 && os !== 'other'):
                data = true;
                break;
        }

        if (typeof navigator.plugins === 'undefined' && os !== 'Windows' && os !== 'Windows Phone')
        {
            data = true;
        }

        dfp.userTamperOS = data;
    };

    var userTamperBrowserResults = function () {
        var userAgent = userAgentString.toLowerCase();
        var productSub = navigator.productSub;
        var tempRes = eval.toString().length;
        var browser = browserName(userAgent);
        var errFirefox;
        var data = false;

        if ((browser === 'Chrome' || browser === 'Safari' || browser === 'Opera') && productSub !== '20030107') {
            data = true;
        }

        if (tempRes === 37 && browser !== 'Safari' && browser !== 'Firefox' && browser !== 'Other') {
            data = true;
        } else if (tempRes === 39 && browser !== 'Internet Explorer' && browser !== 'Other') {
            data = true;
        } else if (tempRes === 33 && browser !== 'Chrome' && browser !== 'Opera' && browser !== 'Other') {
            data = true;
        }

        try {
            throw 'a';
        } catch (err) {
            try {
                err.toSource();
                errFirefox = true;
            } catch (errOfErr) {
                errFirefox = false;
            }
        }

        if (errFirefox && browser !== 'Firefox' && browser !== 'Other') {
            data = true;
        }

        dfp.userTamperBrowser = data;
    };

    var touchSupportResult = function ()
    {
        var maxTouchPoints = 0;
        var touchEvent = false;
        var touchStart = 'ontouchstart' in window;

        if (typeof navigator.maxTouchPoints !== 'undefined')
        {
            maxTouchPoints = navigator.maxTouchPoints;
        }
        else if (typeof navigator.msMaxTouchPoints !== 'undefined')
        {
            maxTouchPoints = navigator.msMaxTouchPoints;
        }

        try
        {
            document.createEvent('TouchEvent');
            touchEvent = true;
        }
        catch (e) { }

        dfp.touchSupport = { maxTouchPoints: maxTouchPoints, touchEvent: touchEvent, touchStart: touchStart };
    };

    var cookieSupportResult = function ()
    {
        // this is always true in IE for some reason
        dfp.cookieSupport = navigator.cookieEnabled ? true : false;
    };

    var fontsResult = function () {
        var result = [];

        // var baseFonts = ['monospace', 'sans-serif', 'serif'];
        var baseFonts = ['monospace'];

        var testString = 'mmmmmmmmmmlli';

        var testSize = '72px';

        var body = document.getElementsByTagName('body')[0];

        var span = document.createElement('span');
        span.style.fontSize = testSize;
        span.innerHTML = testString;
        var defaultWidth = {};
        var defaultHeight = {};

        for (var index in baseFonts) {
            span.style.fontFamily = baseFonts[index];
            body.appendChild(span);
            defaultWidth[baseFonts[index]] = span.offsetWidth;
            defaultHeight[baseFonts[index]] = span.offsetHeight;
            body.removeChild(span);
        }

        var fonts = [
          'Abadi MT Condensed Light', 'Academy Engraved LET', 'ADOBE CASLON PRO', 'Adobe Garamond', 'ADOBE GARAMOND PRO', 'Agency FB', 'Aharoni', 'Albertus Extra Bold', 'Albertus Medium', 'Algerian', 'Amazone BT', 'American Typewriter',
          'American Typewriter Condensed', 'AmerType Md BT', 'Andale Mono', 'Andalus', 'Angsana New', 'AngsanaUPC', 'Antique Olive', 'Aparajita', 'Apple Chancery', 'Apple Color Emoji', 'Apple SD Gothic Neo', 'Arabic Typesetting', 'ARCHER', 'Arial', 'Arial Black', 'Arial Hebrew',
          'Arial MT', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'ARNO PRO', 'Arrus BT', 'Aurora Cn BT', 'AvantGarde Bk BT', 'AvantGarde Md BT', 'AVENIR', 'Ayuthaya', 'Bandy', 'Bangla Sangam MN', 'Bank Gothic', 'BankGothic Md BT', 'Baskerville',
          'Baskerville Old Face', 'Batang', 'BatangChe', 'Bauer Bodoni', 'Bauhaus 93', 'Bazooka', 'Bell MT', 'Bembo', 'Benguiat Bk BT', 'Berlin Sans FB', 'Berlin Sans FB Demi', 'Bernard MT Condensed', 'BernhardFashion BT', 'BernhardMod BT', 'Big Caslon', 'BinnerD',
          'Bitstream Vera Sans Mono', 'Blackadder ITC', 'BlairMdITC TT', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bodoni MT', 'Bodoni MT Black', 'Bodoni MT Condensed', 'Bodoni MT Poster Compressed', 'Book Antiqua', 'Bookman Old Style',
          'Bookshelf Symbol 7', 'Boulder', 'Bradley Hand', 'Bradley Hand ITC', 'Bremen Bd BT', 'Britannic Bold', 'Broadway', 'Browallia New', 'BrowalliaUPC', 'Brush Script MT', 'Calibri', 'Californian FB', 'Calisto MT', 'Calligrapher', 'Cambria', 'Cambria Math', 'Candara',
          'CaslonOpnface BT', 'Castellar', 'Centaur', 'Century', 'Century Gothic', 'Century Schoolbook', 'Cezanne', 'CG Omega', 'CG Times', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charlesworth', 'Charter Bd BT', 'Charter BT', 'Chaucer',
          'ChelthmITC Bk BT', 'Chiller', 'Clarendon', 'Clarendon Condensed', 'CloisterBlack BT', 'Cochin', 'Colonna MT', 'Comic Sans', 'Comic Sans MS', 'Consolas', 'Constantia', 'Cooper Black', 'Copperplate', 'Copperplate Gothic', 'Copperplate Gothic Bold',
          'Copperplate Gothic Light', 'CopperplGoth Bd BT', 'Corbel', 'Cordia New', 'CordiaUPC', 'Cornerstone', 'Coronet', 'Courier', 'Courier New', 'Cuckoo', 'Curlz MT', 'DaunPenh', 'Dauphin', 'David', 'DB LCD Temp', 'DELICIOUS', 'Denmark', 'Devanagari Sangam MN',
          'DFKai-SB', 'Didot', 'DilleniaUPC', 'DIN', 'DokChampa', 'Dotum', 'DotumChe', 'Ebrima', 'Edwardian Script ITC', 'Elephant', 'English 111 Vivace BT', 'Engravers MT', 'EngraversGothic BT', 'Eras Bold ITC', 'Eras Demi ITC', 'Eras Light ITC', 'Eras Medium ITC',
          'Estrangelo Edessa', 'EucrosiaUPC', 'Euphemia', 'Euphemia UCAS', 'EUROSTILE', 'Exotc350 Bd BT', 'FangSong', 'Felix Titling', 'Fixedsys', 'FONTIN', 'Footlight MT Light', 'Forte', 'Franklin Gothic', 'Franklin Gothic Book', 'Franklin Gothic Demi',
          'Franklin Gothic Demi Cond', 'Franklin Gothic Heavy', 'Franklin Gothic Medium', 'Franklin Gothic Medium Cond', 'FrankRuehl', 'Fransiscan', 'Freefrm721 Blk BT', 'FreesiaUPC', 'Freestyle Script', 'French Script MT', 'FrnkGothITC Bk BT', 'Fruitger', 'FRUTIGER',
          'Futura', 'Futura Bk BT', 'Futura Lt BT', 'Futura Md BT', 'Futura ZBlk BT', 'FuturaBlack BT', 'Gabriola', 'Galliard BT', 'Garamond', 'Gautami', 'Geeza Pro', 'Geneva', 'Geometr231 BT', 'Geometr231 Hv BT', 'Geometr231 Lt BT', 'Georgia', 'GeoSlab 703 Lt BT',
          'GeoSlab 703 XBd BT', 'Gigi', 'Gill Sans', 'Gill Sans MT', 'Gill Sans MT Condensed', 'Gill Sans MT Ext Condensed Bold', 'Gill Sans Ultra Bold', 'Gill Sans Ultra Bold Condensed', 'Gisha', 'Gloucester MT Extra Condensed', 'GOTHAM', 'GOTHAM BOLD',
          'Goudy Old Style', 'Goudy Stout', 'GoudyHandtooled BT', 'GoudyOLSt BT', 'Gujarati Sangam MN', 'Gulim', 'GulimChe', 'Gungsuh', 'GungsuhChe', 'Gurmukhi MN', 'Haettenschweiler', 'Harlow Solid Italic', 'Harrington', 'Heather', 'Heiti SC', 'Heiti TC', 'HELV', 'Helvetica',
          'Helvetica Neue', 'Herald', 'High Tower Text', 'Hiragino Kaku Gothic ProN', 'Hiragino Mincho ProN', 'Hoefler Text', 'Humanst 521 Cn BT', 'Humanst521 BT', 'Humanst521 Lt BT', 'Impact', 'Imprint MT Shadow', 'Incised901 Bd BT', 'Incised901 BT',
          'Incised901 Lt BT', 'INCONSOLATA', 'Informal Roman', 'Informal011 BT', 'INTERSTATE', 'IrisUPC', 'Iskoola Pota', 'JasmineUPC', 'Jazz LET', 'Jenson', 'Jester', 'Jokerman', 'Juice ITC', 'Kabel Bk BT', 'Kabel Ult BT', 'Kailasa', 'KaiTi', 'Kalinga', 'Kannada Sangam MN',
          'Kartika', 'Kaufmann Bd BT', 'Kaufmann BT', 'Khmer UI', 'KodchiangUPC', 'Kokila', 'Korinna BT', 'Kristen ITC', 'Krungthep', 'Kunstler Script', 'Lao UI', 'Latha', 'Leelawadee', 'Letter Gothic', 'Levenim MT', 'LilyUPC', 'Lithograph', 'Lithograph Light', 'Long Island',
          'Lucida Bright', 'Lucida Calligraphy', 'Lucida Console', 'Lucida Fax', 'LUCIDA GRANDE', 'Lucida Handwriting', 'Lucida Sans', 'Lucida Sans Typewriter', 'Lucida Sans Unicode', 'Lydian BT', 'Magneto', 'Maiandra GD', 'Malayalam Sangam MN', 'Malgun Gothic',
          'Mangal', 'Marigold', 'Marion', 'Marker Felt', 'Market', 'Marlett', 'Matisse ITC', 'Matura MT Script Capitals', 'Meiryo', 'Meiryo UI', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le',
          'Microsoft Uighur', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU', 'MingLiU_HKSCS', 'MingLiU_HKSCS-ExtB', 'MingLiU-ExtB', 'Minion', 'Minion Pro', 'Miriam', 'Miriam Fixed', 'Mistral', 'Modern', 'Modern No. 20', 'Mona Lisa Solid ITC TT', 'Monaco', 'Mongolian Baiti',
          'MONO', 'Monotype Corsiva', 'MoolBoran', 'Mrs Eaves', 'MS Gothic', 'MS LineDraw', 'MS Mincho', 'MS Outlook', 'MS PGothic', 'MS PMincho', 'MS Reference Sans Serif', 'MS Reference Specialty', 'MS Sans Serif', 'MS Serif', 'MS UI Gothic', 'MT Extra', 'MUSEO', 'MV Boli', 'MYRIAD',
          'MYRIAD PRO', 'Nadeem', 'Narkisim', 'NEVIS', 'News Gothic', 'News GothicMT', 'NewsGoth BT', 'Niagara Engraved', 'Niagara Solid', 'Noteworthy', 'NSimSun', 'Nyala', 'OCR A Extended', 'Old Century', 'Old English Text MT', 'Onyx', 'Onyx BT', 'OPTIMA', 'Oriya Sangam MN',
          'OSAKA', 'OzHandicraft BT', 'Palace Script MT', 'Palatino', 'Palatino Linotype', 'Papyrus', 'Parchment', 'Party LET', 'Pegasus', 'Perpetua', 'Perpetua Titling MT', 'PetitaBold', 'Pickwick', 'Plantagenet Cherokee', 'Playbill', 'PMingLiU', 'PMingLiU-ExtB',
          'Poor Richard', 'Poster', 'PosterBodoni BT', 'PRINCETOWN LET', 'Pristina', 'PTBarnum BT', 'Pythagoras', 'Raavi', 'Rage Italic', 'Ravie', 'Ribbon131 Bd BT', 'Rockwell', 'Rockwell Condensed', 'Rockwell Extra Bold', 'Rod', 'Roman', 'Sakkal Majalla',
          'Santa Fe LET', 'Savoye LET', 'Sceptre', 'Script', 'Script MT Bold', 'SCRIPTINA', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Light', 'Segoe UI Semibold', 'Segoe UI Symbol', 'Serifa', 'Serifa BT', 'Serifa Th BT', 'ShelleyVolante BT', 'Sherwood',
          'Shonar Bangla', 'Showcard Gothic', 'Shruti', 'Signboard', 'SILKSCREEN', 'SimHei', 'Simplified Arabic', 'Simplified Arabic Fixed', 'SimSun', 'SimSun-ExtB', 'Sinhala Sangam MN', 'Sketch Rockwell', 'Skia', 'Small Fonts', 'Snap ITC', 'Snell Roundhand', 'Socket',
          'Souvenir Lt BT', 'Staccato222 BT', 'Steamer', 'Stencil', 'Storybook', 'Styllo', 'Subway', 'Swis721 BlkEx BT', 'Swiss911 XCm BT', 'Sylfaen', 'Synchro LET', 'System', 'Tahoma', 'Tamil Sangam MN', 'Technical', 'Teletype', 'Telugu Sangam MN', 'Tempus Sans ITC',
          'Terminal', 'Thonburi', 'Times', 'Times New Roman', 'Times New Roman PS', 'Traditional Arabic', 'Trajan', 'TRAJAN PRO', 'Trebuchet MS', 'Tristan', 'Tubular', 'Tunga', 'Tw Cen MT', 'Tw Cen MT Condensed', 'Tw Cen MT Condensed Extra Bold',
          'TypoUpright BT', 'Unicorn', 'Univers', 'Univers CE 55 Medium', 'Univers Condensed', 'Utsaah', 'Vagabond', 'Vani', 'Verdana', 'Vijaya', 'Viner Hand ITC', 'VisualUI', 'Vivaldi', 'Vladimir Script', 'Vrinda', 'Westminster', 'WHITNEY', 'Wide Latin', 'Wingdings',
          'Wingdings 2', 'Wingdings 3', 'ZapfEllipt BT', 'ZapfHumnst BT', 'ZapfHumnst Dm BT', 'Zapfino', 'Zurich BlkEx BT', 'Zurich Ex BT', 'ZWAdobeF'
        ];

        var fragment = document.createDocumentFragment();
        var selectedSpans;
        var el;

        for (var i = 0; i < fonts.length; i++) {
            el = document.createElement('span');
            el.id = fonts[i];
            el.className = "text-span";
            el.style.fontSize = "72px";
            el.style.fontFamily = fonts[i] + ', monospace';
            el.innerText = testString;
            fragment.appendChild(document.createElement('div'))
            fragment.appendChild(el);
        };

        var wrapper = document.createElement("div");
        body.appendChild(wrapper);
        wrapper.appendChild(fragment);

        selectedSpans = document.getElementsByClassName('text-span');

        for (var x = 0; x < selectedSpans.length; x++) {
            var mySpan = selectedSpans[x];
            var passed = mySpan.offsetWidth !== defaultWidth[baseFonts[0]] || mySpan.offsetHeight !== defaultHeight[baseFonts[0]];

            if (passed) {
                result.push(mySpan.id);
            }
        }

        body.removeChild(wrapper);
        dfp.fonts = result.join();
    };

    var getAllResults = function ()
    {
        privateFunction();
        return { fingerprint: dfp };
    };

    var privateFunction = function () {
        userAgentBrowserResult();
        userAgentStringResult();
        userAgentDeviceResult();
        userAgentEngineResult();
        userAgentOSResult();
        userAgentCPUResult();
        userAgentPlatformResult();
        languageResult();
        colorDepthResult();
        pixelRatioResult();
        screenResolutionResult();
        availableScreenResolutionResult();
        timeZoneResult();
        timezoneOffsetResult();
        localStorageResult();
        sessionStorageResult();
        indexedDbResult();
        addBehaviorResult();
        openDatabaseResult();
        cpuClassResult();
        platformResult();
        doNotTrackResult();
        pluginsResult();
        canvasResult();
        webglResult();
        adBlockResult();
        userTamperLanguageResults();
        userTamperScreenResolutionResults();
        userTamperOSResults();
        userTamperBrowserResults();
        touchSupportResult();
        cookieSupportResult();
        fontsResult();
    };

    var init = function ()
    {
        if (document.readyState !== 'loading')
            privateFunction();
        else
            document.addEventListener('DOMContentLoaded', privateFunction);
    };

    return { init: init, getAllResults: getAllResults };
}());

// secureAuth.fingerprint.init();
