import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 fs-5">
            <a className="navbar-brand fs-4" href="/">Система инцидентов</a>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/create_incident">Создать инцидент</a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            Контакты
                        </a>
                        <ul className="dropdown-menu">
                            <li><span className="dropdown-item">Охрана: +7 999 123-45-67</span></li>
                            <li><span className="dropdown-item">Служба спасения: +7 999 765-43-21</span></li>
                        </ul>
                    </li>
                </ul>
                <div className="d-flex align-items-center">
                    <span className="text-white me-3">{user != null ? user.surname + " " + user.name : ""}</span>
                    <button className="btn btn-outline-light btn-sm" onClick={() => {
                        logout();
                    }}>Выйти</button>
                </div>
            </div>
        </nav>
    );
};

export default Header;
