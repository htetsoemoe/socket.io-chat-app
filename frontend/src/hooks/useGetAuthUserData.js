import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";

const useGetAuthUserData = () => {
    const { authUser, setAuthUser } = useAuthContext();
    const [userData, setUserData] = useState({})

    const getUserData = async () => {
        const res = await fetch('/api/v1/users/data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const data = await res.json();
        console.log(`get-auth-user-data: ${JSON.stringify(data)}`);
        localStorage.setItem("chat-user", JSON.stringify(data?.userData)); // Update AuthContext and if home page refresh, get update user data
        setUserData(data?.userData); // if sidebar refresh, get update user data
    }

    return { getUserData, userData };
}

export default useGetAuthUserData