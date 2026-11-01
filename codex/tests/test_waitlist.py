def test_join_waitlist_and_check_status(client):
    payload = {
        "email": "ada@lovelace.org",
        "full_name": "Ada Lovelace",
        "builder_role": "teams",
        "company": "Analytical Engine Inc"
    }
    res = client.post("/api/v1/waitlist", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["email"] == "ada@lovelace.org"
    assert data["status"] == "pending"
    assert data["queue_position"] >= 1

    # Duplicate submission returns existing record without throwing error
    res_dup = client.post("/api/v1/waitlist", json=payload)
    assert res_dup.status_code == 200
    dup_data = res_dup.json()
    assert dup_data["id"] == data["id"]

    # Status check
    res_status = client.get("/api/v1/waitlist/status?email=ada@lovelace.org")
    assert res_status.status_code == 200
    assert res_status.json()["email"] == "ada@lovelace.org"
