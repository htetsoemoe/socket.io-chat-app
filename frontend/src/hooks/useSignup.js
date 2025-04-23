import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({ name, username, password, confirmPassword, gender }) => {
        const success = handleInputError({ name, username, password, confirmPassword, gender });
        if (!success) return;
        
        setLoading(true);
        try {
            const res = await fetch("/api/v1/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, username, password, confirmPassword, gender })
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
function handleInputError({ name, username, password, confirmPassword, gender }) {
    if (!name || !username || !password || !confirmPassword || !gender) {
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

    return true;
}
