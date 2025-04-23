import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from "../context/AuthContext";

const useSignin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const signin = async (username, password) => {
        const success = handleInputError({ username, password });
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch("/api/v1/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            })
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            localStorage.setItem("chat-user", JSON.stringify(data));
            setAuthUser(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return { signin, loading };
}

function handleInputError({ username, password }) {
    if (!username || !password) {
        toast.error("Please fill all the fields");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    return true;
}

export default useSignin
