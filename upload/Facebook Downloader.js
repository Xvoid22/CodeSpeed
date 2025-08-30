/* 
• Scrape Facebook Downloader
• Author : SaaOfc's
*/

import axios from "axios";

async function getToken() {
  const url = "https://fbdownloader.to/id";
  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
    }
  });

  const regex = /k_exp="(.*?)".*?k_token="(.*?)"/s;
  const match = html.match(regex);
  if (!match) throw new Error("token g ada");

  return {
    k_exp: match[1],
    k_token: match[2]
  };
}

export async function fbDownloader(fbUrl) {
  const { k_exp, k_token } = await getToken();

  const payload = new URLSearchParams({
    k_exp,
    k_token,
    p: "home",
    q: fbUrl,
    lang: "id",
    v: "v2",
    W: ""
  });

  const { data } = await axios.post("https://fbdownloader.to/api/ajaxSearch", payload, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "User-Agent": "Mozilla/5.0",
      "X-Requested-With": "XMLHttpRequest",
      "Origin": "https://fbdownloader.to",
      "Referer": "https://fbdownloader.to/id"
    }
  });

  if (!data || !data.data) throw new Error("gagal");

  const html = data.data;
  const results = [];

  const rowRegex = /<td class="video-quality">(.*?)<\/td>[\s\S]*?(?:href="(.*?)"|data-videourl="(.*?)")/g;
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const quality = match[1].trim();
    const url = match[2] || match[3];
    if (quality && url) results.push({ quality, url });
  }

  return results;
}

// test
(async () => {
  try {
    const link = "https://www.facebook.com/share/r/1GoCdAyzv7/";
    const hasil = await fbDownloader(link);
    console.log(hasil);
  } catch (err) {
    console.error("emror:", err.message);
  }
})();
