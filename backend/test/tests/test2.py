import pytest
import requests

@pytest.fixture
def base_url():
    return "http://localhost:18080"

def test_login_success(base_url):
    """Тест успешной авторизации"""
    response = requests.post(
        f"{base_url}/api/securityman/login",
        json={"phone": "89130001234", "password": "password123"}
    )
    assert response.status_code == 200
    assert "Set-Cookie" in response.headers
    assert "token=" in response.headers["Set-Cookie"]

def test_login_invalid_credentials(base_url):
    """Тест авторизации с неверными данными"""
    # Вариант 1: Проверка неверного пароля для существующего пользователя
    response = requests.post(
        f"{base_url}/api/securityman/login",
        json={"phone": "89130001234", "password": "wrong"}
    )
    assert response.status_code == 401
    assert response.json()["error"] == "Неправильный пароль"

    # Вариант 2: Проверка несуществующего пользователя
    response = requests.post(
        f"{base_url}/api/securityman/login",
        json={"phone": "wrong", "password": "wrong"}
    )
    assert response.status_code == 404
    assert response.json()["error"] == "Пользователь не найден"

def test_login_missing_fields(base_url):
    """Тест авторизации с отсутствующими полями"""
    response = requests.post(
        f"{base_url}/api/securityman/login",
        json={"phone": "89130001234"}
    )
    assert response.status_code == 400
    assert response.json()["error"] == "Неправильный запрос"