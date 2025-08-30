let Izumi = async (m, { conn,  text }) => {
    if (!text) return m.reply('Masukan Teks Buat Boardcast')
    const userId = Object.keys(db.data.users).filter(id => id)
    const groupId = Object.keys(db.data.chats).filter(id => id.startsWith('-'));

    let caption = 'Boardcast Dari: %name\n⌨️Text: %text';
    let boardc = caption
        .replace(/%name/g, m.name)
        .replace(/%text/g, text)

    for (let i = 0; i < userId.length; i++) {
        try {
            await conn.telegram.sendMessage(userId[i], boardc);
        } catch (e) {
            if (e.response && e.response.description === "Forbidden: bots can't send messages to bots") {
                console.log(" Skip bot ID " + userId[i]);
            } else {
                console.log(" Gagal kirim ke " + userId[i] + ": " + e.message);
            };
        };
    };

    for (let i = 0; i < groupId.length; i++) {
        try {
            await conn.telegram.sendMessage(groupId[i], boardc);
        } catch (e) {
            console.log(" Gagal kirim ke group " + groupId[i] + ": " + e.message);
        };
    };
};

Izumi.command = /^boardcast$/i
Izumi.help = ['boardcast'];
Izumi.tags = ['owner'];
Izumi.owner = true;

export default Izumi;
