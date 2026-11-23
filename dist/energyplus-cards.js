/*
 * EnergyPlus cards for Home Assistant dashboards — v1.0.0
 * custom:energyplus-kpi-card
 * custom:energyplus-live-flow-card
 * custom:energyplus-devices-card
 * custom:energyplus-solar-card
 * custom:energyplus-costs-card
 * custom:energyplus-tariff-card
 * custom:energyplus-cycles-card
 *
 * https://github.com/martijntalens/energyplus-cards — part of https://github.com/martijntalens/EnergyPlus
 * Reads the Energy dashboard configuration and statistics of Home Assistant.
 * Read-only, no external requests. Generated file — edit cards/src in the EnergyPlus repository.
 */
(() => {
'use strict';
if (window.__energyplusCardsLoaded) return;
window.__energyplusCardsLoaded = true;
/* ======================================================================
 * EnergyPlus card core — shared by every EnergyPlus dashboard card.
 * Reads the Energy dashboard configuration and long-term statistics through
 * the Home Assistant connection of the logged-in user. Read-only.
 * ==================================================================== */
const EP_VERSION = '1.0.0';
const EP_REPO = 'https://github.com/martijntalens/energyplus-cards';

/* ---------- i18n ---------- */
const TEXT = {
  nl: {
    day: 'Dag', week: 'Week', month: 'Maand', year: 'Jaar',
    prev_day: 'gisteren', prev_week: 'vorige week', prev_month: 'vorige maand', prev_year: 'vorig jaar',
    unit_day: 'uur', unit_week: 'dag', unit_month: 'dag', unit_year: 'maand',
    previous: 'Vorige periode', next: 'Volgende periode', now: 'Nu',
    loading: 'Laden…', no_energy: 'Het Energie-dashboard van Home Assistant is nog niet ingericht.',
    no_data: 'Geen gegevens in deze periode.', error: 'Kon de gegevens niet laden',
    dal: 'Daltarief', piek: 'Piektarief', enkel: 'Enkel tarief', band_dal: 'dal',
    home: 'Verbruik thuis', grid_in: 'Van het net', export: 'Teruglevering', solar: 'Zonne-opbrengst',
    self_sufficiency: 'Zelfvoorzienend', battery: 'Batterij ontladen', net_cost: 'Netto stroomkosten', gas: 'Gas', water: 'Water',
    avg_per: 'gem. {v} per {u}', net: 'netto {v}', compensation: 'vergoeding {v}', self_used: '{v} zelf gebruikt',
    own_gen: 'uit eigen opwek', own_gen_bat: 'eigen opwek + batterij', charged: 'geladen {v}', per_kwh: '{v} per kWh',
    vs: 't.o.v. {p}', same_moment: ' (zelfde tijdstip)', pp: 'procentpunt',
    untracked: 'Niet apart gemeten', total_use: 'Totaal verbruik', ranking: 'Ranglijst', timeline: 'Verloop', cost_hint: 'kosten tegen het dal- of piektarief van dat moment',
    cost_note: 'Kosten = verbruik × de prijs van het tarief (dal/piek) dat op dat uur gold. Ook stroom van je zonnepanelen telt mee tegen dat tarief.',
    production: 'Opbrengst', direct: 'Direct verbruikt', to_battery: 'Naar batterij', exported: 'Teruggeleverd', self_consumption: 'Zelfconsumptie',
    best: 'Beste {u}', forecast: 'Verwachting',
    electricity: 'Stroom', comp_short: 'Vergoeding', comp_long: 'Vergoeding teruglevering', total_net: 'Totaal netto', net_short: 'Netto', costs: 'Kosten',
    tariff: 'Tarief', import: 'Afname', feed_in: 'Teruglevering', price_kwh: 'Prijs/kWh', total: 'Totaal', tariff_sub: 'Afname en teruglevering per telwerk: tarief 1 = dal, tarief 2 = piek.',
    import_of: 'Afname {t}', feed_in_of: 'Teruglevering {t}',
    t_kpi: 'Kerncijfers', t_live: 'Live energiestroom', t_devices: 'Verbruikers', t_solar: 'Zonnepanelen', t_costs: 'Kosten', t_tariff: 'Dal- en piektarief', t_cycles: 'Apparaatcycli',
    grid: 'Net', sun: 'Zon', house: 'Thuis', bat: 'Batterij', importing: 'afname', exporting: 'teruglevering', measured_devices: 'gemeten apparaten',
    charging: 'laden', discharging: 'ontladen', idle: 'rust', no_update: '{a} geen update', last_reading: 'laatste meting {a} geleden',
    devices_gt_home: 'apparaten > huis', unknown_tip: '{n}: onbekend — de apparaten samen ({d}) verbruiken meer dan het huis ({h})',
    no_live: 'Geen vermogenssensoren gevonden. Stel ze in bij de kaartopties.',
    cycles_hint: 'Starttijd per beurt, herkend uit het uurverbruik · dal = 23–7 uur en weekend',
    device: 'Apparaat', runs: 'Beurten', per_week: 'Per week', kwh_run: 'kWh per beurt', cost_run: 'Kosten per beurt', cost_total: 'Kosten totaal', in_dal: 'In dal', usually: 'Meestal om', last_time: 'Laatste keer',
    running_now: 'draait nu · {w}', hours: '{n} uur', in_dal_share: '{p} in daltarief', no_cycle_devices: 'Geen wasmachine, droger, vaatwasser of oven gevonden bij de apparaten in het Energie-dashboard.',
    f_title: 'Titel (leeg = standaard)', f_period: 'Standaardperiode', f_show_navigation: 'Periodekeuze tonen', f_compare: 'Vergelijken met vorige periode',
    f_view: 'Weergave', f_show_cost: 'Kosten tonen', f_grid_power: 'Vermogen net (W)', f_grid_power_export: 'Vermogen teruglevering (W, optioneel)',
    f_solar_power: 'Vermogen zonnepanelen (W)', f_battery_power: 'Vermogen batterij (W)', f_battery_soc: 'Laadniveau batterij (%)', f_show_devices: 'Apparaten tonen',
    f_stale_minutes: 'Markeer sensoren zonder update na (min)', f_tiles: 'Tegels (leeg = alle)', f_energy_date_selection: 'Datumkiezer van het Energie-dashboard volgen',
  },
  en: {
    day: 'Day', week: 'Week', month: 'Month', year: 'Year',
    prev_day: 'yesterday', prev_week: 'last week', prev_month: 'last month', prev_year: 'last year',
    unit_day: 'hour', unit_week: 'day', unit_month: 'day', unit_year: 'month',
    previous: 'Previous period', next: 'Next period', now: 'Now',
    loading: 'Loading…', no_energy: 'The Home Assistant Energy dashboard has not been set up yet.',
    no_data: 'No data in this period.', error: 'Could not load the data',
    dal: 'Off-peak', piek: 'Peak', enkel: 'Single rate', band_dal: 'off-peak',
    home: 'Home consumption', grid_in: 'From grid', export: 'Returned to grid', solar: 'Solar production',
    self_sufficiency: 'Self-sufficiency', battery: 'Battery discharged', net_cost: 'Net electricity cost', gas: 'Gas', water: 'Water',
    avg_per: 'avg. {v} per {u}', net: 'net {v}', compensation: 'compensation {v}', self_used: '{v} used yourself',
    own_gen: 'from own production', own_gen_bat: 'own production + battery', charged: 'charged {v}', per_kwh: '{v} per kWh',
    vs: 'vs {p}', same_moment: ' (same point in time)', pp: 'percentage points',
    untracked: 'Not measured separately', total_use: 'Total consumption', ranking: 'Ranking', timeline: 'Timeline', cost_hint: 'cost at the off-peak or peak rate of that moment',
    cost_note: 'Cost = consumption × the price of the rate (off-peak/peak) that applied in that hour. Solar energy counts at that rate too.',
    production: 'Production', direct: 'Used directly', to_battery: 'To battery', exported: 'Returned', self_consumption: 'Self-consumption',
    best: 'Best {u}', forecast: 'Forecast',
    electricity: 'Electricity', comp_short: 'Compensation', comp_long: 'Feed-in compensation', total_net: 'Net total', net_short: 'Net', costs: 'Costs',
    tariff: 'Rate', import: 'Import', feed_in: 'Returned', price_kwh: 'Price/kWh', total: 'Total', tariff_sub: 'Import and return per meter register: tariff 1 = off-peak, tariff 2 = peak.',
    import_of: 'Import {t}', feed_in_of: 'Returned {t}',
    t_kpi: 'Key figures', t_live: 'Live energy flow', t_devices: 'Devices', t_solar: 'Solar panels', t_costs: 'Costs', t_tariff: 'Off-peak and peak', t_cycles: 'Appliance cycles',
    grid: 'Grid', sun: 'Solar', house: 'Home', bat: 'Battery', importing: 'import', exporting: 'returning', measured_devices: 'measured devices',
    charging: 'charging', discharging: 'discharging', idle: 'idle', no_update: '{a} no update', last_reading: 'last reading {a} ago',
    devices_gt_home: 'devices > home', unknown_tip: '{n}: unknown — the devices together ({d}) use more than the home ({h})',
    no_live: 'No power sensors found. Set them in the card options.',
    cycles_hint: 'Start time per run, detected from hourly use · off-peak = 23–7 h and weekends',
    device: 'Device', runs: 'Runs', per_week: 'Per week', kwh_run: 'kWh per run', cost_run: 'Cost per run', cost_total: 'Total cost', in_dal: 'Off-peak', usually: 'Usually at', last_time: 'Last run',
    running_now: 'running · {w}', hours: '{n} h', in_dal_share: '{p} at off-peak rate', no_cycle_devices: 'No washing machine, dryer, dishwasher or oven found among the Energy dashboard devices.',
    f_title: 'Title (empty = default)', f_period: 'Default period', f_show_navigation: 'Show period selector', f_compare: 'Compare with previous period',
    f_view: 'View', f_show_cost: 'Show cost', f_grid_power: 'Grid power (W)', f_grid_power_export: 'Export power (W, optional)',
    f_solar_power: 'Solar power (W)', f_battery_power: 'Battery power (W)', f_battery_soc: 'Battery state of charge (%)', f_show_devices: 'Show devices',
    f_stale_minutes: 'Mark sensors without update after (min)', f_tiles: 'Tiles (empty = all)', f_energy_date_selection: 'Follow the Energy dashboard date picker',
  },
};
const langOf = (hass) =>
  String((hass && ((hass.locale && hass.locale.language) || hass.language)) || document.documentElement.lang || navigator.language || 'nl')
    .toLowerCase()
    .startsWith('en') ? 'en' : 'nl';
function tr(hass, key, vars) {
  let s = TEXT[langOf(hass)][key] ?? TEXT.nl[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  return s;
}
const localeOf = (hass) => (langOf(hass) === 'en' ? 'en-GB' : 'nl-NL');

/* ---------- palette (validated for colour-vision deficiency) ---------- */
const PAL = {
  light: {
    solar: '#eda100', battery: '#e87ba4', grid: '#2a78d6', export: '#1baf7a', charge: '#6250d6', gas: '#eb6834', water: '#6250d6',
    home: '#52514e', prev: '#898781', other: '#b5b3ab', warn: '#fab219', warnInk: '#8a5a00', good: '#006300', bad: '#b42323',
    d: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948'],
    piek: '#eb6834', piekOut: '#eda100',
  },
  dark: {
    solar: '#c98500', battery: '#d55181', grid: '#3987e5', export: '#199e70', charge: '#9085e9', gas: '#d95926', water: '#9085e9',
    home: '#c3c2b7', prev: '#898781', other: '#5f5e5a', warn: '#fab219', warnInk: '#e0a43a', good: '#0ca30c', bad: '#e66767',
    d: ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#0ca30c', '#9085e9', '#e66767'],
    piek: '#d95926', piekOut: '#c98500',
  },
};
const palOf = (hass) => PAL[hass && hass.themes && hass.themes.darkMode ? 'dark' : 'light'];

/* ---------- formatting ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const sum = (arr, f = (x) => x) => arr.reduce((s, x) => s + (f(x) || 0), 0);
const clamp0 = (v) => (v > 0 ? v : 0);
const toMs = (v) => (typeof v === 'number' ? (v < 1e11 ? v * 1000 : v) : Date.parse(v));
function makeFmt(hass) {
  const loc = localeOf(hass);
  const cache = {};
  const nf = (d) => (cache[d] ||= new Intl.NumberFormat(loc, { minimumFractionDigits: d, maximumFractionDigits: d }));
  const num = (v, d = 1) => nf(d).format(v || 0);
  const kwhParts = (v) => {
    const a = Math.abs(v || 0);
    if (a >= 10000) return [num(v / 1000, 2), 'MWh'];
    return [num(v, a < 1 ? 2 : a < 100 ? 1 : 0), 'kWh'];
  };
  const currency = (hass && hass.config && hass.config.currency) || 'EUR';
  const money = (v, d = 2) => new Intl.NumberFormat(loc, { style: 'currency', currency, minimumFractionDigits: d, maximumFractionDigits: d }).format(v || 0);
  const W = (v) => (Math.abs(v) >= 1000 ? `${num(v / 1000, 2)} kW` : `${num(v, 0)} W`);
  return {
    loc, num, kwhParts, money, W,
    kwh: (v) => kwhParts(v).join(' '),
    pct: (v) => (isFinite(v) ? `${num(v * 100, 0)}%` : '–'),
    unit: (v, u) => `${num(v, Math.abs(v) < 10 ? 2 : Math.abs(v) < 100 ? 1 : 0)} ${u}`,
    water: (l) => (l >= 10000 ? `${num(l / 1000, 1)} m³` : `${num(l, 0)} L`),
    age: (ms) => (ms == null ? '' : ms < 60e3 ? `${Math.round(ms / 1000)} s` : ms < 3600e3 ? `${Math.round(ms / 60e3)} min` : `${num(ms / 3600e3, 1)} ${langOf(hass) === 'en' ? 'h' : 'uur'}`),
  };
}

/* ---------- dates ---------- */
const MONTHS = { nl: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'], en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] };
const DOW = { nl: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };
function rangeFor(period, anchor) {
  const a = new Date(anchor);
  const y = a.getFullYear(), m = a.getMonth(), d = a.getDate();
  if (period === 'day') return { start: new Date(y, m, d), end: new Date(y, m, d + 1) };
  if (period === 'week') {
    const dow = (a.getDay() + 6) % 7;
    return { start: new Date(y, m, d - dow), end: new Date(y, m, d - dow + 7) };
  }
  if (period === 'month') return { start: new Date(y, m, 1), end: new Date(y, m + 1, 1) };
  return { start: new Date(y, 0, 1), end: new Date(y + 1, 0, 1) };
}
function shiftAnchor(period, anchor, n) {
  const a = new Date(anchor);
  if (period === 'day') a.setDate(a.getDate() + n);
  else if (period === 'week') a.setDate(a.getDate() + 7 * n);
  else if (period === 'month') (a.setDate(1), a.setMonth(a.getMonth() + n));
  else a.setFullYear(a.getFullYear() + n);
  return a;
}
function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  return Math.ceil(((d - new Date(Date.UTC(d.getUTCFullYear(), 0, 1))) / 864e5 + 1) / 7);
}
/** Display buckets for a period: hours for a day, days for week/month, months for a year. */
function makeBuckets(hass, period, start, end) {
  const L = langOf(hass), M = MONTHS[L], Dw = DOW[L];
  const out = [];
  const c = new Date(start);
  while (c < end) {
    const s = new Date(c);
    let label, title;
    if (period === 'day') {
      label = String(s.getHours()).padStart(2, '0');
      title = `${label}:00 – ${String((s.getHours() + 1) % 24).padStart(2, '0')}:00`;
      c.setHours(c.getHours() + 1);
    } else if (period === 'year') {
      label = M[s.getMonth()];
      title = `${s.toLocaleDateString(localeOf(hass), { month: 'long' })} ${s.getFullYear()}`;
      c.setMonth(c.getMonth() + 1);
    } else {
      label = period === 'week' ? `${Dw[s.getDay()]} ${s.getDate()}` : String(s.getDate());
      title = `${Dw[s.getDay()]} ${s.getDate()} ${M[s.getMonth()]} ${s.getFullYear()}`;
      c.setDate(c.getDate() + 1);
    }
    out.push({ start: s.getTime(), label, title });
  }
  return out;
}
function bucketIndex(starts, ts) {
  let lo = 0, hi = starts.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (starts[mid] <= ts) (ans = mid), (lo = mid + 1);
    else hi = mid - 1;
  }
  return ans;
}
function periodLabel(hass, period, anchor) {
  const { start, end } = rangeFor(period, anchor);
  const loc = localeOf(hass), M = MONTHS[langOf(hass)];
  if (period === 'day') return start.toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  if (period === 'week') {
    const last = new Date(end - 864e5);
    return `${langOf(hass) === 'en' ? 'Week' : 'Week'} ${isoWeek(start)} · ${start.getDate()} ${M[start.getMonth()]} – ${last.getDate()} ${M[last.getMonth()]}`;
  }
  if (period === 'month') return start.toLocaleDateString(loc, { month: 'long', year: 'numeric' });
  return String(start.getFullYear());
}

/* ---------- model: which statistics make up the energy picture ---------- */
function findKeys(obj, key, out = []) {
  if (!obj || typeof obj !== 'object') return out;
  for (const [k, v] of Object.entries(obj)) {
    if (k === key && typeof v === 'string' && v) out.push(v);
    else if (typeof v === 'object') findKeys(v, key, out);
  }
  return out;
}
function buildModel(prefs, info) {
  const cs = (info && info.cost_sensors) || {};
  const costOf = (stat, id) => stat || cs[id] || null;
  const m = { gridIn: [], gridOut: [], solar: [], batteries: [], gas: [], water: [], devices: [], rates: { grid: [], solar: [], battery: [] }, forecast: [] };
  for (const src of (prefs && prefs.energy_sources) || []) {
    if (src.type === 'grid') {
      const froms = [...(src.flow_from || [])], tos = [...(src.flow_to || [])];
      if (src.stat_energy_from) froms.push(src);
      if (src.stat_energy_to) tos.push(src);
      for (const f of froms)
        if (f.stat_energy_from)
          m.gridIn.push({
            id: f.stat_energy_from,
            cost: costOf(f.stat_cost, f.stat_energy_from),
            fixedPrice: typeof f.number_energy_price === 'number' ? f.number_energy_price : null,
            priceEntity: f.entity_energy_price || null,
          });
      for (const t of tos) if (t.stat_energy_to) m.gridOut.push({ id: t.stat_energy_to, comp: costOf(t.stat_compensation, t.stat_energy_to) });
      m.rates.grid.push(...findKeys(src, 'stat_rate'));
    } else if (src.type === 'solar' && src.stat_energy_from) {
      m.solar.push({ id: src.stat_energy_from });
      m.rates.solar.push(...findKeys(src, 'stat_rate'));
      if (Array.isArray(src.config_entry_solar_forecast)) m.forecast.push(...src.config_entry_solar_forecast);
    } else if (src.type === 'battery') {
      m.batteries.push({ out: src.stat_energy_from || null, in: src.stat_energy_to || null });
      m.rates.battery.push(...findKeys(src, 'stat_rate'));
    } else if (src.type === 'gas' && src.stat_energy_from) {
      m.gas.push({ id: src.stat_energy_from, cost: costOf(src.stat_cost, src.stat_energy_from) });
    } else if (src.type === 'water' && src.stat_energy_from) {
      m.water.push({ id: src.stat_energy_from, cost: costOf(src.stat_cost, src.stat_energy_from) });
    }
  }
  const devIds = new Set();
  for (const d of (prefs && prefs.device_consumption) || []) {
    if (!d.stat_consumption || devIds.has(d.stat_consumption)) continue;
    devIds.add(d.stat_consumption);
    m.devices.push({ id: d.stat_consumption, name: d.name || null, parent: d.included_in_stat || null, rate: d.stat_rate || null });
  }
  for (const d of m.devices) if (d.parent && !devIds.has(d.parent)) d.parent = null;
  m.devices.forEach((d, i) => (d.slot = i < 8 ? i : -1));
  m.hasCost = m.gridIn.some((g) => g.cost) || m.gridOut.some((g) => g.comp);
  m.hasBattery = m.batteries.length > 0;
  m.hasSolar = m.solar.length > 0;
  m.elecBase = [...m.gridIn.map((g) => g.id), ...m.gridOut.map((g) => g.id), ...m.solar.map((s) => s.id), ...m.batteries.flatMap((b) => [b.in, b.out])].filter(Boolean);
  m.elecAll = [...m.elecBase, ...m.gridIn.map((g) => g.cost), ...m.gridOut.map((g) => g.comp), ...m.devices.map((d) => d.id)].filter(Boolean);
  m.gasAll = m.gas.flatMap((g) => [g.id, g.cost]).filter(Boolean);
  m.waterAll = m.water.flatMap((g) => [g.id, g.cost]).filter(Boolean);
  return m;
}
const devColor = (P, d) => (d && d.slot >= 0 ? P.d[d.slot] : P.other);

/* ---------- tariffs: tariff 1 = dal (off-peak), tariff 2 = piek (peak) ---------- */
function classifyTariff(id, name, index, count) {
  if (count < 2) return 'enkel';
  const t = `${id} ${name || ''}`.toLowerCase();
  if (/off[ _-]?peak|\blow\b|_low|laag|\bdal|tarif+[ _-]?1\b|tariff[ _-]?1\b|\bt1\b|_t1\b|_1$/.test(t)) return 'dal';
  if (/peak|\bhigh\b|_high|hoog|normaal|normal|piek|tarif+[ _-]?2\b|tariff[ _-]?2\b|\bt2\b|_t2\b|_2$/.test(t)) return 'piek';
  return index === 0 ? 'dal' : index === 1 ? 'piek' : `t${index + 1}`;
}
function classifyTariffs(m, meta) {
  m.gridIn.forEach((g, i) => (g.tariff = classifyTariff(g.id, meta[g.id] && meta[g.id].name, i, m.gridIn.length)));
  m.gridOut.forEach((g, i) => (g.tariff = classifyTariff(g.id, meta[g.id] && meta[g.id].name, i, m.gridOut.length)));
  m.tariffKeys = [...new Set([...m.gridIn, ...m.gridOut].map((g) => g.tariff))];
}
const tariffName = (hass, k) => (['dal', 'piek', 'enkel'].includes(k) ? tr(hass, k) : k.toUpperCase());
function tariffWeights(m, r, hourly) {
  const w = {};
  const from = (map, list) => {
    let tot = 0;
    for (const g of list) tot += clamp0(map[g.id] || 0);
    if (tot <= 1e-4) return false;
    for (const g of list) w[g.tariff] = (w[g.tariff] || 0) + clamp0(map[g.id] || 0) / tot;
    return true;
  };
  if (from(r.tariffIn, m.gridIn) || from(r.tariffOut, m.gridOut)) return w;
  const keys = m.tariffKeys || [];
  if (keys.length === 1) return { [keys[0]]: 1 };
  if (keys.includes('dal') && keys.includes('piek')) {
    const d = new Date(r.ts), dow = d.getDay(), weekend = dow === 0 || dow === 6;
    const dalShare = weekend ? 1 : hourly ? (d.getHours() < 7 || d.getHours() >= 23 ? 1 : 0) : 8 / 24;
    return { dal: dalShare, piek: 1 - dalShare };
  }
  return w;
}
/** Price per kWh per tariff: historic cost statistics first, then fixed price, then the price entity. */
function tariffPrices(m, records, livePrices) {
  const prices = {}, kwh = {}, cost = {};
  for (const r of records)
    for (const g of m.gridIn) {
      kwh[g.tariff] = (kwh[g.tariff] || 0) + clamp0(r.tariffIn[g.id] || 0);
      cost[g.tariff] = (cost[g.tariff] || 0) + (r.costIn[g.id] || 0);
    }
  for (const k of Object.keys(kwh)) if (kwh[k] > 0.05 && cost[k] > 0) prices[k] = cost[k] / kwh[k];
  for (const g of m.gridIn) {
    if (prices[g.tariff] != null) continue;
    if (g.fixedPrice != null) prices[g.tariff] = g.fixedPrice;
    else if (livePrices[g.priceEntity] != null) prices[g.tariff] = livePrices[g.priceEntity];
  }
  return prices;
}
const SHIFTABLE = /was|droger|droog|vaatwas|dish|wash|dryer|boiler/i;

/* ---------- calculations ---------- */
const NUM_FIELDS = ['fromGrid', 'toGrid', 'solar', 'batIn', 'batOut', 'cost', 'comp', 'gas', 'gasCost', 'water', 'waterCost',
  'home', 'solarToHome', 'solarToBat', 'solarToGrid', 'gridToHome', 'gridToBat', 'batToHome', 'batToGrid', 'homeCost', 'shiftPiek'];
const MAP_FIELDS = ['dev', 'devCost', 'tariffIn', 'tariffOut', 'costIn', 'compOut', 'homeTariff'];
const emptyAgg = () => {
  const o = { n: 0 };
  for (const k of NUM_FIELDS) o[k] = 0;
  for (const k of MAP_FIELDS) o[k] = {};
  return o;
};
function mergeInto(a, r) {
  a.n++;
  for (const k of NUM_FIELDS) a[k] += r[k] || 0;
  for (const k of MAP_FIELDS) for (const [id, v] of Object.entries(r[k] || {})) a[k][id] = (a[k][id] || 0) + v;
}
/** Split meter readings into flows (same idea as the built-in Energy dashboard). */
function decompose(r) {
  const fg = clamp0(r.fromGrid), tg = clamp0(r.toGrid), so = clamp0(r.solar), bi = clamp0(r.batIn), bo = clamp0(r.batOut);
  const home = clamp0(fg + so + bo - tg - bi);
  const solarToHome = Math.min(so, home);
  let rem = home - solarToHome;
  const batToHome = Math.min(bo, rem);
  rem -= batToHome;
  const gridToHome = Math.min(fg, rem);
  let solarLeft = so - solarToHome;
  const solarToBat = Math.min(solarLeft, bi);
  solarLeft -= solarToBat;
  const solarToGrid = Math.min(solarLeft, tg);
  const gridToBat = clamp0(Math.min(fg - gridToHome, bi - solarToBat));
  const batToGrid = clamp0(Math.min(bo - batToHome, tg - solarToGrid));
  return { home, solarToHome, solarToBat, solarToGrid, gridToHome, gridToBat, batToHome, batToGrid };
}
function compute(ctx, raw, bucketStarts, cutoff = Infinity) {
  const m = ctx.m;
  const recs = new Map();
  const add = (id, fn) => {
    if (!id) return;
    for (const p of raw[id] || []) {
      const ts = toMs(p.start);
      const v = p.change;
      if (ts >= cutoff || v == null || !isFinite(v)) continue;
      let r = recs.get(ts);
      if (!r) recs.set(ts, (r = { ts, ...emptyAgg() }));
      fn(r, v);
    }
  };
  for (const g of m.gridIn) {
    add(g.id, (r, v) => ((r.fromGrid += v), (r.tariffIn[g.id] = (r.tariffIn[g.id] || 0) + v)));
    add(g.cost, (r, v) => ((r.cost += v), (r.costIn[g.id] = (r.costIn[g.id] || 0) + v)));
  }
  for (const g of m.gridOut) {
    add(g.id, (r, v) => ((r.toGrid += v), (r.tariffOut[g.id] = (r.tariffOut[g.id] || 0) + v)));
    add(g.comp, (r, v) => ((r.comp += Math.abs(v)), (r.compOut[g.id] = (r.compOut[g.id] || 0) + Math.abs(v))));
  }
  for (const s of m.solar) add(s.id, (r, v) => (r.solar += v));
  for (const b of m.batteries) {
    add(b.out, (r, v) => (r.batOut += v));
    add(b.in, (r, v) => (r.batIn += v));
  }
  for (const g of m.gas) {
    add(g.id, (r, v) => (r.gas += v));
    add(g.cost, (r, v) => (r.gasCost += v));
  }
  for (const w of m.water) {
    add(w.id, (r, v) => (r.water += v));
    add(w.cost, (r, v) => (r.waterCost += v));
  }
  for (const d of m.devices) add(d.id, (r, v) => (r.dev[d.id] = (r.dev[d.id] || 0) + v));

  const buckets = bucketStarts.map(() => emptyAgg());
  const records = [...recs.values()].sort((a, b) => a.ts - b.ts);
  const hourly = records.length > 1 ? records[1].ts - records[0].ts <= 3600e3 : true;
  records.forEach((r) => Object.assign(r, decompose(r)));
  const prices = tariffPrices(m, records, ctx.livePrices || {});
  const havePrice = Object.keys(prices).length > 0;
  const shiftIds = m.devices.filter((d) => SHIFTABLE.test(devName(ctx, d))).map((d) => d.id);
  for (const r of records) {
    const w = tariffWeights(m, r, hourly);
    let price = 0, wsum = 0;
    for (const [k, share] of Object.entries(w)) {
      if (prices[k] != null) (price += share * prices[k]), (wsum += share);
      r.homeTariff[k] = (r.homeTariff[k] || 0) + share * r.home;
    }
    if (havePrice && wsum > 0) {
      price /= wsum;
      r.homeCost = r.home * price;
      for (const [id, v] of Object.entries(r.dev)) r.devCost[id] = v * price;
    }
    if (w.piek) r.shiftPiek = sum(shiftIds, (id) => r.dev[id] || 0) * w.piek;
    const i = bucketIndex(bucketStarts, r.ts);
    if (i >= 0) mergeInto(buckets[i], r);
  }
  const total = emptyAgg();
  buckets.forEach((b) => b.n && mergeInto(total, b));
  return { buckets, total, records, prices, havePrice, hasData: records.length > 0, hourly };
}
const devName = (ctx, d) => (d && (d.name || (ctx.meta[d.id] && ctx.meta[d.id].name) || d.id)) || '';

/* ---------- data access (shared cache, so several cards on one dashboard share requests) ---------- */
const EP_CACHE = (window.__energyplusCache = window.__energyplusCache || new Map());
function cachedWS(hass, msg, ttl = 300e3) {
  const key = JSON.stringify(msg);
  const hit = EP_CACHE.get(key);
  if (hit && Date.now() - hit.at < ttl) return hit.p;
  const p = hass.callWS(msg);
  EP_CACHE.set(key, { at: Date.now(), p });
  p.catch(() => EP_CACHE.delete(key));
  return p;
}
async function loadContext(hass) {
  const [prefs, info] = await Promise.all([
    cachedWS(hass, { type: 'energy/get_prefs' }, 600e3).catch(() => null),
    cachedWS(hass, { type: 'energy/info' }, 600e3).catch(() => ({})),
  ]);
  if (!prefs || !(prefs.energy_sources || []).length) return null;
  const m = buildModel(prefs, info);
  const ids = [...m.elecBase, ...m.devices.map((d) => d.id), ...m.gas.map((g) => g.id), ...m.water.map((w) => w.id)];
  const md = ids.length ? await cachedWS(hass, { type: 'recorder/get_statistics_metadata', statistic_ids: ids }, 600e3).catch(() => []) : [];
  const meta = {};
  for (const x of md || []) meta[x.statistic_id] = { name: x.name || x.statistic_id, unit: x.statistics_unit_of_measurement || x.display_unit_of_measurement };
  classifyTariffs(m, meta);
  const livePrices = {};
  for (const g of m.gridIn) {
    const st = g.priceEntity && hass.states[g.priceEntity];
    if (st && !isNaN(parseFloat(st.state))) livePrices[g.priceEntity] = parseFloat(st.state);
  }
  return { m, meta, livePrices };
}
function stats(hass, ids, start, end, period, units, ttl) {
  const list = [...new Set(ids.filter(Boolean))];
  if (!list.length) return Promise.resolve({});
  return cachedWS(hass, {
    type: 'recorder/statistics_during_period',
    start_time: new Date(start).toISOString(),
    end_time: new Date(end).toISOString(),
    statistic_ids: list, period, types: ['change'], units,
  }, ttl);
}
async function fetchAll(hass, m, start, end, period, opts = {}) {
  const ttl = end > Date.now() ? 240e3 : 3600e3;
  const [a, b, c] = await Promise.all([
    stats(hass, opts.elecIds || m.elecAll, start, end, period, { energy: 'kWh' }, ttl),
    opts.noGas ? {} : stats(hass, m.gasAll, start, end, period, { volume: 'm³' }, ttl),
    opts.noWater ? {} : stats(hass, m.waterAll, start, end, period, { volume: 'L' }, ttl),
  ]);
  return { ...a, ...b, ...c };
}
/** Everything a period view needs: current period, previous period (full and up to the same moment). */
async function loadPeriod(hass, ctx, period, anchor, { compare = true, range = null } = {}) {
  const { start, end } = range || rangeFor(period, anchor);
  const fetchPeriod = period === 'year' || end - start > 40 * 864e5 ? 'day' : 'hour';
  const buckets = makeBuckets(hass, period, start, end);
  const starts = buckets.map((b) => b.start);
  const now = Date.now();
  const inProgress = now > start && now < end;
  const span = end - start;
  const prevR = range ? { start: new Date(start - span), end: new Date(start) } : rangeFor(period, shiftAnchor(period, anchor, -1));
  const prevCut = inProgress ? prevR.start.getTime() + (now - start.getTime()) : Infinity;
  const [cur, prev] = await Promise.all([
    fetchAll(hass, ctx.m, start, end, fetchPeriod),
    compare ? fetchAll(hass, ctx.m, prevR.start, prevR.end, fetchPeriod) : null,
  ]);
  const C = compute(ctx, cur, starts);
  let P = null, Pcut = null;
  if (prev) {
    const pStarts = makeBuckets(hass, period, prevR.start, prevR.end).map((b) => b.start);
    P = compute(ctx, prev, pStarts);
    Pcut = prevCut === Infinity ? P : compute(ctx, prev, pStarts, prevCut);
  }
  return { start, end, buckets, C, P, Pcut, inProgress, fetchPeriod, period };
}

/* ---------- power sensors for devices (live) ---------- */
const EXPORT_RE = /_returned|_export|_production|_productie|teruglever/;
function isPowerState(st) {
  if (!st || !st.entity_id.startsWith('sensor.')) return false;
  const a = st.attributes || {};
  return a.device_class === 'power' || /^(k|M)?W$/.test(a.unit_of_measurement || '');
}
function findDevicePower(hass, m, overrides = {}) {
  const map = {};
  const ents = hass.entities || {};
  for (const d of m.devices) {
    if (overrides[d.id]) map[d.id] = overrides[d.id];
    else if (d.rate) map[d.id] = d.rate;
    else {
      const dev = ents[d.id] && ents[d.id].device_id;
      let cands = [];
      if (dev)
        cands = Object.values(ents)
          .filter((e) => e.device_id === dev && isPowerState(hass.states[e.entity_id]) && !EXPORT_RE.test(e.entity_id))
          .map((e) => e.entity_id)
          .sort((a, b) => (/power|vermogen/.test(b) ? 1 : 0) - (/power|vermogen/.test(a) ? 1 : 0));
      if (!cands.length) {
        const guess = d.id.replace(/_(today_|total_)?(energy|energie|consumption|verbruik)(_total|_today)?$/, '_power');
        if (guess !== d.id && isPowerState(hass.states[guess])) cands = [guess];
      }
      if (cands[0]) map[d.id] = cands[0];
    }
  }
  return map;
}
function powerW(hass, id) {
  const s = id && hass.states[id];
  if (!s) return null;
  const v = parseFloat(s.state);
  if (!isFinite(v)) return null;
  const u = (s.attributes && s.attributes.unit_of_measurement) || '';
  return /^kW$/i.test(u) ? v * 1000 : /^MW$/i.test(u) ? v * 1e6 : v;
}

/* ---------- SVG charts (no external libraries) ---------- */
function niceTicks(min, max, count = 4) {
  if (min === max) max = min + 1;
  const raw = (max - min) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((f) => f * mag).find((s) => s >= raw) || 10 * mag;
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v / step) * step);
  return ticks;
}
/**
 * Stacked bar chart with optional line series.
 * spec: { labels, titles, series: [{name, color, data, stack, type:'bar'|'line', dashed}], yFmt, valFmt, footer(i) }
 */
