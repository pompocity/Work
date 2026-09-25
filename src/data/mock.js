// Static mock data for the investor prototype. No network calls.

const aida = (id) => `https://lh3.googleusercontent.com/aida-public/${id}`;

export const IMAGES = {
  ptrapTriage: aida(
    'AB6AXuCrixgfV-L84tiDJIXYRP_-HNWjfGbLXupym0v8K0AiSQRPx30eb1APP014An717zucrMTzT5dK2oIlf3CZvjpWiNNhlKMcS0hl20ctcYiDXdUrzl5G3d_N33nppa928QvwZY6mLue4el4x_rIYius9DE3UbYc_-lEqCyH5akbCkbVFCRlOhXLNFYavPLe4ze3zHbPx-aE-epkF3CZeykWvJi-eEoM7SvM2zkGT5nhXhkRo15HDxA3ZmQ'
  ),
  ptrapReport: aida(
    'AB6AXuB_1M02f8WVj39_dfSfVzVb6Y3BJZPCUN_jVW72zSMNRgWwZQvYnMtG91pdDlPD5leidtDe_U5TmLMX2CaaPO_TPDSAImEZc5mkucgIuDWjCd7GP7Fry6d4flc0R30Ju2QQZkkklKVUJGicp2kRulVODeTzKmKeXVefRcwIEYP11QeSCGjiAu875by9u-QVXlPVW9EP8UWuBC2wUezYBSR1LwJCE-h3uYPXglpRknmoaLnEBgGnQlbwGw'
  ),
  ptrapThumb: aida(
    'AB6AXuAGqCvBCYi7JXeq8-3ZVMrSBy5oXbd2hZ_kp0wcQwDqwd4GxKAtWY1evjLVGi-Nfl-reyFY18pJ1Zf3VPdSBHp5fmVzpk0gY8gvwSmzpfCCwgzHYlsinjFFsSbrKE0bxAmZc7XcE_dd5x2w1AgMDGJLZ3u1jVETosKZe4XhnW1pla5qjxfljh4-5yyUTY0F1DzmNdeq_kdVDoQec3NoxSBFxs5d8xrk8tE3tAKdsfQBREB0CuL5n0y8vQ'
  ),
  marcus: aida(
    'AB6AXuDfQhdLSidvtVfyFg4pUoVI4BAmplNfuFtNlv72ob0bG2Pe9ZRgnKYJ58h276vNb34xejg2fjrdim7oh90iF--df3LhMDC9wdO_-EPGQ_NUi0t7GGwF2UfZIa19OYJIAjuJnhyPZWp4z2Ywh9pRvQWsh9qIli02wXpSSHN9VLKmYGccWgJhrzb0MHUsgsUA4l4D8_qFSIBig77IDjEHcd0AMkQ8ky9fkzBs53xcE1MujURelHpiGiVxXA'
  ),
  apex: aida(
    'AB6AXuAOoF63MV-F8EwxIUZPuGKEvcr0HDgz3zbsZFvZU4yl-6WlvuMqtdCs_OV9gVJED33iSoT83oGVN3HF0-r_fUFEkV2ZEQ4z84JI1gDbLMvRdwPqeoPbbbiSlrxO8Uh41hXsNe1HQuGM70Cz0fAY8AqmVnn7ds-VYuoGTa0KY_leCruAy87vUimGZYNDVEGwEIbh7vlkmFrX3XGqHR6U8_6IbEpr7yepzprigCAuwmQ4Q_vxaIEy1dw2hA'
  ),
  rapidflow: aida(
    'AB6AXuB7d6rQjcFduJ1JO48x8w2cH0NPhc-48RBvmA0UGlkrxkNM7ijst7TxE81vH0GpBPml0r-ete4nvpghn-vmoO9uT52kMa_xXHq7VWLbPsB6qLeyn_1KbGBHRxxtGsdjjOXwjQjKswIqXOoAlBu6p9T86kPEzW6jqIxQqXVzQ7pxpzHD2fy-EkQVE6GKvWDXl2pjKX8jVze-E_pz3FF1JZlqBLwT0IPKAVQYVd-hcaLBTB7PSpqg1llc5w'
  ),
  austinCapital: aida(
    'AB6AXuAA8Fn2Py5nN_L46CChOtpgOgGaHi-18ePdE0Cuyk1W0DmsYw7WRwWZ56j2CFEV3YxrG-nBHCNFc6v-S3FJRJTphPjbxzd6bEunAIaPsT9QbCgwtyUrCQZobTOfKEX0MEa3Yyxc8faxDo4IeQ4lVDMK1WCRHSiL95kEW8Zamm-e3Qe2F-EmVoHrZJxLR_w1q8to2EeW9eT_ZGpymhfzZEqwFactSsbjpPP2-TnzMPf0dTOke_2lkbM0QA'
  ),
  map: aida(
    'AB6AXuBhpYcL5fo1_Pj9mVAW669p-p6dpBvkX7eqfPSfpt6VXb2OLPgOKXLDcpoQt6lUPSq2XWU37a1UGtEiy_rYCK7Q-qq_COpnRZAMPHrfx5ObPOKuVq-AfBQGvrrGdC5T8QL1MP7s9VbWC_t63NX7Mcb3KGv-ChF-q_g9ViOscrklMNdKTM-m9M-NY2lER8HalZMeeILJzqVdt1NZvI2yp8h9Nzby_XxcKSxsQldpOgLQ_C0H4_XLTOnJWg'
  ),
  maple: aida(
    'AB6AXuDySJw7FjDwJDogiZOkKoJ_jlj_pXb5yXuAAXTQlfVtsoGaJJMGLyW7FFBdXIoC59YMETIozY8k9_Qv9f56FhUqVyNLcFbqw4XpH2TEyX7EU6dyxVTPu-m_SabKziKSq9XmWdcEqkYs1ZRbpCZPd4ihSEoszBrP9_rP_TACVHwhkgsLDOzsosXcDlBee-JKg1N_ofUx60Vrf0JbwDUdW49xTejuJP1Hp-Zj9goyf3z2dNjuXVMdZB9GFA'
  ),
  mapleStreet: aida(
    'AB6AXuDhRw-ahmUJISIYRbSVJQeRdpQPntb1q0vqZtOqdqAMPokWH3A6W9q-RQBSNV1bpbdUSOdfAV9dX5xk-XDDYi0DW9NasuKX_9jWTcVoP5EoS15kfuXSiXz6owNvx274aywE8-ER6orDVfEuXXvKkbtwMR3Iyhz1tyHuYTx5ekA11arCQA26eVYtbOWs2tjfLsnpWelMiDRwW7iMmaNxAwx3NwPJIVxTIwcBinvNu649gwygu1tGqGJeqg'
  ),
  harbor: aida(
    'AB6AXuDHeGfGk-ayIMcSwdFtMwB8GjXgjbvChfLnJgNwJMDrUoNOonRv81AWp3UhUrF1EZMGbgLkHotrLx3nIuG9iE40zVQOJTJ6Vma43c-vpxwisUXZJ5wRKqDLnZSGL1hzXprISJzI12JaxAWcILfuJBzI6M1FfUT1CKgsVcO9KkZ446KfA1axVWvoFxNysqz6zpQW_3eNSuJWJa1mCrANy9e_JJQHZkvnynHl5WkfGu_-Cx2nnUtlFfMjtg'
  ),
  oak: aida(
    'AB6AXuAtzsXjml9nJ6dSM7wsYnaOLWoIrTNb9Ghn8HpcWQkx29Mvjs4mMidVJdJnNsJByQAUeSQyux2Y-BKgoYQaGE2JuYGhGxwfNy61SRLVPqxBOOnunBEE6r3kcR4v5alAa3u_yeI-d_9-HbYdQERXblH36HCxI3vkKzKLTJUnglT9f0UV7sHAIkZbLR05HNDdSezDCylXZ83X448vqcEZe1A6z0AEXHzapFP2KR-7UjV6RBWa6UaG2hNMuw'
  ),
};

