import { useRef, useState, useEffect } from "react";

import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

const LOGIN_URL = "/auth";

const Login = () => {
	const { setAuth, persist, setPersist } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";

	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState("");
	const [pwd, setPwd] = useState("");
	const [errMsg, setErrMsg] = useState("");
	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [user, pwd]);

	useEffect(() => {
		localStorage.setItem("persist", persist);
	}, [persist]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				LOGIN_URL,
				JSON.stringify({ user, pwd }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);

			const accessToken = response?.data?.accessToken;
			const roles = response?.data?.roles;

			setAuth({ user, pwd, roles, accessToken });
			console.log({ user, roles, accessToken });
			setUser("");
			setPwd("");

			// back to where they was after login
			navigate(from, { replace: true });
		} catch (err) {
			if (!err?.response) setErrMsg("No Server Response");
			else if (err.response?.status === 400)
				setErrMsg("Missing Username or Password");
			else if (err.response?.status === 401) setErrMsg("Unauthorized");
			else setErrMsg("Login Failed");
			errRef.current.focus();
		}
	};

	const togglePersist = () => {
		setPersist((prev) => !prev);
	};

	return (
		<section>
			<p
				ref={errRef}
				className={errMsg ? "errmsg" : "offscreen"}
				aria-live="assertive"
			>
				{errMsg}
			</p>
			<h1>Sign In</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="username">Username:</label>
				<input
					type="text"
					id="username"
					placeholder="admin"
					ref={userRef}
					autoComplete="off"
					onChange={(e) => setUser(e.target.value)}
					value={user}
					required
				/>

				<label htmlFor="password">Password:</label>
				<input
					type="password"
					id="password"
					placeholder="S!mple01"
					onChange={(e) => setPwd(e.target.value)}
					value={pwd}
					required
				/>
				<button>Sign In</button>
				<div className="persistCheck">
					<input
						type="checkbox"
						id="persist"
						onChange={togglePersist}
						checked={persist}
					/>
					<label htmlFor="persist">Trust This Device?</label>
				</div>
			</form>
			<p>
				Need an Account?
				<br />
				<span className="line">
					{/*put router link here*/}
					<a href="#">Sign Up</a>
				</span>
			</p>
		</section>
	);
};

export default Login;