function drawBarChart(el, spec, P) {
  const width = el.clientWidth || 400;
  const height = spec.height || 220;
  const n = spec.labels.length;
  const bars = spec.series.filter((s) => s.type !== 'line');
  const lines = spec.series.filter((s) => s.type === 'line');
  let maxV = 0, minV = 0;
  for (let i = 0; i < n; i++) {
    const stacks = {};
    for (const s of bars) {
      const v = s.data[i] || 0;
      const k = `${s.stack || s.name}|${v >= 0 ? '+' : '-'}`;
      stacks[k] = (stacks[k] || 0) + v;
    }
    for (const v of Object.values(stacks)) (maxV = Math.max(maxV, v)), (minV = Math.min(minV, v));
    for (const s of lines) if (s.data[i] != null) (maxV = Math.max(maxV, s.data[i])), (minV = Math.min(minV, s.data[i]));
  }
  const ticks = niceTicks(minV, maxV, height < 200 ? 3 : 4);
  const y0 = ticks[0], y1 = ticks[ticks.length - 1];
  const labW = Math.max(...ticks.map((t) => spec.yFmt(t).length)) * 6.4 + 8;
  const pad = { l: labW, r: 6, t: 8, b: 20 };
  const pw = width - pad.l - pad.r, ph = height - pad.t - pad.b;
  const y = (v) => pad.t + ph - ((v - y0) / (y1 - y0)) * ph;
  const band = pw / Math.max(1, n);
  const bw = Math.max(2, Math.min(26, band * 0.62));
  const cx = (i) => pad.l + band * i + band / 2;
  let svg = '';
  for (const t of ticks) svg += `<line x1="${pad.l}" x2="${width - pad.r}" y1="${y(t)}" y2="${y(t)}" class="${t === 0 ? 'zero' : 'grid'}"/><text x="${pad.l - 6}" y="${y(t) + 4}" class="ylab">${esc(spec.yFmt(t))}</text>`;
  for (let i = 0; i < n; i++) {
    const acc = {};
    for (const s of bars) {
      const v = s.data[i] || 0;
      if (Math.abs(v) < 1e-9) continue;
      const k = `${s.stack || s.name}|${v >= 0 ? '+' : '-'}`;
      const base = acc[k] || 0;
      const top = base + v;
      acc[k] = top;
      const ya = y(Math.max(base, top)), yb = y(Math.min(base, top));
      svg += `<rect x="${cx(i) - bw / 2}" y="${ya}" width="${bw}" height="${Math.max(0.5, yb - ya)}" style="fill:${s.color}" class="bar"/>`;
    }
  }
  for (const s of lines) {
    let d = '', pen = false;
    for (let i = 0; i < n; i++) {
      const v = s.data[i];
      if (v == null) { pen = false; continue; }
      d += `${pen ? 'L' : 'M'}${cx(i)},${y(v)}`;
      pen = true;
    }
    if (d) svg += `<path d="${d}" style="fill:none;stroke:${s.color};stroke-width:2;stroke-linejoin:round${s.dashed ? ';stroke-dasharray:5 4' : ''}"/>`;
  }
  const step = Math.max(1, Math.ceil((n * 30) / pw));
  for (let i = 0; i < n; i += step) svg += `<text x="${cx(i)}" y="${height - 5}" class="xlab">${esc(spec.labels[i])}</text>`;
  for (let i = 0; i < n; i++) svg += `<rect x="${pad.l + band * i}" y="${pad.t}" width="${band}" height="${ph}" class="hit" data-i="${i}"/>`;
  el.innerHTML = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">${svg}</svg><div class="tip" hidden></div>`;
  const tip = el.querySelector('.tip');
  el.querySelectorAll('.hit').forEach((r) => {
    r.addEventListener('mouseenter', () => {
      const i = +r.dataset.i;
      el.querySelectorAll('.hit').forEach((x) => x.classList.toggle('on', x === r));
      let h = `<div class="tt">${esc(spec.titles[i])}</div>`;
      for (const s of spec.series) {
        const v = s.data[i];
        if (v == null || Math.abs(v) < 1e-6) continue;
        h += `<div class="tr"><span><i style="background:${s.color}"></i>${esc(s.name)}</span><b>${esc(spec.valFmt(Math.abs(v), s))}</b></div>`;
      }
      if (spec.footer) h += spec.footer(i);
      tip.innerHTML = h;
      tip.hidden = false;
      const left = cx(i) + 12;
      tip.style.left = `${Math.min(left, width - tip.offsetWidth - 4)}px`;
      if (left + tip.offsetWidth > width) tip.style.left = `${Math.max(0, cx(i) - tip.offsetWidth - 12)}px`;
      tip.style.top = `${pad.t}px`;
    });
  });
  el.querySelector('svg').addEventListener('mouseleave', () => {
    tip.hidden = true;
    el.querySelectorAll('.hit').forEach((x) => x.classList.remove('on'));
  });
}
const legendHtml = (series) =>
  `<div class="legend">${series.map((s) => `<span><i class="${s.type === 'line' ? 'ln' : ''}" style="${s.type === 'line' ? `border-color:${s.color}` : `background:${s.color}`}"></i>${esc(s.name)}</span>`).join('')}</div>`;