export const TENANT = {
  name: 'Sarah Miller',
  first: 'Sarah',
  initials: 'SM',
  address: '124 Maple St, Unit 2B',
  rent: 2400,
  leaseStart: 'Jun 1, 2025',
  leaseEnd: 'May 31, 2026',
  pin: '4821',
};

export const OWNER = {
  name: 'Jordan Ellis',
  initials: 'JE',
  email: 'jordan@ellisholdings.co',
  company: 'Ellis Holdings LLC',
};

export const VENDORS = [
  {
    id: 'apex',
    company: 'Apex Plumbing Co.',
    tech: 'Marcus Vance',
    techRole: 'Master',
    license: 'TX-MPL-48291',
    rating: 4.96,
    jobs: 128,
    distance: '2.1 mi',
    price: 185,
    priceLabel: 'flat rate',
    img: IMAGES.apex,
    techImg: IMAGES.marcus,
    phone: '(512) 555-0142',
    trade: 'Plumbing',
    badge: { text: 'AI Top Recommendation', icon: 'stars', tone: 'teal' },
    score: '99% Match Score',
    tags: [
      { icon: 'bolt', text: 'Avail in 2 hrs' },
      { icon: 'security', text: '$2M Insured' },
      { icon: 'thumb_up', text: '30-Day Guarantee' },
    ],
    eta: '2:00 PM – 4:00 PM',
  },
  {
    id: 'rapidflow',
    company: 'RapidFlow Rooter',
    tech: 'Elena Ortiz',
    techRole: 'Lead Tech',
    license: 'TX-MPL-52019',
    rating: 4.88,
    jobs: 94,
    distance: '1.4 mi',
    price: 210,
    priceLabel: 'estimate',
    img: IMAGES.rapidflow,
    techImg: IMAGES.rapidflow,
    phone: '(512) 555-0177',
    trade: 'Plumbing · Emergency',
    badge: { text: 'Fastest Arrival (45 mins)', icon: 'alarm_on', tone: 'orange' },
    score: 'Emergency Crew',
    tags: [
      { icon: 'speed', text: 'Immediate 45-min dispatch' },
      { icon: 'verified_user', text: 'On-site Video Scope' },
    ],
    eta: 'Within 45 minutes',
  },
  {
    id: 'austincap',
    company: 'Austin Capital Plumbing',
    tech: 'Ray Gomez',
    techRole: 'Lead Tech',
    license: 'TX-MPL-39182',
    rating: 4.82,
    jobs: 63,
    distance: '4.8 mi',
    price: 160,
    priceLabel: 'estimate',
    img: IMAGES.austinCapital,
    techImg: IMAGES.austinCapital,
    phone: '(512) 555-0120',
    trade: 'Plumbing',
    badge: { text: 'Cost Saver Option', icon: 'savings', tone: 'gray' },
    score: 'Lowest Quote',
    tags: [{ icon: 'schedule', text: 'Today 4:00 – 6:00 PM' }],
    eta: '4:00 PM – 6:00 PM',
  },
];

