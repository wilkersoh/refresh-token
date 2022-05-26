import { useEffect } from "react";
import useAuth from "./useAuth";
import axios from "../api/axios";

const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refresh = async () => {
		console.log("response in useRefreshToken :>> ");
		const response = await axios.get("/refresh", {
			withCredentials: true,
		});
		console.log("re", response);
		setAuth((prev) => {
			console.log("prev:", JSON.stringify(prev));
			console.log("accessToken:", response.data.accessToken);
			return {
				...prev,
				roles: response.data.roles,
				accessToken: response.data.accessToken,
			};
		});

		return response.data.accessToken;
	};

	return refresh;
};

export default useRefreshToken;