const anyNonZero = (arr) => arr.some((v) => Math.abs(v || 0) > 1e-6);

/* ---------- shared styles ---------- */
const BASE_STYLE = `
  :host { display: block; --ep-muted: var(--secondary-text-color); --ep-grid: var(--divider-color, rgba(127,127,127,.2)); --ep-surface-2: var(--secondary-background-color, rgba(127,127,127,.08)); }
  ha-card { container-type: inline-size; overflow: hidden; }
  .head { display: flex; align-items: center; justify-content: space-between; gap: 8px 12px; flex-wrap: wrap; padding: 14px 16px 6px; }
  .head h2 { margin: 0; font-size: 16px; font-weight: 500; color: var(--primary-text-color); }
  .head .hint { font-size: 12px; color: var(--ep-muted); }
  .nav { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .seg { display: inline-flex; padding: 2px; gap: 2px; border-radius: 9px; background: var(--ep-surface-2); }
  .seg button { border: 0; background: transparent; padding: 3px 9px; border-radius: 7px; color: var(--ep-muted); font: inherit; font-size: 12px; cursor: pointer; }
  .seg button[aria-pressed="true"] { background: var(--card-background-color, #fff); color: var(--primary-text-color); box-shadow: 0 1px 2px rgba(0,0,0,.15); }
  .ib { border: 0; background: var(--ep-surface-2); color: var(--primary-text-color); border-radius: 8px; height: 26px; min-width: 26px; font: inherit; cursor: pointer; }
  .ib:disabled { opacity: .35; cursor: default; }
  .pn { display: inline-flex; align-items: center; gap: 6px; }
  .plabel { font-size: 12px; font-weight: 600; color: var(--primary-text-color); min-width: 0; text-align: center; }
  @container (max-width: 520px) { .nav { width: 100%; } .nav .seg { flex: 1; } .nav .seg button { flex: 1; } .pn { width: 100%; justify-content: space-between; } }
  .content { padding: 4px 16px 16px; }
  .empty { color: var(--ep-muted); padding: 18px 0; text-align: center; font-size: 13px; }
  .stats { display: flex; flex-wrap: wrap; gap: 6px 20px; margin: 2px 0 8px; }
  .stats div { font-size: 12px; color: var(--ep-muted); }
  .stats b { display: block; font-size: 17px; color: var(--primary-text-color); font-variant-numeric: tabular-nums; font-weight: 600; }
  .stats i { display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 5px; vertical-align: 1px; }
  .legend { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 12px; color: var(--ep-muted); margin: 4px 0 2px; }
  .legend i { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; vertical-align: -1px; }
  .legend i.ln { width: 14px; height: 0; border-top: 2px dashed; border-radius: 0; vertical-align: 3px; }
  .chart { position: relative; width: 100%; }
  .chart svg { display: block; overflow: visible; }
  .chart .grid { stroke: var(--ep-grid); stroke-width: 1; }
  .chart .zero { stroke: var(--ep-muted); stroke-opacity: .5; stroke-width: 1; }
  .chart .ylab { fill: var(--ep-muted); font-size: 11px; text-anchor: end; font-variant-numeric: tabular-nums; }
  .chart .xlab { fill: var(--ep-muted); font-size: 11px; text-anchor: middle; }
  .chart .bar { stroke: var(--ha-card-background, var(--card-background-color, #fff)); stroke-width: 1; }
  .chart .hit { fill: transparent; }
  .chart .hit.on { fill: rgba(127,127,127,.10); }
  .tip { position: absolute; z-index: 2; pointer-events: none; min-width: 150px; background: var(--card-background-color, #fff); color: var(--primary-text-color);
    border: 1px solid var(--ep-grid); border-radius: 10px; padding: 8px 10px; font-size: 12px; box-shadow: 0 6px 24px rgba(0,0,0,.18); }
  .tip .tt { font-weight: 600; margin-bottom: 4px; }
  .tip .tr { display: flex; justify-content: space-between; gap: 16px; }
  .tip .tr i { display: inline-block; width: 9px; height: 9px; border-radius: 2px; margin-right: 6px; }
  .tip .ft { border-top: 1px solid var(--ep-grid); margin-top: 5px; padding-top: 5px; display: flex; justify-content: space-between; gap: 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; font-variant-numeric: tabular-nums; }
  th, td { padding: 7px 6px; text-align: right; border-bottom: 1px solid var(--ep-grid); white-space: nowrap; }
  th:first-child, td:first-child { text-align: left; }
  th { color: var(--ep-muted); font-weight: 500; font-size: 12px; }
  td small { color: var(--ep-muted); font-size: 11px; }
  .tw { overflow-x: auto; }
  .sw { display: inline-block; width: 9px; height: 9px; border-radius: 3px; margin-right: 7px; }
  .delta { font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; font-size: 12px; }
  .delta.good { color: var(--ep-good); } .delta.bad { color: var(--ep-bad); } .delta.neutral { color: var(--ep-muted); }
`;

