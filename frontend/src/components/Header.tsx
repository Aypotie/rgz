export const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 fs-4">
            <a className="navbar-brand fs-4" href="#">Арена</a>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="#">Инциденты</a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Контакты</a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">Охрана: +7 999 123-45-67</a></li>
                            <li><a className="dropdown-item" href="#">Служба спасения: +7 999 765-43-21</a></li>
                        </ul>
                    </li>
                </ul>
                <button className="btn btn-outline-light" id="authButton">Выйти</button>
            </div>
        </nav>
    )
}