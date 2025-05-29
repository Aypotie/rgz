import pytest
import requests

@pytest.fixture
def base_url():
    return "http://localhost:18080"

def test_get_status_list(base_url):
    """Тест получения списка статусов"""
    session = requests.Session()
    session.post(
        f"{base_url}/api/securityman/login",
        json={"phone": "89130001234", "password": "password123"}
    )
    
    response = session.get(f"{base_url}/api/status")
    assert response.status_code == 200
    statuses = response.json()["status"]
    assert len(statuses) > 0
    assert "id" in statuses[0]
    assert "name" in statuses[0]

def test_get_sector_list(base_url):
    """Тест получения списка секторов"""
    session = requests.Session()
    session.post(
        f"{base_url}/api/securityman/login",
        json={"phone": "89130001234", "password": "password123"}
    )
    
    response = session.get(f"{base_url}/api/sector")
    assert response.status_code == 200
    sectors = response.json()["sector"]
    assert len(sectors) > 0
    assert "id" in sectors[0]
    assert "name" in sectors[0]