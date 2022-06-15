/*
const url = "vhttps://www.gov-online.go.jp/eng/publicity/book/hlj/index.html";
const data = await (await fetch(url)).text();
const dom = HTMLParser.parse(data);
const uls = dom.querySelectorAll(".gallerySlider02");
*/
import { fix0 } from "https://js.sabae.cc/fix0.js";
import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { fetchOrLoad } from "https://js.sabae.cc/fetchOrLoad.js";
import { TinySegmenter } from "https://code4fukui.github.io/TinySegmenter/TinySegmenter.js";
import { ArrayUtil } from "https://js.sabae.cc/ArrayUtil.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

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
const getKeywords = (text, max = 20) => {
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

const keys = [];
const list = [];
const base = "https://www.gov-online.go.jp/eng/publicity/book/hlj/";
for (let year = 2011; year <= 2022; year++) {
  for (let month = 1; month <= 12; month++) {
    const date = `${year}-${fix0(month, 2)}-01`;
    const url = `${base}/${year}${fix0(month, 2)}01.html`;
    const text = await fetchOrLoad(url);
    const dom = HTMLParser.parse(text);
    const title = dom.querySelector("title").textContent;
    if (title == "お探しのページが見つかりません | 政府広報オンライン") {
      continue;
    }
    const as = dom.querySelectorAll("a");
    for (const a of as) {
      if (a.textContent == "Japanese") {
        const url = base + a.getAttribute("href");
        /*
        if (url != "https://www.gov-online.go.jp/eng/publicity/book/hlj/html/202203/202203_11_jp.html") { // HTMLParserで失敗する
          continue;
        }
        */
        const body = await fetchOrLoad(url);
        const dom = HTMLParser.parse(body);
        const title = dom.querySelector("title").textContent;
        const img0 = dom.querySelector(".mainPhoto img")?.getAttribute("src");
        const img = img0 ? url.substring(0, url.lastIndexOf("/") + 1) + img0 : null;
        const desc = dom.querySelector("meta[name=description]")?.getAttribute("content");
        //console.log(url, img, title, desc);
        const text = dom.querySelector(".rightSide")?.textContent || dom.querySelector("#contents")?.textContent;
        const keywords = getKeywords(text, 30);
        //console.log(keywords.join(","));
        for (const k of keywords) {
          keys.push(k);
        }
        list.push({
          url,
          title: title.substring(0, title.indexOf(" | ")),
          keyword: keywords.join(","),
          date,
          desc,
          img,
        });
      }
    }
  }
}
await Deno.writeTextFile("../data_ja.csv", CSV.stringify(list));
await Deno.writeTextFile("../data_ja.json", JSON.stringify(list, null, 2));

const cnt = ArrayUtil.countBy(keys);
//console.log(cnt);
const bigwords = Object.entries(cnt).map(e => {
  return { name: e[0], value: e[1] };
}).sort((a, b) => b.value - a.value);
const big100 = bigwords.slice(0, Math.min(500, bigwords.length));
console.log(JSON.stringify(big100, null, 2));
