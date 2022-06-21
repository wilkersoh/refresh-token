import { useEffect } from "react";
import useAuth from "./useAuth";
import axios from "../api/axios";
import jwt_decode from "jwt-decode";

const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refresh = async () => {
		const response = await axios.get("/refresh", {
			withCredentials: true,
		});

		const decoded = response?.data.accessToken
			? jwt_decode(response.data.accessToken)
			: undefined

		setAuth((prev) => {
			return {
				...prev,
				user: decoded?.UserInfo?.username || '',
				accessToken: response.data.accessToken
			};
		});

		return response.data.accessToken;
	};

	return refresh;
};

export default useRefreshToken;