/* ---------- base class for period cards ---------- */
const PERIODS = ['day', 'week', 'month', 'year'];
class EnergyPlusBase extends HTMLElement {
  static get usesPeriod() { return true; }
  static getStubConfig() { return {}; }
  setConfig(config) {
    if (!config || typeof config !== 'object') throw new Error('Invalid configuration');
    if (config.period && !PERIODS.includes(config.period)) throw new Error('period must be day, week, month or year');
    const clean = Object.fromEntries(Object.entries(config).filter(([, v]) => v !== undefined && v !== null));
    this._config = { show_navigation: true, compare: true, ...this.constructor.defaults, ...clean };
    this._period = this._config.period || 'day';
    this._anchor = new Date();
    this._data = null;
    if (this._hass) this._load();
  }
  set hass(hass) {
    const first = !this._hass;
    const themeSig = `${!!(hass.themes && hass.themes.darkMode)}|${langOf(hass)}`;
    const changed = themeSig !== this._themeSig;
    this._hass = hass;
    this._themeSig = themeSig;
    if (first) this._load();
    else if (changed && this._data) this._render();
    if (this.onHass) this.onHass(hass);
    if (this._config && this._config.energy_date_selection) this._subscribeEnergy();
  }
  getCardSize() { return 5; }
  getGridOptions() { return { columns: 12, min_columns: 6 }; }
  connectedCallback() {
    clearInterval(this._timer);
    this._timer = setInterval(() => this._data && this._data.inProgress && document.visibilityState === 'visible' && this._load(true), 5 * 60e3);
    if (!this._ro && window.ResizeObserver) this._ro = new ResizeObserver(() => this._drawCharts());
    if (this.shadowRoot) this.shadowRoot.querySelectorAll('.chart').forEach((c) => this._ro && this._ro.observe(c));
  }
  disconnectedCallback() {
    clearInterval(this._timer);
    if (this._ro) this._ro.disconnect();
    if (this._unsubEnergy) (this._unsubEnergy(), (this._unsubEnergy = null));
  }
  /** Optional: follow the date picker of the built-in Energy dashboard (energy-date-selection card). */
  _subscribeEnergy() {
    if (this._unsubEnergy || this._energyTried > 20) return;
    const coll = this._hass.connection && (this._hass.connection[`_energy${this._config.collection_key ? '_' + this._config.collection_key : ''}`]);
    if (!coll || typeof coll.subscribe !== 'function') {
      this._energyTried = (this._energyTried || 0) + 1;
      return;
    }
    this._unsubEnergy = coll.subscribe((d) => {
      if (!d || !d.start) return;
      const start = new Date(d.start), end = d.end ? new Date(d.end) : rangeFor('day', start).end;
      const days = (end - start) / 864e5;
      this._period = days <= 1.01 ? 'day' : days <= 7.01 ? 'week' : days <= 31.5 ? 'month' : 'year';
      this._anchor = start;
      this._extRange = { start, end };
      this._load();
    });
  }
  get L() { return (k, v) => tr(this._hass, k, v); }
  async _load(silent) {
    if (!this._hass || !this._config) return;
    const seq = (this._seq = (this._seq || 0) + 1);
    if (!silent && !this._data) this._shell(`<div class="empty">${esc(this.L('loading'))}</div>`);
    try {
      this._ctx = this._ctx && Date.now() - this._ctxAt < 600e3 ? this._ctx : await loadContext(this._hass);
      this._ctxAt = this._ctxAt && this._ctx ? this._ctxAt : Date.now();
      if (seq !== this._seq) return;
      if (!this._ctx) return this._shell(`<div class="empty">${esc(this.L('no_energy'))}</div>`);
      const data = await this.loadData(this._ctx);
      if (seq !== this._seq) return;
      this._data = data;
      this._render();
    } catch (e) {
      console.error('EnergyPlus card', e);
      this._shell(`<div class="empty">${esc(this.L('error'))}: ${esc(e.message || e)}</div>`);
    }
  }
  loadData(ctx) {
    return loadPeriod(this._hass, ctx, this._period, this._anchor, { compare: this._config.compare, range: this._config.energy_date_selection ? this._extRange : null });
  }
  _headHtml() {
    const c = this._config, L = this.L;
    const title = c.title === '' ? '' : `<h2>${esc(c.title || L(this.constructor.titleKey))}</h2>`;
    let nav = '';
    if (this.constructor.usesPeriod && c.show_navigation && !c.energy_date_selection) {
      const next = rangeFor(this._period, shiftAnchor(this._period, this._anchor, 1)).start > new Date();
      nav = `<div class="nav"><div class="seg">${PERIODS.map((p) => `<button data-p="${p}" aria-pressed="${p === this._period}">${esc(L(p))}</button>`).join('')}</div>
        <span class="pn"><button class="ib" data-nav="-1" aria-label="${esc(L('previous'))}">‹</button><span class="plabel">${esc(periodLabel(this._hass, this._period, this._anchor))}</span>
        <button class="ib" data-nav="1" aria-label="${esc(L('next'))}" ${next ? 'disabled' : ''}>›</button></span></div>`;
    } else if (this.constructor.usesPeriod && this._data && c.title !== '') {
      nav = `<span class="hint">${esc(periodLabel(this._hass, this._period, this._anchor))}</span>`;
    }
    const extra = this.headExtra ? this.headExtra() : '';
    return title || nav || extra ? `<div class="head">${title}${extra}${nav}</div>` : '';
  }
  _shell(body) {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const P = palOf(this._hass);
    this.shadowRoot.innerHTML = `<style>${BASE_STYLE}${this.constructor.style || ''}</style><ha-card style="--ep-good:${P.good};--ep-bad:${P.bad};--ep-warn:${P.warn};--ep-warn-ink:${P.warnInk}">${this._headHtml()}<div class="content${this._config && this._config.title === '' && !this._headHtml() ? ' nohead' : ''}">${body}</div></ha-card>`;
    const root = this.shadowRoot;
    root.querySelectorAll('[data-p]').forEach((b) => b.addEventListener('click', () => ((this._period = b.dataset.p), (this._data = null), this._load())));
    root.querySelectorAll('[data-nav]').forEach((b) => b.addEventListener('click', () => ((this._anchor = shiftAnchor(this._period, this._anchor, +b.dataset.nav)), this._load())));
  }
  _render() {
    if (!this._data || !this._hass) return;
    const P = palOf(this._hass), F = makeFmt(this._hass);
    this._charts = {};
    this._shell(this.renderBody(this._data, this._ctx, P, F));
    if (this.afterRender) this.afterRender(this._data, this._ctx, P, F);
    if (this._ro) this.shadowRoot.querySelectorAll('.chart').forEach((c) => this._ro.observe(c));
    this._drawCharts();
  }
  chart(id, spec) {
    this._charts = this._charts || {};
    this._charts[id] = spec;
    return `<div class="chart" id="${id}"${spec.height === 'auto' ? '' : ` style="height:${spec.height || 220}px"`}></div>`;
  }
  _drawCharts() {
    if (!this.shadowRoot || !this._charts) return;
    const P = palOf(this._hass);
    for (const [id, spec] of Object.entries(this._charts)) {
      const el = this.shadowRoot.getElementById(id);
      if (el && el.clientWidth) (spec.draw || drawBarChart)(el, spec, P);
    }
  }
  /** delta badge versus the previous period (same moment when the period is still running) */
  delta(cur, prev, goodWhenUp) {
    if (!this._config.compare || prev == null || !isFinite(prev) || Math.abs(prev) < 1e-6) return '';
    const d = (cur - prev) / Math.abs(prev);
    if (!isFinite(d)) return '';
    const F = makeFmt(this._hass);
    const cls = Math.abs(d) < 0.005 ? 'neutral' : d > 0 === goodWhenUp ? 'good' : 'bad';
    const arrow = Math.abs(d) < 0.005 ? '→' : d > 0 ? '▲' : '▼';
    const title = this.L('vs', { p: this.L(`prev_${this._period}`) }) + (this._data && this._data.inProgress ? this.L('same_moment') : '');
    return `<span class="delta ${cls}" title="${esc(title)}">${arrow} ${F.num(Math.abs(d) * 100, 0)}%</span>`;
  }
  static formSchema(extra = []) {
    return {
      schema: [
        { name: 'title', selector: { text: {} } },
        { type: 'grid', name: '', flatten: true, schema: [
          { name: 'period', selector: { select: { mode: 'dropdown', options: PERIODS.map((p) => ({ value: p, label: tr(null, p) })) } } },
          { name: 'show_navigation', selector: { boolean: {} } },
        ] },
        ...extra,
        { name: 'energy_date_selection', selector: { boolean: {} } },
      ],
      computeLabel: (s) => tr(null, `f_${s.name}`),
    };
  }
}
function registerCard(tag, cls, name, description) {
  if (!customElements.get(tag)) customElements.define(tag, cls);
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === tag))
    window.customCards.push({ type: tag, name, description, preview: true, documentationURL: EP_REPO });
}

