import { useContext } from "react";
import AuthContext from "./AuthContext";
import { Navigate, Route } from "react-router-dom";


const PrivateRoute = ({ children, roles, ...rest }) => {
    const { auth } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            element={
                auth && roles.includes(auth.role) ? (
                    children
                ) : (
                    <Navigate
                        to={{
                            pathname: "/login",
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;
