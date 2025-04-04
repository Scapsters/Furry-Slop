import sql, { validateResponse } from "../db";

export async function generateSHA256Hash(message: string): Promise<string> {
	const msgBuffer = new TextEncoder().encode(message);
	const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hashHex;
}

export async function validateSession(
	username: string,
	sessionKey: string
): Promise<boolean> {
	const sessionKeyQuery = await sql`
        SELECT session_key, session_expiration
            FROM users 
            WHERE username = ${username}
    `;
	if (!validateResponse(sessionKeyQuery)) {
		return false;
	}

	const targetSessionKey = sessionKeyQuery[0].session_key;
	const sessionExpiration = sessionKeyQuery[0].session_expiration;

	if (targetSessionKey !== sessionKey) {
		return false;
	}
	if (sessionExpiration < Date.now()) {
		return false;
	}

	return true;
}
