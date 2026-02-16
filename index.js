const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text

        // أمر الفحص
        if (text === ".تشغيل") {
            await sock.sendMessage(msg.key.remoteJid, { text: "ريو شغال🔥" })
        }

        // لعبة نرد
        if (text === ".نرد") {
            const roll = Math.floor(Math.random() * 6) + 1
            await sock.sendMessage(msg.key.remoteJid, { text: `🎲 رقمك هو: ${roll}` })
        }

        // لعبة حجر ورقة مقص
        if (text === ".حجر" || text === ".ورقة" || text === ".مقص") {
            const choices = [".حجر", ".ورقة", ".مقص"]
            const botChoice = choices[Math.floor(Math.random() * 3)]

            if (text === botChoice)
                return sock.sendMessage(msg.key.remoteJid, { text: `🤝 تعادل! أنا اخترت ${botChoice}` })

            if (
                (text === ".حجر" && botChoice === ".مقص") ||
                (text === ".ورقة" && botChoice === ".حجر") ||
                (text === ".مقص" && botChoice === ".ورقة")
            )
                return sock.sendMessage(msg.key.remoteJid, { text: `🎉 فزت! أنا اخترت ${botChoice}` })
            else
                return sock.sendMessage(msg.key.remoteJid, { text: `😎 خسرت! أنا اخترت ${botChoice}` })
        }

        // أمر تحميل انستا تجريبي
        if (text?.startsWith(".انستا ")) {
            const url = text.split(" ")[1]
            await sock.sendMessage(msg.key.remoteJid, { text: `📥 جاري تحميل الفيديو من: ${url}` })
            // لاحقاً نضيف كود التحميل الحقيقي من API
        }

    })
}

startBot()
