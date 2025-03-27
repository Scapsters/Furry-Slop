import sql from "./db";

/**
 * Attempt to create a new account with the given username and password.
 * @param username
 * @param password SHA-256 Hexadecimal
 * @return Was creation successful
 */
const createAccount = async (
	username: string,
	password_hash: string
): Promise<boolean> => {
	// Attempt an insert. Will fail on non-unique username
	console.log("Attempting to create account. Username: " + username);
	try {
		await sql`
            INSERT INTO accounts ( 
                username,
                password_hash
            ) VALUES (
                ${username},
                ${password_hash}
            )
        `;
		console.log("Account created. Username: " + username);
		return true;
	} catch (error) {
		console.log("Account creation failed. Username: " + username);
		return false;
	}
};

/**
 * Attempts to log in to an account.
 * On success returns a session key. On fail returns 0.
 * @param username 
 * @param password_hash SHA-256 Hexadecimal
 */
const login = async (username: string, password_hash: string) => {
	console.log(
		"Attempting login. username: " +
			username +
			" password_hash " +
			password_hash
	);
	const target_hash_query = await sql`
        SELECT password_hash FROM accounts WHERE username = ${username}
    `
    const target_hash = target_hash_query[0].password_hash
    console.log("Target hash is: " + target_hash)

    if(password_hash !== target_hash) {
        console.log("Login failed. Password hash mismatch. Returning 0")
        return 0
    }
};
