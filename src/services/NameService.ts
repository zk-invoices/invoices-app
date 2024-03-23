import isEmail from "validator/es/lib/isEmail";

export async function resolveEmail(email: string) {
  if (!isEmail(email)) { return null; }

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/name?email=${email}`),
    body = await res.json();

  if (res.status !== 200) {
    console.error(body.error.message);

    return null;
  }

  return body.address;
}