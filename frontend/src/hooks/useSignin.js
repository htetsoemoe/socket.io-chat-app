import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from "../context/AuthContext";

const useSignin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const signin = async (email, password) => {
        const success = handleInputError({ email, password });
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch("/api/v1/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email, password })
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

function handleInputError({ email, password }) {
    /**
        ^ – Start of string.
        [a-zA-Z0-9._%+-]+ – Matches the username part (before @), allowing letters, digits, dots, underscores, etc.
        @ – The required @ symbol.
        [a-zA-Z0-9.-]+ – Matches the domain name.
        \. – The literal dot (.) before the domain extension.
        [a-zA-Z]{2,} – The domain extension (e.g., com, org, io) with at least two letters.
        $ – End of string.
     */
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !password) {
        toast.error("Please fill all the fields");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    // Check if email is valid email format
    if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email");
        return false;
    }

    return true;
}

export default useSignin
