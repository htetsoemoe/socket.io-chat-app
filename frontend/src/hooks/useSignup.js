import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({ name, username, password, confirmPassword, gender, email }) => {
        const success = handleInputError({ name, username, password, confirmPassword, gender, email });
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch("/api/v1/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, username, password, confirmPassword, gender, email })
            })
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            localStorage.setItem("chat-user", JSON.stringify(data.user));
            setAuthUser(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return { signup, loading };
}

export default useSignup

// data validation with `react-hot-toast`
function handleInputError({ name, username, password, confirmPassword, gender, email }) {

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

    if (!name || !username || !password || !confirmPassword || !gender || !email) {
        toast.error("Please fill all the fields");
        return false;
    }

    if (password !== confirmPassword) {
        toast.error("Password and confirm password does not match");
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
