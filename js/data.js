/* Dwak — seed data. In production this comes from the API; the shapes below ARE the API contract. */

const CITIES = [
  { id: 'alger', fr: 'Alger', ar: 'الجزائر', lat: 36.7538, lng: 3.0588 },
  { id: 'oran', fr: 'Oran', ar: 'وهران', lat: 35.6971, lng: -0.6308 },
  { id: 'constantine', fr: 'Constantine', ar: 'قسنطينة', lat: 36.3650, lng: 6.6147 },
];

/* shortage: 'national' = rupture nationale signalée (SNAPO), 'tension' = stock tendu, null = normal */
const MEDICINES = [
  { id: 'ventoline',  brand: 'Ventoline 100 µg',        dci: 'Salbutamol',            form: 'Aérosol pour inhalation', cls: 'Asthme / bronchodilatateur', shortage: 'national', subs: ['airomir'], ar: 'فنتولين' },
  { id: 'airomir',    brand: 'Airomir Autohaler',        dci: 'Salbutamol',            form: 'Aérosol pour inhalation', cls: 'Asthme / bronchodilatateur', shortage: 'tension', subs: ['ventoline'], ar: 'إيرومير' },
  { id: 'levothyrox', brand: 'Levothyrox 100 µg',        dci: 'Lévothyroxine sodique', form: 'Comprimé sécable',        cls: 'Hormone thyroïdienne',       shortage: 'national', subs: ['lthyroxin'], ar: 'ليفوتيروكس' },
  { id: 'lthyroxin',  brand: 'L-Thyroxin Henning 100 µg',dci: 'Lévothyroxine sodique', form: 'Comprimé sécable',        cls: 'Hormone thyroïdienne',       shortage: 'tension', subs: ['levothyrox'], ar: 'ل-تيروكسين' },
  { id: 'lantus',     brand: 'Lantus SoloStar',          dci: 'Insuline glargine',     form: 'Stylo prérempli 100 U/ml', cls: 'Diabète / insuline lente',  shortage: 'national', subs: ['toujeo'], ar: 'لانتوس' },
  { id: 'toujeo',     brand: 'Toujeo SoloStar',          dci: 'Insuline glargine',     form: 'Stylo prérempli 300 U/ml', cls: 'Diabète / insuline lente',  shortage: 'tension', subs: ['lantus'], ar: 'توجيو' },
  { id: 'glucophage', brand: 'Glucophage 1000 mg',       dci: 'Metformine',            form: 'Comprimé pelliculé',      cls: 'Diabète type 2',             shortage: null, subs: ['metforal'], ar: 'غلوكوفاج' },
  { id: 'metforal',   brand: 'Metforal 850 mg',          dci: 'Metformine',            form: 'Comprimé pelliculé',      cls: 'Diabète type 2',             shortage: null, subs: ['glucophage'], ar: 'ميتفورال' },
  { id: 'lovenox',    brand: 'Lovenox 4000 UI',          dci: 'Énoxaparine sodique',   form: 'Seringue préremplie',     cls: 'Anticoagulant',              shortage: 'national', subs: [], ar: 'لوفينوكس' },
  { id: 'sintrom',    brand: 'Sintrom 4 mg',             dci: 'Acénocoumarol',         form: 'Comprimé quadrisécable',  cls: 'Anticoagulant oral',         shortage: 'tension', subs: [], ar: 'سينتروم' },
  { id: 'depakine',   brand: 'Dépakine Chrono 500 mg',   dci: 'Valproate de sodium',   form: 'Comprimé LP',             cls: 'Antiépileptique',            shortage: 'national', subs: [], ar: 'ديباكين' },
  { id: 'tegretol',   brand: 'Tégrétol LP 400 mg',       dci: 'Carbamazépine',         form: 'Comprimé LP',             cls: 'Antiépileptique',            shortage: 'tension', subs: [], ar: 'تغريتول' },
  { id: 'cortancyl',  brand: 'Cortancyl 20 mg',          dci: 'Prednisone',            form: 'Comprimé sécable',        cls: 'Corticoïde',                 shortage: 'tension', subs: ['solupred'], ar: 'كورتانسيل' },
  { id: 'solupred',   brand: 'Solupred 20 mg',           dci: 'Prednisolone',          form: 'Comprimé orodispersible', cls: 'Corticoïde',                 shortage: null, subs: ['cortancyl'], ar: 'سولوبريد' },
  { id: 'clamoxyl',   brand: 'Clamoxyl 1 g',             dci: 'Amoxicilline',          form: 'Comprimé dispersible',    cls: 'Antibiotique',               shortage: 'tension', subs: ['amoxypen'], ar: 'كلاموكسيل' },
  { id: 'amoxypen',   brand: 'Amoxypen 500 mg (Saidal)', dci: 'Amoxicilline',          form: 'Gélule',                  cls: 'Antibiotique',               shortage: null, subs: ['clamoxyl'], ar: 'أموكسيبن' },
  { id: 'augmentin',  brand: 'Augmentin 1 g/125 mg',     dci: 'Amoxicilline + ac. clavulanique', form: 'Sachet',        cls: 'Antibiotique',               shortage: 'tension', subs: ['clamoxyl'], ar: 'أوغمنتين' },
  { id: 'doliprane',  brand: 'Doliprane 1000 mg',        dci: 'Paracétamol',           form: 'Comprimé',                cls: 'Antalgique / antipyrétique', shortage: null, subs: ['paralgan'], ar: 'دوليبران' },
  { id: 'paralgan',   brand: 'Paralgan 500 mg (Saidal)', dci: 'Paracétamol',           form: 'Comprimé',                cls: 'Antalgique / antipyrétique', shortage: null, subs: ['doliprane'], ar: 'بارالغان' },
  { id: 'amlor',      brand: 'Amlor 5 mg',               dci: 'Amlodipine',            form: 'Gélule',                  cls: 'Hypertension',               shortage: null, subs: [], ar: 'أملور' },
  { id: 'coversyl',   brand: 'Coversyl 5 mg',            dci: 'Périndopril arginine',  form: 'Comprimé pelliculé',      cls: 'Hypertension',               shortage: 'tension', subs: ['amlor'], ar: 'كوفرسيل' },
  { id: 'kardegic',   brand: 'Kardégic 75 mg',           dci: 'Acétylsalicylate de lysine', form: 'Sachet',             cls: 'Antiagrégant plaquettaire',  shortage: null, subs: [], ar: 'كارديجيك' },
  { id: 'inexium',    brand: 'Inexium 40 mg',            dci: 'Ésoméprazole',          form: 'Comprimé gastro-résistant', cls: 'Reflux / IPP',             shortage: 'tension', subs: ['omedar'], ar: 'إنكسيوم' },
  { id: 'omedar',     brand: 'Omedar 20 mg',             dci: 'Oméprazole',            form: 'Gélule',                  cls: 'Reflux / IPP',               shortage: null, subs: ['inexium'], ar: 'أوميدار' },
  { id: 'nurofen',    brand: 'Nurofen 400 mg',           dci: 'Ibuprofène',            form: 'Comprimé enrobé',         cls: 'Anti-inflammatoire',         shortage: null, subs: [], ar: 'نوروفين' },
  { id: 'spasfon',    brand: 'Spasfon',                  dci: 'Phloroglucinol',        form: 'Comprimé enrobé',         cls: 'Antispasmodique',            shortage: null, subs: [], ar: 'سباسفون' },
];

