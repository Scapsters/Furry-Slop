import sql, { validateResponse } from "../db";

export async function hasViewed(username: string, tweetid: string) {
	const response = await sql`
        SELECT * FROM views WHERE username = ${username} AND status_id = ${tweetid}
    `;

	if (!validateResponse(response)) {
		return { error: "Unknown failure." };
	}

	if (response.length > 0) {
		return { error: "", hasViewed: true };
	} else {
		return { error: "", hasViewed: false };
	}
}
