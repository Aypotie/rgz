import pytest
import requests

@pytest.fixture
def base_url():
    return "http://localhost:18080"

def test_get_nonexistent_incident(base_url):
    """Тест запроса несуществующего инцидента"""
    session = requests.Session()
    session.post(
        f"{base_url}/api/securityman/login",
        json={"phone": "89130001234", "password": "password123"}
    )
    
    response = session.get(f"{base_url}/api/incident/999999")
    assert response.status_code == 404

def test_create_incident_invalid_data(base_url):
    """Тест создания инцидента с невалидными данными"""
    session = requests.Session()
    session.post(
        f"{base_url}/api/securityman/login",
        json={"phone": "89130001234", "password": "password123"}
    )
    
    payload = {
        "description": "Missing required fields"
    }
    response = session.post(f"{base_url}/api/incident", json=payload)
    assert response.status_code == 400