/* garde: 'night' (20h–08h ce soir) | '24h' (jour de garde 24h/24) | null */
const PHARMACIES = [
  { id: 'alg01', name: 'Pharmacie El Chifa',       city: 'alger', commune: 'Bab El Oued',    lat: 36.7925, lng: 3.0517, phone: '021 96 12 34', hours: '08h00 – 20h00', garde: 'night' },
  { id: 'alg02', name: 'Pharmacie Didouche',       city: 'alger', commune: 'Alger-Centre',   lat: 36.7690, lng: 3.0546, phone: '021 63 48 77', hours: '08h30 – 19h30', garde: null },
  { id: 'alg03', name: 'Pharmacie des Facultés',   city: 'alger', commune: 'Alger-Centre',   lat: 36.7648, lng: 3.0512, phone: '021 64 21 09', hours: '08h00 – 20h00', garde: '24h' },
  { id: 'alg04', name: 'Pharmacie Ibn Sina',       city: 'alger', commune: 'Hydra',          lat: 36.7439, lng: 3.0332, phone: '023 47 55 18', hours: '09h00 – 20h00', garde: null },
  { id: 'alg05', name: 'Pharmacie El Yasmine',     city: 'alger', commune: 'Kouba',          lat: 36.7266, lng: 3.0870, phone: '023 70 33 61', hours: '08h00 – 19h00', garde: null },
  { id: 'alg06', name: 'Pharmacie Essalem',        city: 'alger', commune: 'Bir Mourad Raïs',lat: 36.7370, lng: 3.0507, phone: '021 44 90 25', hours: '08h30 – 20h00', garde: 'night' },
  { id: 'alg07', name: 'Pharmacie du Télemly',     city: 'alger', commune: 'Sidi M’Hamed', lat: 36.7702, lng: 3.0463, phone: '021 74 16 82', hours: '08h00 – 19h30', garde: null },
  { id: 'alg08', name: 'Pharmacie Bab Ezzouar',    city: 'alger', commune: 'Bab Ezzouar',    lat: 36.7214, lng: 3.1849, phone: '023 92 40 07', hours: '08h00 – 21h00', garde: null },
  { id: 'alg09', name: 'Pharmacie El Biar Centre', city: 'alger', commune: 'El Biar',        lat: 36.7702, lng: 3.0299, phone: '021 92 65 43', hours: '08h30 – 19h30', garde: null },
  { id: 'alg10', name: 'Pharmacie de la Gare',     city: 'alger', commune: 'Hussein Dey',    lat: 36.7442, lng: 3.0964, phone: '023 77 28 90', hours: '08h00 – 20h00', garde: 'night' },
  { id: 'ora01', name: 'Pharmacie El Bahia',       city: 'oran',  commune: 'Sidi El Houari', lat: 35.7061, lng: -0.6459, phone: '041 39 72 15', hours: '08h00 – 20h00', garde: '24h' },
  { id: 'ora02', name: 'Pharmacie Es-Seddikia',    city: 'oran',  commune: 'Es-Seddikia',    lat: 35.7205, lng: -0.5883, phone: '041 53 08 66', hours: '08h30 – 19h30', garde: null },
  { id: 'ora03', name: 'Pharmacie Maraval',        city: 'oran',  commune: 'El Othmania',    lat: 35.6889, lng: -0.6612, phone: '041 45 91 20', hours: '08h00 – 20h00', garde: null },
  { id: 'ora04', name: 'Pharmacie du Front de Mer',city: 'oran',  commune: 'Oran-Centre',    lat: 35.7047, lng: -0.6520, phone: '041 33 14 58', hours: '08h00 – 19h00', garde: 'night' },
  { id: 'ora05', name: 'Pharmacie Ibn Rochd',      city: 'oran',  commune: 'Bir El Djir',    lat: 35.7196, lng: -0.5464, phone: '041 62 37 84', hours: '08h30 – 20h00', garde: null },
  { id: 'ora06', name: 'Pharmacie El Amel',        city: 'oran',  commune: 'Es-Sénia',       lat: 35.6483, lng: -0.6253, phone: '041 51 76 09', hours: '08h00 – 19h30', garde: null },
  { id: 'con01', name: 'Pharmacie des Ponts',      city: 'constantine', commune: 'Constantine-Centre', lat: 36.3671, lng: 6.6113, phone: '031 92 55 31', hours: '08h00 – 19h30', garde: 'night' },
  { id: 'con02', name: 'Pharmacie Zighoud Youcef', city: 'constantine', commune: 'Zighoud Youcef',     lat: 36.3762, lng: 6.6205, phone: '031 88 20 47', hours: '08h30 – 19h00', garde: null },
  { id: 'con03', name: 'Pharmacie El Khroub',      city: 'constantine', commune: 'El Khroub',          lat: 36.2632, lng: 6.6934, phone: '031 96 83 12', hours: '08h00 – 20h00', garde: null },
  { id: 'con04', name: 'Pharmacie Sidi Mabrouk',   city: 'constantine', commune: 'Sidi Mabrouk',       lat: 36.3778, lng: 6.6376, phone: '031 63 49 75', hours: '08h00 – 20h00', garde: '24h' },
];

