const bcrypt = require('bcryptjs');
const passwordHash = require('password-hash');

const BCRYPT_ROUNDS = 10;

// Hash a new password with bcrypt.
const hashPassword = async (plain) => bcrypt.hash(plain, BCRYPT_ROUNDS);

// bcrypt hashes start with $2a$/$2b$/$2y$; anything else is a legacy
// password-hash value ("sha1$..."), so we verify with the old library.
const isBcryptHash = (hash) => typeof hash === 'string' && /^\$2[aby]\$/.test(hash);

const verifyPassword = async (plain, hash) => {
  if (!hash) return false;
  if (isBcryptHash(hash)) return bcrypt.compare(plain, hash);
  try {
    return passwordHash.verify(plain, hash);
  } catch {
    return false;
  }
};

// True when a stored hash is legacy and should be upgraded to bcrypt on login.
const needsRehash = (hash) => !isBcryptHash(hash);

module.exports = {hashPassword, verifyPassword, needsRehash};
