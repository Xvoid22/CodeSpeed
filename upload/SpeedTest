/*
* Nama fitur : SpeedTest
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
* Author : ZenzzXD
*/

import axios from 'axios'

async function runSpeedTest() {
  const startTime = performance.now()
  let uploadSpeed = 0
  let ping = 0
  let networkInfo = { location: 'N/A', org: 'N/A' }

  try {
    const url = 'https://speed.cloudflare.com/__up'
    const data = '0'.repeat(10 * 1024 * 1024)
    const response = await axios.post(url, data, {
      headers: { 'Content-Length': data.length },
      timeout: 30000
    })
    const duration = (performance.now() - startTime) / 1000
    if (response.status === 200) {
      uploadSpeed = data.length / (duration || 1)
    }
  } catch (e) {
    throw new Error(`Upload test gagal : ${e.message}`)
  }

  try {
    const start = performance.now()
    await axios.get('https://www.google.com', { timeout: 10000 })
    ping = Math.round(performance.now() - start)
  } catch {
    ping = 0
  }

  try {
    const response = await axios.get('https://ipinfo.io/json', { timeout: 10000 })
    if (response.status === 200) {
      const data = response.data
      networkInfo.location = `${data.city || 'N/A'}, ${data.country || 'N/A'}`
      networkInfo.org = (data.org || 'N/A').replace('AS', '')
    }
  } catch {
    networkInfo = { location: 'N/A', org: 'N/A' }
  }

  const formatSpeed = (bytesPerSec) => {
    if (bytesPerSec <= 0) return '0 Mbps'
    const mbits = (bytesPerSec * 8) / (1024 * 1024)
    return mbits >= 1 ? `${mbits.toFixed(1)} Mbps` : `${(mbits * 1000).toFixed(1)} Kbps`
  }

  return {
    upload: formatSpeed(uploadSpeed),
    ping: `${ping} ms`,
    server: networkInfo.location,
    provider: networkInfo.org,
    duration: `${((performance.now() - startTime) / 1000).toFixed(1)} sec`,
    time: new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(',', '')
  }
}

let handler = async (m, { command }) => {
  try {
    m.reply('wett')
    const result = await runSpeedTest()
    let caption = `📊 *Internet Upload Test :*\n\n`
    caption += `*📤 Upload : ${result.upload}*\n`
    caption += `*🕒 Ping : ${result.ping}*\n\n`
    caption += `*🌐 Server : ${result.server}*\n`
    caption += `*📡 Provider :  ${result.provider}*\n\n`
    caption += `*⌚️ Test took : ${result.duration}*\n`
    caption += `*📅 Time : ${result.time}*`
    await m.reply(caption)
  } catch (err) {
    m.reply(`Eror kak : ${err.message}`)
  }
}

handler.help = ['speedtest']
handler.tags = ['tools']
handler.command = ['speedtest']

export default handler