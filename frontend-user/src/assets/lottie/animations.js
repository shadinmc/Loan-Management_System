// Lottie animation URLs from LottieFiles
// Working Lottie animation URLs from LottieFiles CDN
export const animations = {
  // Finance/Money animations
  finance: 'https://assets2.lottiefiles.com/packages/lf20_06a6pf9i.json',
  money: 'https://assets9.lottiefiles.com/packages/lf20_ysas4vcp.json',
  wallet: 'https://assets4.lottiefiles.com/packages/lf20_qwl4gi2d.json',

  // Home/Building
  home: 'https://assets3.lottiefiles.com/packages/lf20_ynqzqlpo.json',
  building: 'https://assets8.lottiefiles.com/packages/lf20_wbaoumxn.json',

  // Vehicle/Car
  car: 'https://assets6.lottiefiles.com/packages/lf20_2omr5gpu.json',

  // Education
  education: 'https://assets1.lottiefiles.com/packages/lf20_swnrn2oy.json',
  graduation: 'https://assets7.lottiefiles.com/packages/lf20_svy4ivvy.json',

  // Business
  business: 'https://assets5.lottiefiles.com/packages/lf20_xvrofzfk.json',
  growth: 'https://assets2.lottiefiles.com/packages/lf20_jtbfg2nb.json',

  // UI Elements
  success: 'https://assets4.lottiefiles.com/packages/lf20_jbrw3hcz.json',
  loading: 'https://assets1.lottiefiles.com/packages/lf20_poqmycwy.json',
  checkmark: 'https://assets9.lottiefiles.com/packages/lf20_wkaoqcic.json',

  // Icons
  sparkle: 'https://assets3.lottiefiles.com/packages/lf20_obhph3sh.json',
  shield: 'https://assets6.lottiefiles.com/packages/lf20_ky24lkyk.json',
  clock: 'https://assets2.lottiefiles.com/packages/lf20_sz94mu4k.json',
  calculator: 'https://assets8.lottiefiles.com/packages/lf20_4fuy5t7m.json',
  rocket: 'https://assets5.lottiefiles.com/packages/lf20_l5qvxwtf.json',

  // Theme
  sun: 'https://assets7.lottiefiles.com/packages/lf20_xlky4kvh.json',
  moon: 'https://assets4.lottiefiles.com/packages/lf20_ycczmigu.json'
};


// Fallback animation data for offline use
export const fallbackAnimations = {
  loading: {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 120,
    w: 200,
    h: 200,
    nm: "fallback-loading",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "spinner",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 1, k: [{ t: 0, s: [0] }, { t: 120, s: [360] }] },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] }
        },
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [76, 76] }, nm: "Ellipse Path 1" },
              { ty: "st", c: { a: 0, k: [0.176, 0.745, 0.376, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 8 }, lc: 2, lj: 1, ml: 4, nm: "Stroke 1" },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: "Transform" }
            ],
            nm: "Ellipse 1"
          }
        ],
        ip: 0,
        op: 120,
        st: 0,
        bm: 0
      }
    ]
  },
  banking: {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 180,
    w: 420,
    h: 320,
    nm: "banking-clean",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "card-outline",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [210, 160, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] }
        },
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "rc", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [320, 210] }, r: { a: 0, k: 22 } },
              { ty: "st", c: { a: 0, k: [0.176, 0.745, 0.376, 1] }, o: { a: 0, k: 80 }, w: { a: 0, k: 3 }, lc: 2, lj: 1, ml: 4 },
              { ty: "fl", c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 4 }, r: 1 },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } }
            ]
          }
        ],
        ip: 0,
        op: 180,
        st: 0,
        bm: 0
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: "progress-1",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [170, 124, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [{ t: 0, s: [60, 100, 100] }, { t: 90, s: [100, 100, 100] }, { t: 180, s: [60, 100, 100] }] }
        },
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "rc", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [180, 16] }, r: { a: 0, k: 8 } },
              { ty: "fl", c: { a: 0, k: [0.176, 0.745, 0.376, 1] }, o: { a: 0, k: 92 }, r: 1 },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } }
            ]
          }
        ],
        ip: 0,
        op: 180,
        st: 0,
        bm: 0
      },
      {
        ddd: 0,
        ind: 3,
        ty: 4,
        nm: "progress-2",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [155, 162, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [{ t: 0, s: [52, 100, 100] }, { t: 90, s: [100, 100, 100] }, { t: 180, s: [52, 100, 100] }] }
        },
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "rc", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [150, 14] }, r: { a: 0, k: 7 } },
              { ty: "fl", c: { a: 0, k: [0.176, 0.745, 0.376, 1] }, o: { a: 0, k: 88 }, r: 1 },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } }
            ]
          }
        ],
        ip: 0,
        op: 180,
        st: 0,
        bm: 0
      },
      {
        ddd: 0,
        ind: 4,
        ty: 4,
        nm: "coin",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 1, k: [{ t: 0, s: [0] }, { t: 180, s: [360] }] },
          p: { a: 1, k: [{ t: 0, s: [98, 220, 0] }, { t: 90, s: [304, 220, 0] }, { t: 180, s: [98, 220, 0] }] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] }
        },
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [24, 24] } },
              { ty: "fl", c: { a: 0, k: [0.99, 0.82, 0.21, 1] }, o: { a: 0, k: 100 }, r: 1 },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } }
            ]
          }
        ],
        ip: 0,
        op: 180,
        st: 0,
        bm: 0
      },
      {
        ddd: 0,
        ind: 5,
        ty: 4,
        nm: "bank-pulse",
        sr: 1,
        ks: {
          o: { a: 0, k: 92 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [306, 92, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [{ t: 0, s: [85, 85, 100] }, { t: 90, s: [112, 112, 100] }, { t: 180, s: [85, 85, 100] }] }
        },
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [34, 34] } },
              { ty: "st", c: { a: 0, k: [0.176, 0.745, 0.376, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 4 }, lc: 2, lj: 1, ml: 4 },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } }
            ]
          }
        ],
        ip: 0,
        op: 180,
        st: 0,
        bm: 0
      }
    ]
  }
};