export const PRIVATE_VENDORS = [
  { id: 'dave', company: 'Dave Wilson Handyman', tech: 'Dave Wilson', initials: 'DW', phone: '+1 (512) 839-4401', price: 150, tone: 'bg-secondary', trade: 'General Handyman' },
  { id: 'hill', company: 'Hill Country Pro Plumbing', tech: 'Luis Herrera', initials: 'HP', phone: '+1 (512) 555-0199', price: 220, tone: 'bg-teal', trade: 'Plumbing' },
];

export const DIRECTORY_EXTRA = [
  { id: 'coolair', company: 'CoolAir HVAC Services', tech: 'Priya Nair', trade: 'HVAC', rating: 4.91, jobs: 76, distance: '3.2 mi', icon: 'mode_fan' },
  { id: 'brightline', company: 'Brightline Electric', tech: 'Tom Becker', trade: 'Electrical', rating: 4.87, jobs: 58, distance: '5.0 mi', icon: 'electric_bolt' },
  { id: 'fresh', company: 'FreshCoat Painting', tech: 'Ana Ruiz', trade: 'Paint & Drywall', rating: 4.79, jobs: 41, distance: '6.3 mi', icon: 'format_paint' },
];

export const PROPERTIES = [
  {
    id: 'maple',
    address: '124 Maple St',
    short: '124',
    area: 'Austin Metro (Zilker)',
    fullAddress: 'Bouldin Creek, Austin, TX 78704 • Parcel #7240-02',
    type: 'Duplex · 2 Units',
    tier: 'Duplex Tier A',
    rent: 4650,
    rentLabel: '/ month combined',
    net: 1890,
    img: IMAGES.maple,
    streetImg: IMAGES.mapleStreet,
    pin: { top: '28%', left: '22%' },
    metrics: [
      { label: 'Tenancy', value: 'Unit A & B (100%)' },
      { label: 'Lease Term', value: 'Exp. May 2026' },
    ],
    units: [
      { id: '1A', tenant: 'David K.', beds: '2 Bed • 1 Bath', rent: 2250, bank: 'Chase ACH' },
      { id: '2B', tenant: 'Sarah Miller', beds: '2 Bed • 1.5 Bath', rent: 2400, bank: 'Wells ACH', hasTicket: true },
    ],
  },
  {
    id: 'harbor',
    address: '88 Harbor Dr',
    short: '88',
    area: 'Lake Travis Enclave',
    fullAddress: 'Lakeway, TX 78734 • Parcel #3318-11',
    type: 'Single Family · 3 Bed',
    tier: 'Single Family',
    rent: 3200,
    rentLabel: '/ month',
    net: 1410,
    img: IMAGES.harbor,
    streetImg: IMAGES.harbor,
    pin: { top: '44%', right: '22%' },
    status: 'inspection',
    metrics: [
      { label: 'Tenant', value: 'Dr. Vance (Good)' },
      { label: 'Auto-Pay', value: 'Enrolled', tone: 'text-teal' },
      { label: 'Score', value: '98/100' },
    ],
    units: [{ id: 'SF', tenant: 'Dr. Helen Vance', beds: '3 Bed • 2.5 Bath', rent: 3200, bank: 'Amex ACH' }],
  },
  {
    id: 'oak',
    address: '405 Oak Ridge Ln',
    short: '405',
    area: 'South Congress Heights',
    fullAddress: 'South Congress, Austin, TX 78704 • Parcel #5102-07',
    type: 'Bungalow · 2 Bed',
    tier: 'Bungalow',
    rent: 2850,
    rentLabel: '/ target lease',
    net: 0,
    img: IMAGES.oak,
    streetImg: IMAGES.oak,
    pin: { bottom: '22%', left: '48%' },
    status: 'turnover',
    metrics: [
      { label: 'Showings', value: '6 Scheduled', tone: 'text-teal' },
      { label: 'Applications', value: '3 Pending' },
      { label: 'Move-In', value: 'July 1st' },
    ],
    units: [{ id: 'SF', tenant: 'Vacant — Make-Ready', beds: '2 Bed • 1 Bath', rent: 2850, vacant: true }],
  },
];

