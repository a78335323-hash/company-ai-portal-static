import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS = [
  {
    email: "luca@lucagri.it",
    passwordHash: "$2a$10$INSERISCI_HASH",
    company: "Lucagri"
  },
  {
    email: "mattia@agrichampion.it",
    passwordHash: "$2a$10$INSERISCI_HASH",
    company: "Agrichampion"
  }
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body || {};

  const user = USERS.find(u => u.email === email);
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

  res.status(200).json({ token, company: user.company });
}
