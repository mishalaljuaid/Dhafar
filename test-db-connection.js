const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

client.connect()
  .then(() => {
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح!');
    client.end();
  })
  .catch((err) => {
    console.error('❌ فشل الاتصال بقاعدة البيانات. التفاصيل:', err.message);
    client.end();
  });
