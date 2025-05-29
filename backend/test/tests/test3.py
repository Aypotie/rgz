import pytest
import requests

@pytest.fixture
def base_url():
    return "http://localhost:18080"

def test_get_incident_list(base_url):
    """Тест получения списка инцидентов"""
    session = requests.Session()
    
    # Авторизация
    response = session.post(
        f"{base_url}/api/securityman/login",
        json={"phone": "89130001234", "password": "password123"}
    )
    assert response.status_code == 200
    
    # Получение списка
    response = session.get(f"{base_url}/api/incident")
    assert response.status_code == 200
    assert "incidents" in response.json()
    assert "total" in response.json()

def test_get_incident_details(base_url):
    """Тест получения деталей инцидента"""
    session = requests.Session()
    session.post(
        f"{base_url}/api/securityman/login",
        json={"phone": "89130001234", "password": "password123"}
    )
    
    # Создание тестового инцидента
    payload = {
        "incident_time": "2023-01-01T00:00:00.000Z",
        "description": "Test get details",
        "status_id": 1,
        "type_incident_id": 1,
        "sector": "D1",
        "critical_level_id": 2
    }
    create_response = session.post(f"{base_url}/api/incident", json=payload)
    incident_id = create_response.json()["id"]
    
    # Получение деталей
    response = session.get(f"{base_url}/api/incident/{incident_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == incident_id
    assert data["description"] == payload["description"]
    
    # Удаление тестового инцидента
    session.delete(f"{base_url}/api/incident?id={incident_id}")