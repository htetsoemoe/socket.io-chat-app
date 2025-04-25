import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/v1/users");
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setConversations(data.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
        getConversations();
    }, []);

    return { conversations, loading };
}

export default useGetConversations;