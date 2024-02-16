import { fontSplit } from '@konghayao/cn-font-split';

// for (const type of ['Bold', 'Demibold', 'ExtraLight', 'Heavy', 'Light', 'Medium', 'Regular', 'Semibold', 'Thin']) {
//   await fontSplit({
//     FontPath: `../src/assets/fonts/MiSans/ttf/MiSans-${type}.ttf`,
//     destFold: `../public/assets/fonts/MiSans/${type}`,
//     targetType: 'woff2',
//     chunkSize: 70 * 1024,
//     testHTML: false,
//     reporter: false,
//     threads: {},
//     cssFileName: `MiSans-${type}.css`,
//     css: {
//       fontFamily: 'MiSans',
//       localFamily: false,
//     },
//   });
// }

await fontSplit({
  FontPath: `../src/assets/fonts/MiSans/MiSans VF.ttf`,
  destFold: `../public/assets/fonts/MiSans/MiSans VF`,
  targetType: 'woff2',
  chunkSize: 70 * 1024,
  testHTML: false,
  reporter: false,
  threads: {},
  cssFileName: `MiSans-VF.css`,
  css: {
    fontFamily: 'MiSans VF',
    localFamily: false,
    fontWeight: false,
  },
});
