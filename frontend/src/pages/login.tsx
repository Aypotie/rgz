import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { loginUser } from '../api/securityman';

export const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const { refresh } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginUser(phoneNumber, password);

            await refresh();

            navigate('/');
        } catch (e: any) {
            toast.error(e.message);
        }
    };


    return (
        <div className="container my-5">
            <h1>Вход</h1>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Номер телефона" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default Login;
