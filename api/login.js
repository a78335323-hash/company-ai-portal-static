const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const USERS = [
  {
    email: "luca@lucagri.it",
    passwordHash: "$2a$10$6eoWBtfc6y5EpiMNU9Tr1eRuLCivU2TVtdUApksuXpCbbQYzjTSIG",
    company: "Lucagri"
  },
  {
    email: "mattia@agrichampion.it",
    passwordHash: "$2a$10$9zD5QxhAwPYLOHLSByx4ou./p6t80MPoMJHAVqRIsxWKC6EwU4q2O",
    company: "Agrichampion"
  }
];

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, companySelected } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Credenziali mancanti" });
    }

    const user = USERS.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Email o password non corretti" });
    }

    // blocco: un utente non può entrare nell'altra azienda
    if (companySelected && companySelected !== user.company) {
      return res.status(401).json({ error: "Utente non autorizzato per questa azienda" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Email o password non corretti" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET non configurata su Vercel" });
    }

    const token = jwt.sign(
      { email: user.email, company: user.company },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.status(200).json({ token, company: user.company });
  } catch (err) {
    return res.status(500).json({ error: "Errore server", details: String(err) });
  }
};