export const TICKET_HISTORY = [
  { id: '9031', title: 'HVAC Filter & Coil Service', property: '88 Harbor Dr', vendor: 'CoolAir HVAC Services', cost: 145, date: 'Sep 12', icon: 'mode_fan' },
  { id: '9027', title: 'Interior Paint — Turnover', property: '405 Oak Ridge Ln', vendor: 'FreshCoat Painting', cost: 1280, date: 'Sep 3', icon: 'format_paint' },
  { id: '9019', title: 'GFCI Outlet Replacement', property: '124 Maple St · 1A', vendor: 'Brightline Electric', cost: 190, date: 'Aug 21', icon: 'electric_bolt' },
];

export const TENANT_HISTORY = [
  { id: '8870', title: 'Garbage Disposal Jam', date: 'Mar 14', vendor: 'Apex Plumbing Co.', icon: 'delete' },
  { id: '8712', title: 'Bedroom Blinds Replacement', date: 'Jan 8', vendor: 'Dave Wilson Handyman', icon: 'blinds' },
];

export const CATEGORIES = [
  { id: 'plumbing', label: 'Plumbing • Water Leak', icon: 'plumbing' },
  { id: 'electrical', label: 'Electrical • Outlet / Lights', icon: 'electric_bolt' },
  { id: 'hvac', label: 'HVAC • Heating / Cooling', icon: 'mode_fan' },
  { id: 'appliance', label: 'Appliance • Kitchen / Laundry', icon: 'kitchen' },
  { id: 'pest', label: 'Pest Control', icon: 'pest_control' },
  { id: 'other', label: 'General • Other', icon: 'handyman' },
];

export const ROOMS = [
  { id: 'kitchen', name: 'Kitchen', icon: 'kitchen', hint: 'Sink, range & under-cabinet', done: true, clip: '48s' },
  { id: 'living', name: 'Living Area', icon: 'weekend', hint: 'Walls, floors & windows', done: true, clip: '35s' },
  { id: 'bath', name: 'Bathroom 1', icon: 'bathtub', hint: 'Requires 30s panorama of sink & vanity', done: false },
  { id: 'bed', name: 'Master Bedroom', icon: 'bed', hint: 'Closet, walls & flooring', done: false },
  { id: 'patio', name: 'Patio / HVAC Closet', icon: 'balcony', hint: 'Filter tag check & balcony tiles', done: false },
];

export const WINDOWS = [
  { day: 'Today', time: '2 – 4 PM' },
  { day: 'Today', time: '4 – 6 PM' },
  { day: 'Tomorrow', time: '8 – 11 AM' },
];

export const money = (n) => '$' + n.toLocaleString('en-US');
