// Genera el hash de una contraseña para los secretos HV_PASS_MANU / HV_PASS_ELIAS / HV_PASS_NICO.
//
//   npm run hash                         → inventa una contraseña segura y muestra contraseña + hash
//   npm run hash -- "mi contraseña"      → usa la tuya (mínimo 12 caracteres)
//   npm run hash -- --iter 20000 ...     → cambia las iteraciones (por defecto 25.000)
//
// Todo pasa en tu computadora; la contraseña no se manda a ningún lado.
import { hashPassword, PBKDF2_ITERATIONS } from "../src/password.js";

const args = process.argv.slice(2);
let iterations = PBKDF2_ITERATIONS;
const i = args.indexOf("--iter");
if (i !== -1) {
  iterations = Number(args[i + 1]);
  args.splice(i, 2);
  if (!Number.isInteger(iterations) || iterations < 1000 || iterations > 100000) {
    console.error("--iter tiene que ser un número entero entre 1000 y 100000.");
    process.exit(1);
  }
}

// Sin letras confusas (0/O, 1/l/I) para que se pueda dictar o copiar a mano.
const ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function randomPassword(length = 20) {
  const out = [];
  while (out.length < length) {
    const [b] = crypto.getRandomValues(new Uint8Array(1));
    if (b < 256 - (256 % ALPHABET.length)) out.push(ALPHABET[b % ALPHABET.length]);
  }
  return out.join("");
}

let password = args.join(" ");
const generated = !password;
if (generated) password = randomPassword();
else if (password.length < 12) {
  console.error("La contraseña tiene que tener al menos 12 caracteres.");
  process.exit(1);
}

const hash = await hashPassword(password, iterations);
console.log("");
if (generated) console.log(`Contraseña: ${password}\n  → Dásela al socio y guardala en un gestor de contraseñas. No se puede recuperar desde el hash.\n`);
console.log(`Hash (esto es lo que va en Cloudflare):\n${hash}\n`);
