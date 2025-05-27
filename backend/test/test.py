import pytest
import requests

@pytest.fixture
def base_url():
    return "http://localhost:18080"

def test_post_request(base_url):
    payload = {
        "incident_time":"1111-11-11T05:39:20.000Z",
        "description":"saddasdsa",
        "status_id":1,
        "type_incident_id":1,
        "sector":"D1",
        "critical_level_id":2
    }
    session = requests.Session()
    
    response = session.post(f"{base_url}/api/securityman/login", json={"phone":"89130001234","password":"password123"})
    assert response.status_code == 200
    
    response = session.post(f"{base_url}/api/incident", json=payload)
    assert response.status_code == 201
    
    id = response.json()['id']
    assert id

    response = session.get(f"{base_url}/api/incident/{id}")
    assert response.status_code == 200
    data = response.json()
    assert data["description"] == payload["description"]
    assert data["sector"] == payload["sector"]
    assert data["status"] == "Открыто"

    response = session.delete(f"{base_url}/api/incident?id={id}")
    assert response.status_code == 200

    response = session.get(f"{base_url}/api/incident/{id}")
    assert response.status_code == 404