/* ---------------- energyplus-kpi-card ---------------- */
/* EnergyPlus key figures card: tiles with totals and change versus the previous period. */
const KPI_TILES = ['home', 'grid_in', 'export', 'solar', 'self_sufficiency', 'battery', 'net_cost', 'gas', 'water'];
class EnergyPlusKpiCard extends EnergyPlusBase {
  static get titleKey() { return 't_kpi'; }
  static get defaults() { return {}; }
  static getConfigForm() {
    return EnergyPlusBase.formSchema([
      { name: 'compare', selector: { boolean: {} } },
      { name: 'tiles', selector: { select: { multiple: true, mode: 'list', options: KPI_TILES.map((t) => ({ value: t, label: tr(null, t) })) } } },
    ]);
  }
  getCardSize() { return 3; }
  renderBody(D, ctx, P, F) {
    const m = ctx.m, T = D.C.total, Pv = D.Pcut && D.Pcut.total, L = this.L;
    const want = (k) => !(this._config.tiles && this._config.tiles.length) || this._config.tiles.includes(k);
    const tiles = [];
    const tile = (k, color, value, unit, foot, dlt = '', ring = null) => {
      if (!want(k)) return;
      const r = ring == null ? '' : (() => {
        const rr = 15, c = 2 * Math.PI * rr, f = Math.max(0, Math.min(1, ring));
        return `<svg class="ring" viewBox="0 0 40 40"><circle cx="20" cy="20" r="${rr}" fill="none" stroke="var(--ep-grid)" stroke-width="5"/><circle cx="20" cy="20" r="${rr}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${c * f} ${c}" transform="rotate(-90 20 20)"/></svg>`;
      })();
      tiles.push(`<div class="kpi" style="--c:${color}">${r}<div class="lb"><i></i>${esc(L(k))}</div><div class="v">${value}<small>${esc(unit)}</small></div><div class="ft"><span>${foot}</span>${dlt}</div></div>`);
    };
    const filled = D.C.buckets.filter((b) => b.n).length || 1;
    const [hv, hu] = F.kwhParts(T.home);
    tile('home', P.home, hv, hu, esc(L('avg_per', { v: F.kwh(T.home / filled), u: L(`unit_${this._period}`) })), this.delta(T.home, Pv && Pv.home, false));
    if (m.gridIn.length) {
      const [v, u] = F.kwhParts(T.fromGrid);
      tile('grid_in', P.grid, v, u, esc(L('net', { v: F.kwh(T.fromGrid - T.toGrid) })), this.delta(T.fromGrid, Pv && Pv.fromGrid, false));
    }
    if (m.gridOut.length) {
      const [v, u] = F.kwhParts(T.toGrid);
      tile('export', P.export, v, u, m.hasCost ? esc(L('compensation', { v: F.money(T.comp) })) : '', this.delta(T.toGrid, Pv && Pv.toGrid, true));
    }
    if (m.hasSolar) {
      const [v, u] = F.kwhParts(T.solar);
      tile('solar', P.solar, v, u, esc(L('self_used', { v: F.pct((T.solar - T.solarToGrid) / T.solar) })), this.delta(T.solar, Pv && Pv.solar, true));
    }
    if (m.hasSolar || m.hasBattery) {
      const self = T.home > 0 ? (T.home - T.gridToHome) / T.home : 0;
      const pself = Pv && Pv.home > 0 ? (Pv.home - Pv.gridToHome) / Pv.home : null;
      let d = '';
      if (this._config.compare && pself != null) {
        const pp = (self - pself) * 100;
        const cls = Math.abs(pp) < 0.5 ? 'neutral' : pp > 0 ? 'good' : 'bad';
        d = `<span class="delta ${cls}" title="${esc(L('pp'))}">${Math.abs(pp) < 0.5 ? '→' : pp > 0 ? '▲' : '▼'} ${F.num(Math.abs(pp), 0)} pp</span>`;
      }
      tile('self_sufficiency', P.export, F.num(self * 100, 0), '%', esc(L(m.hasBattery ? 'own_gen_bat' : 'own_gen')), d, self);
    }
    if (m.hasBattery) {
      const [v, u] = F.kwhParts(T.batOut);
      tile('battery', P.battery, v, u, esc(L('charged', { v: F.kwh(T.batIn) })), this.delta(T.batOut, Pv && Pv.batOut, true));
    }
    if (m.hasCost) {
      const net = T.cost - T.comp, pnet = Pv ? Pv.cost - Pv.comp : null;
      tile('net_cost', P.grid, esc(F.money(net)), '', T.fromGrid > 0 ? esc(L('per_kwh', { v: F.money(T.cost / T.fromGrid, 3) })) : '', this.delta(net, pnet, false));
    }
    if (m.gas.length) {
      const u = ctx.meta[m.gas[0].id] && ctx.meta[m.gas[0].id].unit && !/m³|ft³|CCF|L/.test(ctx.meta[m.gas[0].id].unit) ? ctx.meta[m.gas[0].id].unit : 'm³';
      tile('gas', P.gas, F.num(T.gas, T.gas < 10 ? 2 : 1), u, T.gasCost ? esc(F.money(T.gasCost)) : '', this.delta(T.gas, Pv && Pv.gas, false));
    }
    if (m.water.length) {
      const [v, u] = F.water(T.water).split(' ');
      tile('water', P.water, v, u, T.waterCost ? esc(F.money(T.waterCost)) : '', this.delta(T.water, Pv && Pv.water, false));
    }
    return `<div class="kpis">${tiles.join('')}</div>`;
  }
}
EnergyPlusKpiCard.style = `
  .kpis { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
  .kpi { position: relative; overflow: hidden; border-radius: 12px; padding: 12px 14px 10px 16px; background: var(--ep-surface-2); }
  .kpi::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--c); }
  .kpi .lb { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ep-muted); font-weight: 500; }
  .kpi .lb i { width: 8px; height: 8px; border-radius: 50%; background: var(--c); }
  .kpi .v { font-size: 24px; font-weight: 650; letter-spacing: -0.02em; margin: 4px 0 2px; font-variant-numeric: tabular-nums; color: var(--primary-text-color); }
  .kpi .v small { font-size: 13px; font-weight: 500; color: var(--ep-muted); margin-left: 3px; }
  .kpi .ft { display: flex; justify-content: space-between; gap: 6px; font-size: 11.5px; color: var(--ep-muted); }
  .kpi .ring { position: absolute; right: 10px; top: 10px; width: 34px; height: 34px; }
`;
registerCard('energyplus-kpi-card', EnergyPlusKpiCard, 'EnergyPlus key figures', 'Consumption, grid, solar, self-sufficiency and costs with change versus the previous period.');

