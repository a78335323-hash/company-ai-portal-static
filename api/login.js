import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  let body = "";

  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({ error: "Body non valido" });
  }

  const { email, password } = body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email e password obbligatorie" });
  }

  const user = USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    return res.status(401).json({ error: "Email o password non corretti" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Email o password non corretti" });
  }

  const token = jwt.sign(
    { email: user.email, company: user.company },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.status(200).json({
    token,
    company: user.company
  });
}
