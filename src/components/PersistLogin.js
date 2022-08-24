import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

/**

  user refresh browser, we will lost the state auth
  this is the fn to help user to persist login if user is login

  stored refreshToken in cookies

  Scenario 1: accessToken expired but refreshToken still alive in database
  1. no access token in our useAuth
  2. call refresh token fn
  3. finally set the loading to fasle then return Outlet which is the all the PersistLogin children route

  Scenario 2: accessToken and refreshToken were expired
  1. call refresh token fn
  2. trigger /refresh endpoint with withCredentials true which will bring cookies itself with this request
  3. find for the user from the refreshToken ( fyi: refreshToken is already expired but it still stored in db )
  4. Get the user
  5. decoded the refreshToken with found user which from database
  6. decoded RefreshToken was expired so it will going undefined when decoded it and then compare the foundUser and decoded username will going to failed
  7. return 403

*/

const PersistLogin = () => {
	const [isLoading, setIsLoading] = useState(true);
	const refresh = useRefreshToken();
	const { auth, persist } = useAuth();

	useEffect(() => {
		let isMounted = true;

		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (error) {
				console.error(error);
			} finally {
				// success or error, in the end also set the loading to false
				isMounted && setIsLoading(false);
			}
		};

		// no accessToken call RefreshToken Fn ( refresh browser lost memory token )
		if (!auth?.accessToken) {
			verifyRefreshToken();
			console.log("----- call verifyRefreshToken ----- ");
		} else {
			console.log("----- else  verifyRefreshToken ----- ");
			setIsLoading(false);
		}

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		/**
		 * !persist ( not Checked Trust This Device )
		 * Flow:
		 * 1. Login -> access to other page
		 * 2. Refresh -> auth became empty
		 * 3. Trigger useEffect API
		 * 4. !persist -> Straight return Outlet -> Hit RequireAuth -> Kick Out
		 * 5. UseEffect API Return
		 *
		 * persist
		 * Flow:
		 * 1. Login -> access to other page
		 * 2. Refresh -> auth became empty
		 * 3. Trigger useEffect API
		 * 4. persist -> isLoading ( waiting Refresh Token Return ) -> Hit RequireAuth -> Remain Same Page
		 */
		<>{!persist ? <Outlet /> : isLoading ? <p>Loading....</p> : <Outlet />}</>
	);
};

export default PersistLogin;