/* ---------------- energyplus-live-flow-card ---------------- */
/* EnergyPlus live flow card: animated power flow from grid and solar to the home and every device. */
class EnergyPlusLiveCard extends EnergyPlusBase {
  static get usesPeriod() { return false; }
  static get titleKey() { return 't_live'; }
  static get defaults() { return { show_devices: true, stale_minutes: 5 }; }
  static getConfigForm() {
    const ent = { entity: { domain: 'sensor', device_class: 'power' } };
    return {
      schema: [
        { name: 'title', selector: { text: {} } },
        { type: 'grid', name: '', flatten: true, schema: [
          { name: 'grid_power', selector: ent }, { name: 'grid_power_export', selector: ent },
          { name: 'solar_power', selector: ent }, { name: 'battery_power', selector: ent },
          { name: 'battery_soc', selector: { entity: { domain: 'sensor', device_class: 'battery' } } },
          { name: 'stale_minutes', selector: { number: { min: 1, max: 120, mode: 'box' } } },
        ] },
        { name: 'show_devices', selector: { boolean: {} } },
      ],
      computeLabel: (s) => tr(null, `f_${s.name}`),
    };
  }
  getCardSize() { return 7; }
  async loadData() { return { live: true }; }
  headExtra() { return this._updated ? `<span class="hint">${esc(this._updated)}</span>` : ''; }
  onHass() {
    if (!this._data || !this._ctx) return;
    const now = Date.now();
    if (this._lastDraw && now - this._lastDraw < 1000) {
      clearTimeout(this._pending);
      this._pending = setTimeout(() => this.onHass(), 1000);
      return;
    }
    const sig = JSON.stringify(this._ids().map((id) => {
      const s = this._hass.states[id];
      return s ? [s.state, Math.floor((now - Date.parse(s.last_reported || s.last_updated)) / 60e3)] : null;
    }));
    if (sig === this._sig) return;
    this._sig = sig;
    this._lastDraw = now;
    this._render();
  }
  _entities() {
    const c = this._config, m = this._ctx.m;
    return {
      grid: c.grid_power || m.rates.grid[0] || '',
      gridExport: c.grid_power_export || '',
      solar: c.solar_power || m.rates.solar[0] || '',
      battery: c.battery_power || m.rates.battery[0] || '',
      soc: c.battery_soc || '',
    };
  }
  _devPower() {
    if (!this._dp || Date.now() - this._dpAt > 60e3) (this._dp = findDevicePower(this._hass, this._ctx.m, this._config.device_power || {})), (this._dpAt = Date.now());
    return this._dp;
  }
  _ids() {
    return [...Object.values(this._entities()), ...Object.values(this._config.show_devices ? this._devPower() : {})].filter(Boolean);
  }
  renderBody(D, ctx, P, F) {
    const E = this._entities(), h = this._hass, c = this._config;
    const dp = c.show_devices ? this._devPower() : {};
    const devs = ctx.m.devices.filter((d) => dp[d.id] && h.states[dp[d.id]]);
    if (!E.grid && !devs.length) return `<div class="empty">${esc(this.L('no_live'))}</div>`;
    const staleMs = (c.stale_minutes || 5) * 60e3;
    const fresh = (ids) => {
      let age = null, stale = false;
      for (const id of ids.filter(Boolean)) {
        const s = h.states[id];
        if (!s) continue;
        const a = Math.max(0, Date.now() - Date.parse(s.last_reported || s.last_updated));
        if (!isFinite(a)) continue;
        age = Math.max(age ?? 0, a);
        if (a > staleMs && Math.abs(powerW(h, id) || 0) > 5) stale = true;
      }
      return { age, stale };
    };
    const state = {
      grid: E.grid ? (powerW(h, E.grid) || 0) - (E.gridExport ? powerW(h, E.gridExport) || 0 : 0) : null,
      solar: E.solar ? Math.max(0, powerW(h, E.solar) || 0) : 0,
      battery: E.battery ? powerW(h, E.battery) || 0 : 0,
      soc: E.soc && h.states[E.soc] ? parseFloat(h.states[E.soc].state) : null,
      hasSolar: !!E.solar, hasBattery: !!E.battery, devs,
      dev: Object.fromEntries(devs.map((d) => [d.id, Math.max(0, powerW(h, dp[d.id]) || 0)])),
      fr: { grid: fresh([E.grid, E.gridExport]), solar: fresh([E.solar]), battery: fresh([E.battery]), dev: Object.fromEntries(devs.map((d) => [d.id, fresh([dp[d.id]])])) },
    };
    this._updated = new Date().toLocaleTimeString(F.loc);
    return this.chart('live', { height: 'auto', draw: (el) => drawLive(el, state, ctx, h) });
  }
}
function drawLive(el, s, ctx, hass) {
  const P = palOf(hass), F = makeFmt(hass), L = (k, v) => tr(hass, k, v);
  const W = F.W, hasGrid = s.grid != null;
  const f = hasGrid ? decompose({ fromGrid: clamp0(s.grid), toGrid: clamp0(-s.grid), solar: s.solar, batOut: clamp0(s.battery), batIn: clamp0(-s.battery) }) : null;
  let rows = [];
  const add = (d, depth) => {
    rows.push({ d, depth, w: s.dev[d.id] || 0, fr: s.fr.dev[d.id] });
    s.devs.filter((c) => c.parent === d.id).forEach((c) => add(c, depth + 1));
  };
  s.devs.filter((d) => !d.parent || !s.devs.some((x) => x.id === d.parent)).forEach((d) => add(d, 0));
  const topW = sum(rows.filter((r) => r.depth === 0), (r) => r.w);
  const homeW = hasGrid ? f.home : topW;
  const mismatch = hasGrid && rows.length > 0 && topW - homeW > Math.max(40, 0.1 * homeW);
  if (hasGrid && rows.length) rows.push({ d: null, depth: 0, w: clamp0(homeW - topW), unknown: mismatch });
  const compact = (el.clientWidth || 600) < 560 && hasGrid;
  const allRows = rows;
  if (compact) rows = [];
  const valText = (r) => (r.unknown ? '?' : W(r.w));
  const ageTitle = (fr) => (fr && fr.age != null ? ` · ${L('last_reading', { a: F.age(fr.age) })}` : '');

  const rowH = 36, VBW = rows.length ? 920 : 470;
  const H = rows.length ? Math.max(300, 30 + rows.length * rowH) : s.hasBattery && hasGrid ? 340 : 250;
  const cy = H / 2 + (s.hasSolar && hasGrid ? 30 : 0);
  const Pp = rows.length
    ? { grid: [80, cy], home: [380, cy], solar: [230, Math.max(50, cy - 135)], battery: [230, Math.min(H - 50, cy + 135)] }
    : { grid: [70, 170], home: [390, 170], solar: [230, 55], battery: [230, 285] };
  if (!hasGrid) Pp.home = [110, cy];
  const flow = (d, val, color) => {
    const on = val > 3;
    const dur = on ? Math.max(0.6, 4 - Math.log10(val + 1)) : 0;
    return `<path class="base" d="${d}"/>${on ? `<path class="flow" d="${d}" style="stroke:${color};stroke-width:${Math.min(6, 2 + val / 1500)};animation-duration:${dur}s"><title>${W(val)}</title></path>` : ''}`;
  };
  const edge = (a, b, val, color, bend = 0) => {
    const [x1, y1] = Pp[a], [x2, y2] = Pp[b];
    return flow(`M${x1},${y1} Q${(x1 + x2) / 2 + bend},${(y1 + y2) / 2 + bend} ${x2},${y2}`, val, color);
  };
  const node = (k, label, value, color, sub = '', fr = null) =>
    `<g class="node" transform="translate(${Pp[k][0]},${Pp[k][1]})"><title>${esc(label)}: ${value}${esc(ageTitle(fr))}</title><circle r="44" style="stroke:${color}"/><text class="t2" y="-10">${esc(label)}</text><text class="t1" y="9">${value}</text>${sub ? `<text class="t2" y="25">${esc(sub)}</text>` : ''}${fr && fr.stale ? `<text class="stale" y="62">⏱ ${esc(L('no_update', { a: F.age(fr.age) }))}</text>` : ''}</g>`;
  let edges = '';
  if (hasGrid) {
    edges += edge('grid', 'home', f.gridToHome, P.grid);
    if (s.hasSolar) edges += edge('solar', 'home', f.solarToHome, P.solar) + edge('solar', 'grid', f.solarToGrid, P.export);
    if (s.hasSolar && s.hasBattery) edges += edge('solar', 'battery', f.solarToBat, P.charge, -40);
    if (s.hasBattery) edges += edge('battery', 'home', f.batToHome, P.battery) + edge('grid', 'battery', f.gridToBat, P.charge) + edge('battery', 'grid', f.batToGrid, P.export, 30);
  }
  const x0 = 560, pillW = 340, maxW = Math.max(1, ...rows.map((r) => r.w));
  const top0 = (H - rows.length * rowH) / 2 + 4;
  let pills = '';
  const parentY = {};
  rows.forEach((r, i) => {
    const y = top0 + i * rowH, x = x0 + r.depth * 26, w = pillW - r.depth * 26, mid = y + 14;
    const color = devColor(P, r.d);
    if (r.depth === 0) {
      const [hx, hy] = Pp.home;
      edges += flow(`M${hx + 44},${hy} C${hx + 120},${hy} ${x - 90},${mid} ${x},${mid}`, r.w, color);
    } else {
      const py = parentY[r.d.parent] ?? mid;
      edges += flow(`M${x - 14},${py + 14} L${x - 14},${mid} L${x},${mid}`, r.w, color);
    }
    if (r.d) parentY[r.d.id] = y;
    const name = r.d ? devName(ctx, r.d) : L('untracked');
    const tip = r.unknown ? L('unknown_tip', { n: name, d: W(topW), h: W(homeW) }) : `${name}: ${W(r.w)}${ageTitle(r.fr)}`;
    pills += `<g class="pill${(r.fr && r.fr.stale) || r.unknown ? ' warn' : ''}" transform="translate(${x},${y})"><title>${esc(tip)}</title>
      <rect class="bg" width="${w}" height="28" rx="14"/>
      <rect width="${Math.max(0, (r.w / maxW) * (w - 4))}" height="24" x="2" y="2" rx="12" style="fill:${color};opacity:.22"/>
      <circle cx="16" cy="14" r="5" style="fill:${color}"/>
      <text x="28" y="15" class="${r.w < 3 ? 'muted' : ''}">${esc(name.length > 30 ? name.slice(0, 29) + '…' : name)}</text>
      ${r.fr && r.fr.stale ? `<text x="${w - 74}" y="15" class="w stale">⏱ ${esc(F.age(r.fr.age))}</text>` : ''}
      ${r.unknown ? `<text x="${w - 30}" y="15" class="w stale">${esc(L('devices_gt_home'))}</text>` : ''}
      <text x="${w - 12}" y="15" class="w ${r.w < 3 && !r.unknown ? 'muted' : ''}">${valText(r)}</text></g>`;
  });
  const nodes = [
    hasGrid ? node('grid', L('grid'), W(Math.abs(s.grid)), P.grid, s.grid < -5 ? L('exporting') : s.grid > 5 ? L('importing') : '', s.fr.grid) : '',
    node('home', L('house'), W(homeW), P.home, hasGrid ? '' : L('measured_devices')),
    hasGrid && s.hasSolar ? node('solar', L('sun'), W(s.solar), P.solar, '', s.fr.solar) : '',
    hasGrid && s.hasBattery ? node('battery', L('bat'), W(Math.abs(s.battery)), P.battery, s.soc != null && !isNaN(s.soc) ? `${F.num(s.soc, 0)}% · ${L(s.battery > 5 ? 'discharging' : s.battery < -5 ? 'charging' : 'idle')}` : '', s.fr.battery) : '',
  ].join('');
  let list = '';
  if (compact && allRows.length) {
    const mx = Math.max(1, ...allRows.map((r) => r.w));
    list = `<div class="dl">${allRows.map((r) => {
      const color = devColor(P, r.d);
      return `<div class="dv ${r.depth ? 'child' : ''} ${(r.fr && r.fr.stale) || r.unknown ? 'warn' : ''}"><span class="dot" style="background:${color}"></span><span class="nm">${esc(r.d ? devName(ctx, r.d) : L('untracked'))}</span><span class="br"><span style="width:${(r.w / mx) * 100}%;background:${color}"></span></span><span class="vl">${r.fr && r.fr.stale ? `<small class="stale">⏱ ${esc(F.age(r.fr.age))}</small> ` : ''}${valText(r)}</span></div>`;
    }).join('')}</div>`;
  }
  el.style.height = 'auto';
  el.innerHTML = `<svg viewBox="0 0 ${VBW} ${H}" role="img" style="width:100%;height:auto;max-height:${Math.max(340, H)}px">${edges}${nodes}${pills}</svg>${list}`;
}
EnergyPlusLiveCard.style = `
  .chart svg { overflow: visible; }
  .node circle { fill: var(--card-background-color, #fff); stroke-width: 3; }
  .node .t1 { font-size: 13px; font-weight: 650; fill: var(--primary-text-color); text-anchor: middle; font-variant-numeric: tabular-nums; }
  .node .t2 { font-size: 11px; fill: var(--secondary-text-color); text-anchor: middle; }
  path.base { fill: none; stroke: var(--ep-grid); stroke-width: 2; }
  path.flow { fill: none; stroke-linecap: round; stroke-dasharray: 2 14; animation: flow linear infinite; }
  @keyframes flow { to { stroke-dashoffset: -32; } }
  @media (prefers-reduced-motion: reduce) { path.flow { animation: none; stroke-dasharray: none; } }
  .pill rect.bg { fill: var(--ep-surface-2); }
  .pill.warn rect.bg { stroke: var(--ep-warn); stroke-width: 1; stroke-dasharray: 3 3; }
  .pill text { font-size: 12px; fill: var(--primary-text-color); dominant-baseline: middle; }
  .pill text.w { font-variant-numeric: tabular-nums; font-weight: 600; text-anchor: end; }
  .pill text.muted { fill: var(--secondary-text-color); }
  .stale { fill: var(--ep-warn-ink); color: var(--ep-warn-ink); font-size: 11px; font-weight: 600; }
  .node .stale { text-anchor: middle; }
  .dl { display: flex; flex-direction: column; gap: 2px; margin-top: 8px; }
  .dv { display: grid; grid-template-columns: 12px minmax(80px, 1fr) 1fr auto; gap: 10px; align-items: center; padding: 5px 4px; font-size: 14px; border-radius: 8px; }
  .dv.warn { outline: 1px dashed var(--ep-warn); }
  .dv.child { padding-left: 18px; }
  .dv .dot { width: 10px; height: 10px; border-radius: 3px; }
  .dv .nm { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dv .br { height: 8px; border-radius: 999px; background: var(--ep-surface-2); overflow: hidden; }
  .dv .br span { display: block; height: 100%; border-radius: 999px; }
  .dv .vl { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; }
`;
registerCard('energyplus-live-flow-card', EnergyPlusLiveCard, 'EnergyPlus live energy flow', 'Animated live power flow from grid and solar to your home and every device, with stale-sensor markers.');

