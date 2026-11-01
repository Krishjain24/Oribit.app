def test_register_and_login_user(client):
    register_payload = {
        "email": "builder@orbit.dev",
        "password": "SecurePassword2026!",
        "full_name": "Test Builder",
        "builder_type": "fullstack"
    }
    res = client.post("/api/v1/auth/register", json=register_payload)
    assert res.status_code == 201
    data = res.json()
    assert data["email"] == "builder@orbit.dev"
    assert data["full_name"] == "Test Builder"

    # Login
    login_payload = {
        "email": "builder@orbit.dev",
        "password": "SecurePassword2026!"
    }
    res = client.post("/api/v1/auth/login", json=login_payload)
    assert res.status_code == 200
    tokens = res.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens

    # Access /auth/me
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    res = client.get("/api/v1/auth/me", headers=headers)
    assert res.status_code == 200
    user_data = res.json()
    assert user_data["email"] == "builder@orbit.dev"


def test_login_invalid_credentials(client):
    res = client.post("/api/v1/auth/login", json={
        "email": "nonexistent@orbit.dev",
        "password": "wrongpassword"
    })
    assert res.status_code == 401
