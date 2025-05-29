import pytest
import requests

@pytest.fixture
def base_url():
    return "http://localhost:18080"

def test_incident_life(base_url):
    session = requests.Session()
    
    # авторизация
    response = session.post(
        f"{base_url}/api/securityman/login",
        json={"phone": "89130001234", "password": "password123"}
    )
    assert response.status_code == 200
    
    # создание инцидента
    payload = {
        "incident_time": "2023-01-01T00:00:00.000Z",
        "description": "Full lifecycle test",
        "status_id": 1,
        "type_incident_id": 1,
        "sector": "D1",
        "critical_level_id": 2
    }
    create_response = session.post(f"{base_url}/api/incident", json=payload)
    assert create_response.status_code == 201
    incident_id = create_response.json()["id"]
    
    # получение инцидента
    get_response = session.get(f"{base_url}/api/incident/{incident_id}")
    assert get_response.status_code == 200
    assert get_response.json()["description"] == payload["description"]
    
    # обновление инцидента
    update_payload = {
        "incident_time": "2023-01-01T00:00:00.000Z",
        "description": "Updated description",
        "status_id": 2,
        "type_incident_id": 1,
        "critical_level_id": 3
    }
    update_response = session.put(
        f"{base_url}/api/incident/{incident_id}",
        json=update_payload
    )
    assert update_response.status_code == 200
    
    # проверка обновления
    updated_response = session.get(f"{base_url}/api/incident/{incident_id}")
    assert updated_response.json()["description"] == update_payload["description"]
    assert updated_response.json()["status"] == "Закрыто"  # Предполагая, что статус с ID=2 имеет это название
    
    #удаление
    delete_response = session.delete(f"{base_url}/api/incident?id={incident_id}")
    assert delete_response.status_code == 200
    
    # проверка удаления
    get_deleted_response = session.get(f"{base_url}/api/incident/{incident_id}")
    assert get_deleted_response.status_code == 404