/* ---------------- energyplus-devices-card ---------------- */
/* EnergyPlus devices card: consumption and cost per device, as a ranking or a timeline. */
class EnergyPlusDevicesCard extends EnergyPlusBase {
  static get titleKey() { return 't_devices'; }
  static get defaults() { return { view: 'list', show_cost: true }; }
  static getConfigForm() {
    return EnergyPlusBase.formSchema([
      { type: 'grid', name: '', flatten: true, schema: [
        { name: 'view', selector: { select: { mode: 'dropdown', options: [{ value: 'list', label: tr(null, 'ranking') }, { value: 'chart', label: tr(null, 'timeline') }] } } },
        { name: 'show_cost', selector: { boolean: {} } },
      ] },
    ]);
  }
  getCardSize() { return 6; }
  headExtra() {
    const v = this._view || this._config.view;
    return `<div class="seg views"><button data-view="list" aria-pressed="${v === 'list'}">${esc(this.L('ranking'))}</button><button data-view="chart" aria-pressed="${v === 'chart'}">${esc(this.L('timeline'))}</button></div>`;
  }
  renderBody(D, ctx, P, F) {
    const m = ctx.m, L = this.L;
    if (!m.devices.length) return `<div class="empty">${esc(L('no_data'))}</div>`;
    const T = D.C.total, home = T.home || 1;
    const withCost = this._config.show_cost && D.C.havePrice;
    const top = m.devices.filter((d) => !d.parent);
    const view = this._view || this._config.view;
    if (view === 'chart') {
      const B = D.C.buckets;
      const series = top.map((d) => ({ name: devName(ctx, d), color: devColor(P, d), stack: 'dev', data: B.map((b) => b.dev[d.id] || 0) }));
      series.push({ name: L('untracked'), color: P.other, stack: 'dev', data: B.map((b) => clamp0(b.home - sum(top, (d) => b.dev[d.id] || 0))) });
      const shown = series.filter((s) => anyNonZero(s.data));
      return legendHtml(shown) + this.chart('c', {
        height: 260, labels: D.buckets.map((b) => b.label), titles: D.buckets.map((b) => b.title), series: shown,
        yFmt: (v) => F.num(v, v % 1 ? 1 : 0), valFmt: (v) => F.kwh(v),
        footer: withCost ? (i) => `<div class="ft"><span>${esc(L('costs'))}</span><b>${esc(F.money(B[i].homeCost))}</b></div>` : null,
      });
    }
    const tracked = sum(top, (d) => T.dev[d.id] || 0), trackedCost = sum(top, (d) => T.devCost[d.id] || 0);
    const rows = [];
    const row = (name, color, v, c, depth, cls = '') => rows.push(`<div class="dev ${depth ? 'child' : ''} ${cls}" title="${esc(name)}: ${esc(F.kwh(v))}${withCost ? ` · ${esc(F.money(c))}` : ''}">
      <span class="dot" style="background:${color}"></span><span class="name">${esc(name)}</span>
      <span class="bar"><span style="width:${Math.min(100, (v / home) * 100)}%;background:${color}"></span></span>
      <span class="val">${esc(F.kwh(v))}<small>${esc(F.pct(v / home))}</small></span>${withCost ? `<span class="cost">${esc(F.money(c))}</span>` : ''}</div>`);
    const walk = (d, depth) => {
      row(devName(ctx, d), devColor(P, d), T.dev[d.id] || 0, T.devCost[d.id] || 0, depth);
      m.devices.filter((c) => c.parent === d.id).sort((a, b) => (T.dev[b.id] || 0) - (T.dev[a.id] || 0)).forEach((c) => walk(c, depth + 1));
    };
    top.sort((a, b) => (T.dev[b.id] || 0) - (T.dev[a.id] || 0)).forEach((d) => walk(d, 0));
    row(L('untracked'), P.other, clamp0(T.home - tracked), clamp0(T.homeCost - trackedCost), 0);
    if (withCost) rows.push(`<div class="dev total"><span></span><span class="name">${esc(L('total_use'))}</span><span></span><span class="val">${esc(F.kwh(T.home))}<small>100%</small></span><span class="cost">${esc(F.money(T.homeCost))}</span></div>`);
    return `${withCost ? `<div class="hint" title="${esc(L('cost_note'))}">${esc(L('cost_hint'))} ⓘ</div>` : ''}<div class="list ${withCost ? 'wc' : ''}">${rows.join('')}</div>`;
  }
  afterRender() {
    this.shadowRoot.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => ((this._view = b.dataset.view), this._render())));
  }
}
EnergyPlusDevicesCard.style = `
  .hint { font-size: 12px; color: var(--ep-muted); margin: 0 0 8px; cursor: help; }
  .list { display: flex; flex-direction: column; gap: 2px; }
  .dev { display: grid; grid-template-columns: 12px minmax(90px, 1.2fr) 2fr auto; align-items: center; gap: 10px; padding: 5px 0; font-size: 14px; }
  .list.wc .dev { grid-template-columns: 12px minmax(90px, 1.2fr) 2fr auto 64px; }
  .dev.child { padding-left: 18px; }
  .dev.child .name::before { content: "↳ "; color: var(--ep-muted); }
  .dev .dot { width: 10px; height: 10px; border-radius: 3px; }
  .dev .name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--primary-text-color); }
  .dev .bar { height: 8px; background: var(--ep-surface-2); border-radius: 999px; overflow: hidden; }
  .dev .bar span { display: block; height: 100%; border-radius: 999px; }
  .dev .val { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; color: var(--primary-text-color); }
  .dev .val small { color: var(--ep-muted); margin-left: 6px; font-size: 11px; }
  .dev .cost { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--primary-text-color); }
  .dev.total { border-top: 1px solid var(--ep-grid); margin-top: 4px; padding-top: 8px; font-weight: 600; }
  @container (max-width: 420px) { .dev .bar { display: none; } .dev, .list.wc .dev { grid-template-columns: 12px 1fr auto auto; } .dev.total > span:nth-child(3) { display: none; } }
`;
registerCard('energyplus-devices-card', EnergyPlusDevicesCard, 'EnergyPlus devices', 'Consumption and cost per device (at the off-peak or peak rate of that moment), as a ranking or timeline.');

/* ---------------- energyplus-solar-card ---------------- */
/* EnergyPlus solar card: where your solar energy went, with the forecast when available. */
class EnergyPlusSolarCard extends EnergyPlusBase {
  static get titleKey() { return 't_solar'; }
  static get defaults() { return {}; }
  static getConfigForm() { return EnergyPlusBase.formSchema(); }
  getCardSize() { return 5; }
  async loadData(ctx) {
    const D = await super.loadData(ctx);
    D.fc = null;
    if (ctx.m.hasSolar && (this._period === 'day' || this._period === 'week') && D.end > Date.now() - 2 * 864e5) {
      const f = await cachedWS(this._hass, { type: 'energy/solar_forecast' }, 900e3).catch(() => null);
      if (f) {
        const starts = D.buckets.map((b) => b.start), fc = new Array(starts.length).fill(0);
        let any = false;
        for (const [entry, v] of Object.entries(f)) {
          if (ctx.m.forecast.length && !ctx.m.forecast.includes(entry)) continue;
          for (const [iso, wh] of Object.entries((v && v.wh_hours) || {})) {
            const ts = Date.parse(iso);
            if (ts < D.start || ts >= D.end) continue;
            const i = bucketIndex(starts, ts);
            if (i >= 0) (fc[i] += wh / 1000), (any = true);
          }
        }
        if (any) D.fc = fc;
      }
    }
    return D;
  }
  renderBody(D, ctx, P, F) {
    const L = this.L;
    if (!ctx.m.hasSolar) return `<div class="empty">${esc(L('no_data'))}</div>`;
    const T = D.C.total, B = D.C.buckets;
    const pi = B.reduce((bi, b, i) => (b.solar > (B[bi] ? B[bi].solar : 0) ? i : bi), 0);
    const st = [
      [L('production'), F.kwh(T.solar), P.solar],
      [L('direct'), F.kwh(T.solarToHome), P.solar],
      ...(ctx.m.hasBattery ? [[L('to_battery'), F.kwh(T.solarToBat), P.charge]] : []),
      [L('exported'), F.kwh(T.solarToGrid), P.export],
      [L('self_consumption'), F.pct((T.solar - T.solarToGrid) / T.solar), null],
      ...(T.solar > 0 ? [[L('best', { u: L(`unit_${this._period}`) }), `${D.buckets[pi].label} · ${F.kwh(B[pi].solar)}`, null]] : []),
      ...(D.fc ? [[L('forecast'), F.kwh(sum(D.fc)), null]] : []),
    ];
    const series = [
      { name: L('direct'), color: P.solar, stack: 's', data: B.map((b) => b.solarToHome) },
      { name: L('to_battery'), color: P.charge, stack: 's', data: B.map((b) => b.solarToBat) },
      { name: L('exported'), color: P.export, stack: 's', data: B.map((b) => b.solarToGrid) },
    ].filter((s) => anyNonZero(s.data));
    if (D.fc) series.push({ name: L('forecast'), color: 'var(--secondary-text-color)', type: 'line', dashed: true, data: D.fc });
    return `<div class="stats">${st.map(([l, v, c]) => `<div>${c ? `<i style="background:${c}"></i>` : ''}${esc(l)}<b>${esc(v)}</b></div>`).join('')}</div>` +
      legendHtml(series) + this.chart('c', { height: 230, labels: D.buckets.map((b) => b.label), titles: D.buckets.map((b) => b.title), series, yFmt: (v) => F.num(v, v % 1 ? 1 : 0), valFmt: (v) => F.kwh(v) });
  }
}
registerCard('energyplus-solar-card', EnergyPlusSolarCard, 'EnergyPlus solar', 'Solar production split into used directly, to battery and returned, with self-consumption and forecast.');

/* ---------------- energyplus-costs-card ---------------- */
/* EnergyPlus costs card: electricity, gas and water costs and feed-in compensation. */
class EnergyPlusCostsCard extends EnergyPlusBase {
  static get titleKey() { return 't_costs'; }
  static get defaults() { return {}; }
  static getConfigForm() { return EnergyPlusBase.formSchema([{ name: 'compare', selector: { boolean: {} } }]); }
  getCardSize() { return 5; }
  renderBody(D, ctx, P, F) {
    const m = ctx.m, L = this.L, T = D.C.total, B = D.C.buckets, Pv = D.Pcut && D.Pcut.total;
    const hasGas = m.gas.some((g) => g.cost), hasWater = m.water.some((w) => w.cost);
    if (!m.hasCost && !hasGas && !hasWater) return `<div class="empty">${esc(L('no_data'))}</div>`;
    const net = T.cost - T.comp + T.gasCost + T.waterCost;
    const pnet = Pv ? Pv.cost - Pv.comp + Pv.gasCost + Pv.waterCost : null;
    const st = [
      ...(m.hasCost ? [[L('electricity'), esc(F.money(T.cost)), P.grid], [L('comp_short'), `− ${esc(F.money(T.comp))}`, P.export]] : []),
      ...(hasGas ? [[L('gas'), esc(F.money(T.gasCost)), P.gas]] : []),
      ...(hasWater ? [[L('water'), esc(F.money(T.waterCost)), P.water]] : []),
      [L('total_net'), `${esc(F.money(net))} ${this.delta(net, pnet, false)}`, null],
    ];
    const series = [
      { name: L('electricity'), color: P.grid, stack: 'c', data: B.map((b) => b.cost) },
      { name: L('gas'), color: P.gas, stack: 'c', data: B.map((b) => b.gasCost) },
      { name: L('water'), color: P.water, stack: 'c', data: B.map((b) => b.waterCost) },
      { name: L('comp_long'), color: P.export, stack: 'n', data: B.map((b) => -b.comp), neg: true },
    ].filter((s) => anyNonZero(s.data));
    const small = sum(B, (b) => b.cost + b.gasCost) < 50 * B.length;
    return `<div class="stats">${st.map(([l, v, c]) => `<div>${c ? `<i style="background:${c}"></i>` : ''}${esc(l)}<b>${v}</b></div>`).join('')}</div>` +
      legendHtml(series) + this.chart('c', {
        height: 230, labels: D.buckets.map((b) => b.label), titles: D.buckets.map((b) => b.title), series,
        yFmt: (v) => F.money(v, small ? 2 : 0), valFmt: (v, s) => (s.neg ? `− ${F.money(v)}` : F.money(v)),
        footer: (i) => `<div class="ft"><span>${esc(L('net_short'))}</span><b>${esc(F.money(B[i].cost - B[i].comp + B[i].gasCost + B[i].waterCost))}</b></div>`,
      });
  }
}
registerCard('energyplus-costs-card', EnergyPlusCostsCard, 'EnergyPlus costs', 'Electricity, gas and water costs and feed-in compensation per hour, day or month.');

/* ---------------- energyplus-tariff-card ---------------- */
/* EnergyPlus tariff card: import and return per meter register (tariff 1 = dal, tariff 2 = piek). */
class EnergyPlusTariffCard extends EnergyPlusBase {
  static get titleKey() { return 't_tariff'; }
  static get defaults() { return {}; }
  static getConfigForm() { return EnergyPlusBase.formSchema(); }
  getCardSize() { return 6; }
  renderBody(D, ctx, P, F) {
    const m = ctx.m, L = this.L, T = D.C.total, B = D.C.buckets, keys = m.tariffKeys || [];
    if (!m.gridIn.length) return `<div class="empty">${esc(L('no_data'))}</div>`;
    const col = (k, dir) => (k === 'piek' ? (dir === 'in' ? P.piek : P.piekOut) : k === 'dal' || k === 'enkel' ? (dir === 'in' ? P.grid : P.export) : dir === 'in' ? P.d[6] : P.d[7]);
    const byKey = (map, list) => {
      const o = {};
      for (const g of list) o[g.tariff] = (o[g.tariff] || 0) + (map[g.id] || 0);
      return o;
    };
    const inK = byKey(T.tariffIn, m.gridIn), outK = byKey(T.tariffOut, m.gridOut), costK = byKey(T.costIn, m.gridIn), compK = byKey(T.compOut, m.gridOut);
    const prices = D.C.prices || {};
    const hasOut = m.gridOut.length > 0, hasMoney = D.C.havePrice || m.hasCost, hasComp = hasOut && m.hasCost;
    const costOf = (k) => (costK[k] ? costK[k] : prices[k] != null ? (inK[k] || 0) * prices[k] : null);
    const head = [L('tariff'), L('import'), ...(hasOut ? [L('feed_in'), L('net_short')] : []), ...(hasMoney ? [L('price_kwh'), L('costs')] : []), ...(hasComp ? [L('comp_short')] : [])];
    const rows = keys.map((k) => {
      const i = inK[k] || 0, o = outK[k] || 0, c = costOf(k);
      return `<tr><td><b><span class="sw" style="background:${col(k, 'in')}"></span>${esc(tariffName(this._hass, k))}</b></td><td>${esc(F.kwh(i))} <small>${esc(F.pct(i / (T.fromGrid || 1)))}</small></td>` +
        (hasOut ? `<td>${esc(F.kwh(o))}</td><td>${esc(F.kwh(i - o))}</td>` : '') +
        (hasMoney ? `<td>${prices[k] != null ? esc(F.money(prices[k], 3)) : '–'}</td><td>${c != null ? esc(F.money(c)) : '–'}</td>` : '') +
        (hasComp ? `<td>${compK[k] ? `− ${esc(F.money(compK[k]))}` : '–'}</td>` : '') + '</tr>';
    });
    const totalCost = sum(keys, (k) => costOf(k) || 0);
    rows.push(`<tr class="tot"><td>${esc(L('total'))}</td><td>${esc(F.kwh(T.fromGrid))}</td>` +
      (hasOut ? `<td>${esc(F.kwh(T.toGrid))}</td><td>${esc(F.kwh(T.fromGrid - T.toGrid))}</td>` : '') +
      (hasMoney ? `<td>${T.fromGrid > 0 && totalCost ? esc(F.money(totalCost / T.fromGrid, 3)) : '–'}</td><td>${esc(F.money(totalCost))}</td>` : '') +
      (hasComp ? `<td>− ${esc(F.money(T.comp))}</td>` : '') + '</tr>');
    const series = [
      ...keys.map((k) => ({ name: L('import_of', { t: tariffName(this._hass, k).toLowerCase() }), color: col(k, 'in'), stack: 'in', data: B.map((b) => byKey(b.tariffIn, m.gridIn)[k] || 0) })),
      ...keys.map((k) => ({ name: L('feed_in_of', { t: tariffName(this._hass, k).toLowerCase() }), color: col(k, 'out'), stack: 'out', data: B.map((b) => -(byKey(b.tariffOut, m.gridOut)[k] || 0)) })),
    ].filter((s) => anyNonZero(s.data));
    return `<div class="sub">${esc(L('tariff_sub'))}</div><div class="tw"><table><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>` +
      legendHtml(series) + this.chart('c', { height: 210, labels: D.buckets.map((b) => b.label), titles: D.buckets.map((b) => b.title), series, yFmt: (v) => F.num(v, v % 1 ? 1 : 0), valFmt: (v) => F.kwh(v) });
  }
}
EnergyPlusTariffCard.style = `
  .sub { font-size: 12px; color: var(--ep-muted); margin: 0 0 6px; }
  tr.tot td { font-weight: 600; border-bottom: 0; }
  .legend { margin-top: 10px; }
`;
registerCard('energyplus-tariff-card', EnergyPlusTariffCard, 'EnergyPlus off-peak and peak', 'Import, return, price and cost per meter register (tariff 1 = off-peak, tariff 2 = peak).');

