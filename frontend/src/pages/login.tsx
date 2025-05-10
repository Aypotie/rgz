import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = () => {


        // if (foundUser) {
        //     setUserRole(foundUser[0]);
        //     localStorage.setItem('userRole', foundUser[0]);
        //     navigate('/');
        // } else {
        //     setError('Неверные данные!');
        // }
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