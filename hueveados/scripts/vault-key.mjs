// Imprime una clave AES-256 nueva (base64url) para el secreto HV_VAULT_KEY.
// Se usa con un pipe para que la clave no quede escrita en ningún archivo:
//   npm run secret:vault
// OJO: cambiarla deja ilegibles las contraseñas ya guardadas en la pestaña Cuentas.
const key = crypto.getRandomValues(new Uint8Array(32));
process.stdout.write(Buffer.from(key).toString("base64url"));
