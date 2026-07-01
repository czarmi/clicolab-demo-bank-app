const fs = require('fs');
const passport = require('passport');
const { Strategy: SamlStrategy } = require('passport-saml');
const pool = require('./db');
require('dotenv').config();

let idpCert = '';
let samlEnabled = false;

try {
  idpCert = fs.readFileSync(process.env.SAML_CERT_PATH, 'utf-8').trim();
  if (idpCert.length > 0) {
    samlEnabled = true;
  }
} catch (e) {
  console.warn(
    `[SAML] IdP certificate not found at ${process.env.SAML_CERT_PATH}. ` +
    'SAML login will be disabled until a valid certificate is provided.'
  );
}

if (samlEnabled) {
  passport.use(
    new SamlStrategy(
      {
        entryPoint: process.env.SAML_ENTRY_POINT,
        issuer: process.env.SAML_ISSUER,
        callbackUrl: process.env.SAML_CALLBACK_URL,
        cert: idpCert,
        acceptedClockSkewMs: 5000,
      },
      async (profile, done) => {
        try {
          const email = profile.email || profile.nameID;
          const fullName = profile.displayName || profile.cn || email;

          const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
          let user;
          if (existing.rows.length === 0) {
            const insert = await pool.query(
              `INSERT INTO users (email, full_name, auth_provider, saml_subject_id)
               VALUES ($1, $2, 'saml', $3) RETURNING *`,
              [email, fullName, profile.nameID]
            );
            user = insert.rows[0];
          } else {
            user = existing.rows[0];
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      done(null, result.rows[0]);
    } catch (err) {
      done(err);
    }
  });

  console.log('[SAML] Strategy registered successfully.');
} else {
  console.warn('[SAML] Strategy NOT registered. Local login/registration will still work normally.');
}

module.exports = { passport, samlEnabled };