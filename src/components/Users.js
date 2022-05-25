import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";

const Users = () => {
	const [users, setUsers] = useState();
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getUsers = async () => {
			try {
				const response = await axiosPrivate.get("/users", {
					signal: controller.signal,
				});

				console.log(response.data);
				isMounted && setUsers(response.data);
			} catch (error) {
				console.error("user component: ", error);
				// back to where they was after login
				navigate("/login", { state: { from: location }, replace: true });
			}
		};

		getUsers();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	return (
		<article>
			<h2>Users List</h2>
			{users?.length ? (
				<ul>
					{users.map((user, i) => (
						<li key={i}>{user?.username}</li>
					))}
				</ul>
			) : (
				<p>No Users to display</p>
			)}
		</article>
	);
};

export default Users;