/* Deterministic pseudo-random so the demo is stable between sessions. */
function seededRand(key) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
  h += h << 13; h ^= h >>> 7; h += h << 3; h ^= h >>> 17; h += h << 5;
  return ((h >>> 0) % 1000) / 1000;
}

/* Hand-curated entries so shortage searches still surface the rare pharmacy that has stock. */
const CURATED = {
  'ventoline|alg03': { status: 'ok',  minsAgo: 22,  src: 'pharmacist' },
  'ventoline|ora01': { status: 'low', minsAgo: 75,  src: 'community'  },
  'ventoline|con04': { status: 'ok',  minsAgo: 140, src: 'pharmacist' },
  'lantus|alg06':    { status: 'low', minsAgo: 48,  src: 'pharmacist' },
  'lantus|ora04':    { status: 'ok',  minsAgo: 190, src: 'community'  },
  'levothyrox|alg01':{ status: 'ok',  minsAgo: 35,  src: 'pharmacist' },
  'levothyrox|con01':{ status: 'low', minsAgo: 260, src: 'community'  },
  'depakine|alg04':  { status: 'low', minsAgo: 95,  src: 'pharmacist' },
  'lovenox|ora02':   { status: 'ok',  minsAgo: 55,  src: 'pharmacist' },
};

/* Availability matrix, generated from shortage severity. Returns {status, minsAgo, src} or null (no data). */
function seedAvailability(medId, phId) {
  const curated = CURATED[medId + '|' + phId];
  if (curated) return { ...curated };
  const med = MEDICINES.find(m => m.id === medId);
  if (!med) return null;
  const r = seededRand(medId + '|' + phId);
  const cover = seededRand(phId + '|' + medId);
  if (cover > 0.85) return null; // some pharmacies simply have no data yet
  let status;
  if (med.shortage === 'national') status = r < 0.12 ? 'ok' : (r < 0.28 ? 'low' : 'out');
  else if (med.shortage === 'tension') status = r < 0.45 ? 'ok' : (r < 0.68 ? 'low' : 'out');
  else status = r < 0.82 ? 'ok' : (r < 0.93 ? 'low' : 'out');
  const minsAgo = Math.round(10 + seededRand('t' + medId + phId) * 2600); // 10 min … ~43 h
  const src = seededRand('s' + medId + phId) < 0.55 ? 'pharmacist' : 'community';
  return { status, minsAgo, src };
}

/* National shortage bulletin shown on home. Counts derived from the list above. */
const SHORTAGE_BULLETIN = {
  updated: '2026-07-06',
  source: 'SNAPO / ANPP',
  national: MEDICINES.filter(m => m.shortage === 'national').length,
  tension: MEDICINES.filter(m => m.shortage === 'tension').length,
};
