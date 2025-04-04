import React, { useCallback, useContext, useEffect, useState } from "react";
import { apiContext } from "../../../App.tsx";

export const Login = () => {
	const API = useContext(apiContext);

	const [loginForm, setLoginForm] = useState({ username: "", password: "" });
	const [createAccountForm, setCreateAccountForm] = useState({
		username: "",
		password: "",
	});

	const [status, setStatus] = useState("Logged Out");
	const [temporaryStatus, setTemporaryStatus] = useState("");

	// Clear temporary status after 2 seconds
	useEffect(() => {
		async function clearTemporaryStatus() {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setTemporaryStatus("");
		}
		clearTemporaryStatus();
	}, [temporaryStatus]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		formSetter: React.Dispatch<React.SetStateAction<any>>
	) => {
		const { name, value } = e.target;
		formSetter((prev) => ({ ...prev, [name]: value }));
	};

	const makeRequest = useCallback(
		async (method: string, endpoint: string, body: object) => {
			try {
				const response = await fetch(`${API}${endpoint}`, {
					method: method,
					headers: {
						"Content-Type": "application/json",
					},
					...(method === "GET" ? {} : { body: JSON.stringify(body) }),
				});
				const data = await response.json();
				return data;
			} catch (error) {
				return { error: "Request failed" };
			}
		},
		[API]
	);

	const loginHandler = useCallback(
		async (username: string, password: string) => {
			const password_hash = await generateSHA256Hash(password);

			const result = await makeRequest("POST", "/Api/Users/Login", {
				username,
				password_hash,
			});
			if (result.error) {
				setTemporaryStatus("Login failed. Please try again.");
			} else {
				setCookie("session_key", result.session_key, 1);
				setCookie("username", username, 1);
				setStatus(`Logged in as ${username}`);
				setTemporaryStatus("Login successful!");
			}
		},
		[makeRequest]
	);

	const logOutHandler = async () => {
		const username = getCookie("username") ?? "";
		const session_key = getCookie("session_key") ?? "";

		const result = await makeRequest("POST", "/Api/Users/Logout", {
			username,
			session_key,
		});
		if (result.error) {
			setTemporaryStatus("Logout failed. Please try again.");
		} else {
			setStatus("Logged Out");
			setTemporaryStatus("Logout successful!");
		}
	};

	const createAccountHandler = async (username: string, password: string) => {
		const password_hash = await generateSHA256Hash(password);

		const result = await makeRequest("POST", "/Api/Users/CreateAccount", {
			username,
			password_hash,
		});
		if (result.error) {
			setTemporaryStatus("Account creation failed. Please try again.");
		} else {
			setTemporaryStatus("Account created successfully!");
		}
	};

	const resumeSession = useCallback(
		async (username: string, session_key: string) => {
			const result = await makeRequest("GET", "/Api/Users/Resume", {
				username,
				session_key,
			});
			if (result.error) {
				setTemporaryStatus("Session resume failed. Please try again.");
				setStatus("Logged Out");
			} else {
				setStatus(`Logged in as ${username}`);
				setTemporaryStatus("Session resumed successfully!");
			}
		},
		[makeRequest]
	);

	// Attempt logon on mount
	useEffect(() => {
		const session_key = getCookie("session_key") ?? "";
		const username = getCookie("username") ?? "";

		if (session_key && username) {
			resumeSession(username, session_key);
		} else {
			setStatus("Logged Out");
		}
	}, [resumeSession]);

	return (
		<>
			<p>{status}</p>
			<p>{temporaryStatus}</p>
			<h1>Login</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					loginHandler(loginForm.username, loginForm.password);
				}}
			>
				<input
					type="text"
					name="username"
					placeholder="Username"
					value={loginForm.username}
					onChange={(e) => handleInputChange(e, setLoginForm)}
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={loginForm.password}
					onChange={(e) => handleInputChange(e, setLoginForm)}
					required
				/>
				<button type="submit">Login</button>
			</form>
			<h1>Create Account</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					createAccountHandler(
						createAccountForm.username,
						createAccountForm.password
					);
				}}
			>
				<input
					type="text"
					name="username"
					placeholder="Username"
					value={createAccountForm.username}
					onChange={(e) => handleInputChange(e, setCreateAccountForm)}
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={createAccountForm.password}
					onChange={(e) => handleInputChange(e, setCreateAccountForm)}
					required
				/>
				<button type="submit">Create Account</button>
			</form>
			<h1>Logout</h1>
			<button onClick={() => logOutHandler()}>Logout</button>
		</>
	);
};

async function generateSHA256Hash(message: string): Promise<string> {
	const msgBuffer = new TextEncoder().encode(message);
	const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hashHex;
}

function getCookie(name: string): string | undefined {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(";").shift() ?? "";
	return undefined;
}

function setCookie(name: string, value: string, days: number) {
	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	const expires = "expires=" + date.toUTCString();
	document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
