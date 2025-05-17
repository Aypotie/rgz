import { createContext, useState, useEffect, useContext } from 'react';
import type { JSX } from 'react';
import type { UserInfo } from '../models/models';
import { getUser, logoutUser } from '../api/securityman';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
    user: UserInfo | null;
    loading: boolean;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    refresh: async () => { }
});

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const auth = async () => {
        setLoading(true);
        try {
            const user = await getUser();
            setUser(user);
        } catch (err) {
            setUser(null);
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        auth();
    }, []);

    const logoutFunc = async () => {
        setUser(null);
        await logoutUser();
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user: user, loading: loading, logout: logoutFunc, refresh: auth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
