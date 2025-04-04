import sql from "../db";
import { generateSHA256Hash, validateSession } from "./processing";

/**
 * Attempt to create a new account with the given username and password.
 * @param username
 * @param password SHA-256 Hexadecimal
 * @return Was creation successful
 */
export async function createAccount(
	username: string,
	password_hash: string
): Promise<{ error: string }> {
	// Attempt an insert. Will fail on non-unique username
	try {
		await sql`
            INSERT INTO users ( 
                username,
                password_hash
            ) VALUES (
                ${username},
                ${password_hash}
            )
        `;
		return { error: "" };
	} catch (error) {
		return { error: "Account creation failed. Username already exists." };
	}
}

/**
 * Attempts to log in to an account.
 * On success returns a session key. On fail returns 0.
 * @param username
 * @param password_hash SHA-256 Hexadecimal
 */
export async function login(username: string, password_hash: string) {
	const target_hash_query = await sql`
        SELECT password_hash 
			FROM users 
			WHERE username = ${username} 
    `;
	if (!target_hash_query.length) {
		return { error: "Username not found" };
	}

	const target_hash = target_hash_query[0].password_hash;

	if (password_hash !== target_hash) {
		return { error: "Login failed. Incorrect password." };
	}

	const session_key = await generateSHA256Hash(String(Math.random()));

	const session_key_update = await sql`
		UPDATE users
			SET
				session_key = ${session_key},
				session_expiration = ${Date.now() + 1000 * 10}
			WHERE username = ${username} 
			RETURNING session_key
	`;
	return {
		error: "",
		session_key: session_key_update[0].session_key,
	};
}

export async function logout(username: string, session_key: string) {
	if (!(await validateSession(username, session_key))) {
		return { error: "Session key validation failed." };
	}

	await sql`
		UPDATE users
			SET session_expiration = ${Date.now()}
			WHERE username = ${username}
	`;

	return { error: "" };
}
