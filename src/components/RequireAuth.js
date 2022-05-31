import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
	const { auth } = useAuth();
	const location = useLocation();

	if (auth?.roles?.find((role) => allowedRoles?.includes(role))) {
		console.log("first reuireAuth");
		return <Outlet />;
	}

	if (auth?.user) {
		console.log("second reuireAuth");
		return <Navigate to="/unauthorized" state={{ from: location }} replace />;
	}

	console.log("last reuireAuth");
	return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
