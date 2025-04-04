import sql from "../db";
import { validateSession } from "../users/processing";

export async function addBan(
	username: string,
	sessionKey: string,
	statusId: string
) {
	if (!(await validateSession(username, sessionKey))) {
		console.log("Session key invalid. Returning false.");
		return { error: "Session key invalid." };
	}

	const permissionsQuery = await sql`
        SELECT permissions FROM USERS WHERE username = username
    `;
	const permissions = permissionsQuery[0].permissions;

	if (permissions != 1) {
		return { error: "User does not have permission to ban." };
	}

	await sql`
        INSERT INTO bans (status_id) VALUES (${statusId})
    `;
	return { error: "" };
}

export async function isBanned(statusId: string) {
	const response = await sql`
        SELECT * FROM bans WHERE status_id = ${statusId}
    `;

	if (response.length > 0) {
		return { error: "", isBanned: true };
	} else {
		return { error: "", isBanned: false };
	}
}
