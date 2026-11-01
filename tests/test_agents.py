def test_agent_demo_endpoint(client):
    res = client.post("/api/v1/agents/demo", json={
        "prompt": "Give the product page a calmer layout and make the gallery feel more immersive.",
        "builder_role": "frontend"
    })
    assert res.status_code == 200
    data = res.json()
    assert "steps" in data
    assert len(data["steps"]) >= 3
    assert "files_affected" in data
    assert data["status"] == "ready"