/* ---------------- energyplus-cycles-card ---------------- */
/* EnergyPlus appliance cycles card: runs of washing machine, dryer, dishwasher and oven. */
const CYCLE_RE = /was|droger|droog|vaatwas|dish|wash|dryer|oven|airfryer|magnetron/i;
class EnergyPlusCyclesCard extends EnergyPlusBase {
  static get titleKey() { return 't_cycles'; }
  static get defaults() { return { period: 'week' }; }
  static getConfigForm() { return EnergyPlusBase.formSchema(); }
  getCardSize() { return 7; }
  async loadData(ctx) {
    const m = ctx.m;
    const devs = this._config.devices && this._config.devices.length
      ? m.devices.filter((d) => this._config.devices.includes(d.id))
      : m.devices.filter((d) => CYCLE_RE.test(devName(ctx, d)));
    const { start, end } = this._config.energy_date_selection && this._extRange ? this._extRange : rangeFor(this._period, this._anchor);
    const out = { devs, start, end, runs: {}, inProgress: Date.now() > start && Date.now() < end, period: this._period };
    if (!devs.length) return out;
    const stop = new Date(Math.min(end.getTime(), Date.now()));
    const ids = [...devs.map((d) => d.id), ...m.gridIn.flatMap((g) => [g.id, g.cost]), ...m.gridOut.map((g) => g.id)];
    const raw = await stats(this._hass, ids, start, stop, 'hour', { energy: 'kWh' }, end > Date.now() ? 240e3 : 3600e3);
    const C = compute(ctx, raw, [start.getTime()]);
    out.days = Math.max(1 / 24, (stop - start) / 864e5);
    out.havePrice = C.havePrice;
    for (const d of devs) out.runs[d.id] = detectRuns(m, C.records, d.id);
    return out;
  }
  onHass() {
    if (!this.shadowRoot || !this._ctx) return;
    const dp = findDevicePower(this._hass, this._ctx.m, this._config.device_power || {});
    const F = makeFmt(this._hass);
    this.shadowRoot.querySelectorAll('[data-now]').forEach((el) => {
      const w = powerW(this._hass, dp[el.dataset.now]);
      el.hidden = !(w > 10);
      if (w > 10) el.textContent = this.L('running_now', { w: F.W(w) });
    });
  }
  renderBody(D, ctx, P, F) {
    const L = this.L;
    if (!D.devs.length) return `<div class="empty">${esc(L('no_cycle_devices'))}</div>`;
    const hasDal = (ctx.m.tariffKeys || []).includes('dal'), withCost = D.havePrice, perWeek = D.days >= 7;
    const Dw = DOW[langOf(this._hass)], M = MONTHS[langOf(this._hass)];
    const fmtStart = (ts) => {
      const d = new Date(ts);
      return `${Dw[d.getDay()]} ${d.getDate()} ${M[d.getMonth()]}, ${String(d.getHours()).padStart(2, '0')}:00`;
    };
    const head = [L('device'), L('runs'), ...(perWeek ? [L('per_week')] : []), L('kwh_run'), ...(withCost ? [L('cost_run'), L('cost_total')] : []), ...(hasDal ? [L('in_dal')] : []), L('usually'), L('last_time')];
    const rows = D.devs.map((d) => {
      const runs = D.runs[d.id] || [];
      const kwhT = sum(runs, (r) => r.kwh), costT = sum(runs, (r) => r.cost), rawT = sum(runs, (r) => r.raw), dalT = sum(runs, (r) => r.dal);
      const hrs = runs.map((r) => new Date(r.start).getHours()).sort((a, b) => a - b);
      const last = runs[runs.length - 1];
      return `<tr><td><span class="sw" style="background:${devColor(P, d)}"></span>${esc(devName(ctx, d))}<span class="chip" data-now="${esc(d.id)}" hidden></span></td><td>${runs.length}</td>` +
        (perWeek ? `<td>${F.num(runs.length / (D.days / 7), 1)}</td>` : '') +
        `<td>${runs.length ? esc(F.kwh(kwhT / runs.length)) : '–'}</td>` +
        (withCost ? `<td>${runs.length ? esc(F.money(costT / runs.length)) : '–'}</td><td>${esc(F.money(costT))}</td>` : '') +
        (hasDal ? `<td>${rawT > 0 ? esc(F.pct(dalT / rawT)) : '–'}</td>` : '') +
        `<td>${hrs.length ? `${String(hrs[Math.floor(hrs.length / 2)]).padStart(2, '0')}:00` : '–'}</td><td>${last ? esc(fmtStart(last.start)) : '–'}</td></tr>`;
    });
    const series = D.devs.map((d) => ({ name: devName(ctx, d), color: devColor(P, d), runs: D.runs[d.id] || [] }));
    return `<div class="sub">${esc(L('cycles_hint'))}</div><div class="tw"><table><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>` +
      legendHtml(series) + this.chart('c', { height: 240, draw: (el) => drawScatter(el, { series, start: D.start, end: D.end, period: D.period, hasDal, withCost, fmtStart }, this._hass) });
  }
  afterRender() { this.onHass(); }
}
/** A run = consecutive hours above the device's standby level (one quiet hour inside a run is allowed). */
function detectRuns(m, records, id) {
  const pts = records.map((r) => ({ ts: r.ts, e: clamp0(r.dev[id] || 0), c: r.devCost[id] || 0, r }));
  if (pts.length < 3) return [];
  const sorted = pts.map((p) => p.e).sort((a, b) => a - b);
  const standby = sorted[Math.floor(sorted.length * 0.2)] || 0;
  const thr = Math.max(0.05, standby * 3 + 0.02);
  const runs = [];
  let cur = null;
  const addHour = (p) => {
    const w = tariffWeights(m, p.r, true);
    cur.kwh += clamp0(p.e - standby);
    cur.raw += p.e;
    cur.cost += p.c;
    cur.dal += (w.dal || 0) * p.e;
    cur.end = p.ts;
    cur.hours++;
  };
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    if (cur && p.ts - cur.end > 1.5 * 3600e3) (runs.push(cur), (cur = null));
    if (p.e > thr) {
      if (!cur) cur = { start: p.ts, end: p.ts, kwh: 0, raw: 0, cost: 0, dal: 0, hours: 0 };
      addHour(p);
    } else if (cur) {
      const nx = pts[i + 1];
      if (nx && nx.e > thr && nx.ts - p.ts <= 1.5 * 3600e3) addHour(p);
      else (runs.push(cur), (cur = null));
    }
  }
  if (cur) runs.push(cur);
  return runs.filter((r) => r.kwh >= 0.1);
}
function drawScatter(el, spec, hass) {
  const F = makeFmt(hass), L = (k, v) => tr(hass, k, v), M = MONTHS[langOf(hass)];
  const width = el.clientWidth || 500, height = 240;
  const pad = { l: 44, r: 8, t: 6, b: 20 };
  const pw = width - pad.l - pad.r, ph = height - pad.t - pad.b;
  const t0 = spec.start.getTime(), t1 = spec.end.getTime();
  const x = (t) => pad.l + ((t - t0) / (t1 - t0)) * pw;
  const y = (h) => pad.t + (h / 24) * ph;
  let svg = '';
  svg += `<rect x="${pad.l}" y="${y(0)}" width="${pw}" height="${y(7) - y(0)}" class="band"/><rect x="${pad.l}" y="${y(23)}" width="${pw}" height="${y(24) - y(23)}" class="band"/>`;
  svg += `<text x="${pad.l + 4}" y="${y(0) + 12}" class="bl">${spec.hasDal ? esc(tr(hass, 'band_dal')) : ''}</text>`;
  for (let h = 0; h <= 24; h += 3) svg += `<line x1="${pad.l}" x2="${width - pad.r}" y1="${y(h)}" y2="${y(h)}" class="grid"/><text x="${pad.l - 6}" y="${y(h) + 4}" class="ylab">${String(h).padStart(2, '0')}:00</text>`;
  // x ticks
  const ticks = [];
  const c = new Date(t0);
  if (spec.period === 'day') for (let h = 4; h < 24; h += 4) ticks.push([new Date(c.getFullYear(), c.getMonth(), c.getDate(), h).getTime(), `${String(h).padStart(2, '0')}:00`]);
  else if (spec.period === 'year') for (let mo = 0; mo < 12; mo++) ticks.push([new Date(c.getFullYear(), mo, 1).getTime(), M[mo]]);
  else {
    const stepD = spec.period === 'week' ? 1 : Math.max(1, Math.ceil((((t1 - t0) / 864e5) * 34) / pw));
    for (let d = new Date(c); d < spec.end; d.setDate(d.getDate() + stepD)) ticks.push([d.getTime() + (spec.period === 'week' ? 432e5 : 0), spec.period === 'week' ? `${DOW[langOf(hass)][d.getDay()]} ${d.getDate()}` : String(d.getDate())]);
  }
  for (const [t, lab] of ticks) svg += `<text x="${x(t)}" y="${height - 5}" class="xlab">${esc(lab)}</text>`;
  const pts = [];
  spec.series.forEach((s, si) => s.runs.forEach((r, ri) => {
    const d = new Date(r.start);
    const cx = x(r.start + 1800e3), cy = y(d.getHours() + 0.5), rad = Math.max(4.5, Math.min(11, 4 + r.kwh * 3));
    pts.push({ s, r, cx, cy });
    svg += `<circle cx="${cx}" cy="${cy}" r="${rad}" style="fill:${s.color}" class="pt" data-k="${si}-${ri}"/>`;
  }));
  el.innerHTML = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svg}</svg><div class="tip" hidden></div>`;
  const tip = el.querySelector('.tip');
  el.querySelectorAll('.pt').forEach((node, i) => {
    node.addEventListener('mouseenter', () => {
      const p = pts[i], r = p.r;
      tip.innerHTML = `<div class="tt">${esc(p.s.name)}</div>${esc(spec.fmtStart(r.start))} · ${esc(L('hours', { n: r.hours }))}<br>${esc(F.kwh(r.kwh))}${spec.withCost ? ` · ${esc(F.money(r.cost))}` : ''}${spec.hasDal ? `<br>${esc(L('in_dal_share', { p: F.pct(r.dal / (r.raw || 1)) }))}` : ''}`;
      tip.hidden = false;
      tip.style.left = `${Math.min(p.cx + 12, width - tip.offsetWidth - 4)}px`;
      tip.style.top = `${Math.max(0, p.cy - 20)}px`;
    });
    node.addEventListener('mouseleave', () => (tip.hidden = true));
  });
}
EnergyPlusCyclesCard.style = `
  .sub { font-size: 12px; color: var(--ep-muted); margin: 0 0 6px; }
  .chip { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 1px 8px; border-radius: 999px; margin-left: 8px; color: var(--ep-good); background: color-mix(in srgb, var(--ep-good) 14%, transparent); }
  .chip[hidden] { display: none; }
  .chip::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: pulse 1.4s ease-in-out infinite; }
  @keyframes pulse { 50% { opacity: .3; } }
  .chart .band { fill: rgba(127,127,127,.08); }
  .chart .bl { fill: var(--ep-muted); font-size: 11px; }
  .chart .pt { stroke: var(--card-background-color, #fff); stroke-width: 2; opacity: .92; cursor: default; }
  .legend { margin-top: 10px; }
`;
registerCard('energyplus-cycles-card', EnergyPlusCyclesCard, 'EnergyPlus appliance cycles', 'Runs of washing machine, dryer, dishwasher and oven: count, kWh and cost per run, off-peak share and start times.');

console.info('%c ENERGYPLUS-CARDS %c 1.0.0 ', 'color:#fff;background:#eda100;font-weight:700', 'color:#eda100;background:transparent');
})();
