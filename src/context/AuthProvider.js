import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({});
	/*
    we are not store our jwt inside localstorage
    this persist will only store boolean for telling us one info. do we trust this device
    As exmaple:
    we use other person computer to login, the refreshToken will not expired soon and we didn't signout for it
    this checkbox "Trust is device" will help to validate
  */
	const [persist, setPersist] = useState(
		JSON.parse(localStorage.getItem("persist")) || false
	);

	return (
		<AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
