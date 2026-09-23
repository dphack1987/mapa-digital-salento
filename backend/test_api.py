from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_online():
    r = client.get("/")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "online"


def test_health_healthy():
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "healthy"
    assert body["backend"] == "python"
    assert isinstance(body["pautantes_loaded"], int)


def test_chat_returns_pautantes_for_food():
    r = client.post("/api/v1/chat/message", json={"message": "quiero comer trucha"})
    assert r.status_code == 200
    body = r.json()
    assert body["intent"] == "food"
    assert "response" in body
    assert "pautantes" in body
    assert body["has_pautantes"] == (len(body["pautantes"]) > 0)


def test_chat_general_intent():
    r = client.post("/api/v1/chat/message", json={"message": "hola"})
    assert r.status_code == 200
    body = r.json()
    assert body["intent"] == "general"
    assert body["confidence"] in (0.6, 0.8)


def test_whatsapp_direct_missing_id():
    r = client.get("/api/v1/pautantes/whatsapp-direct", params={"pautante_id": -99999})
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is False
    assert "error" in body


def test_nearby_requires_lat_lng():
    r = client.get("/api/v1/pautantes/nearby")
    assert r.status_code == 422


def test_nearby_with_town_center():
    # Plaza de Bolívar Salento approx
    r = client.get(
        "/api/v1/pautantes/nearby",
        params={"lat": 4.6370, "lng": -75.5730, "category": "all", "radius": 5.0},
    )
    assert r.status_code == 200
    body = r.json()
    assert "nearby_pautantes" in body
    assert body["radius_km"] == 5.0
    for p in body["nearby_pautantes"]:
        assert "distance_km" in p
        assert p["distance_km"] <= 5.0


def test_tourist_trap_filter_by_type():
    r = client.post(
        "/api/v1/pautantes/tourist-trap-filter",
        params={"category": "restaurantes"},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["normalized"] == "food"
    assert "authentic_places" in body
    assert "tourist_traps_filtered" in body


def test_availability_missing_pautante():
    r = client.post(
        "/api/v1/pautantes/availability",
        params={"pautante_id": -1},
    )
    assert r.status_code == 200
    assert r.json()["success"] is False


def test_quality_verification_missing_pautante():
    r = client.post(
        "/api/v1/pautantes/quality-verification",
        params={"pautante_id": -1},
    )
    assert r.status_code == 200
    assert r.json()["success"] is False
