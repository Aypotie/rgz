import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { refresh } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:18080/api/securityman/login", {
                phone: phoneNumber,
                password: password
            }, { withCredentials: true });

            console.log('Login successful:', response.status);

            await refresh();

            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError('Неверные данные!');
        }
    };


    return (
        <div className="container my-5">
            <h1>Вход</h1>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Номер телефона" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default Login;
