/*
	This code shows a naive approach of persisting user session data
	in a cookie. In a production-grade app, you'll probably want to use authentication tokens instead. 

	For example, the firebase-admin/auth package offers a `getAuth().verifyIdToken(token)` method for server side code. The `token` can be sent from the client and stored in a cookie.
*/

// This src/app/api/route.js is a Next.js route handler
export async function POST(request) {
	const { email = "", id = "", displayName } = await request.json();

	const headers = {};

	if (!email || !id || !displayName) {
		// Set the cookie with an expired date to delete it
		headers["Set-Cookie"] =
			"FRIENDLY_EATS_USER=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	} else {
		// email, id and displayName are the only user-related fields used by the frontend
		headers["Set-Cookie"] = `FRIENDLY_EATS_USER=${JSON.stringify({
			email,
			id,
			displayName,
		})}`;
	}

	return new Response("Session information is stored", {
		status: 200,
		headers,
	});
}
