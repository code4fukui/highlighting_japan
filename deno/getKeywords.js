import { TinySegmenter } from "https://code4fukui.github.io/TinySegmenter/TinySegmenter.js";

const countByKey = (ar) => {
  const names = [];
  const values = [];
  for (const a of ar) {
    const n = names.indexOf(a);
    if (n == -1) {
      names.push(a);
      values.push(1);
    } else {
      values[n]++;
    }
  }
  const cnt = {};
  for (let i = 0; i < names.length; i++) {
    cnt[names[i]] = values[i];
  }
  return cnt;
};
export const getKeywords = (text, max = 20) => {
  const segs = TinySegmenter.segment(text);
  const histo0 = countByKey(segs);
  //console.log(segs, histo0);
  const histo = Object.entries(histo0).map(e => {
    return { name: e[0], value: e[1] };
  }).filter(a => a.name.length >= 3);
  histo.sort((a, b) => b.value - a.value);
  const histo2 = histo.slice(0, Math.min(max, histo.length));
  //console.log(histo2);
  return histo2.map(h => h.name);
};
