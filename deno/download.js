import { fix0 } from "https://js.sabae.cc/fix0.js";
import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { fetchOrLoad } from "https://js.sabae.cc/fetchOrLoad.js";
import { ArrayUtil } from "https://js.sabae.cc/ArrayUtil.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { getKeywords } from "./getKeywords.js";

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
        // if (url != "https://www.gov-online.go.jp/eng/publicity/book/hlj/html/202203/202203_11_jp.html") continue; // HTMLParserで失敗する??
        const body = await fetchOrLoad(url);
        const dom = HTMLParser.parse(body);
        const title = dom.querySelector("title").textContent;
        const img0 = dom.querySelector(".mainPhoto img")?.getAttribute("src");
        const img = img0 ? url.substring(0, url.lastIndexOf("/") + 1) + img0 : null;
        const desc = dom.querySelector("meta[name=description]")?.getAttribute("content");
        const text = dom.querySelector(".rightSide")?.textContent || dom.querySelector("#contents")?.textContent;
        const keywords = getKeywords(text, 30);
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
const bigwords = Object.entries(cnt).map(e => {
  return { name: e[0], value: e[1] };
}).sort((a, b) => b.value - a.value);
const big100 = bigwords.slice(0, Math.min(500, bigwords.length));
console.log(JSON.stringify(big100, null, 2));
