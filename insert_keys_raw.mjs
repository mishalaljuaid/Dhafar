import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

async function main() {
    await pool.query(`
    INSERT INTO site_settings (setting_key, setting_value, updated_at) 
    VALUES ('recaptcha_site_key', '6LdCrHMsAAAAAGkgNMXvMVONKfs0qJuiPSRm6y3B', NOW())
    ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = NOW();
  `);

    await pool.query(`
    INSERT INTO site_settings (setting_key, setting_value, updated_at) 
    VALUES ('recaptcha_secret_key', '6LdCrHMsAAAAAG1XmmA21OF0iXnBRwP6aCAg6FbH', NOW())
    ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = NOW();
  `);

    console.log('\n✅ Keys successfully saved directly to database!');
}

main().catch(console.error).finally(() => pool.end());
