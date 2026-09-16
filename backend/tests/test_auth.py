"""Automated test suite for FastAPI backend authentication infrastructure."""
import os
import sys
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["database"] == "healthy"
    print("PASS: Health check endpoint")


def test_check_email():
    # Existing email
    res1 = client.post("/api/v1/auth/check-email", json={"email": "student@example.com"})
    assert res1.status_code == 200
    assert res1.json()["exists"] is True

    # Non-existing email
    res2 = client.post("/api/v1/auth/check-email", json={"email": "unknown_user@test.com"})
    assert res2.status_code == 200
    assert res2.json()["exists"] is False
    print("PASS: Check email endpoint")


def test_login_and_me():
    # Login with seeded student
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "student@example.com", "password": "StudentPass123!"},
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["success"] is True
    assert "access_token" in data
    assert data["user"]["email"] == "student@example.com"
    assert data["user"]["role"] == "student"
    token = data["access_token"]
    print("PASS: Login with seeded credentials")

    # Access protected /me endpoint
    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200, me_res.text
    me_data = me_res.json()
    assert me_data["email"] == "student@example.com"
    assert me_data["full_name"] == "Rafiul Islam"
    print("PASS: Protected /me endpoint with Bearer token")


def test_invalid_login_rejections():
    # 1. Non-existent email should return 401 Unauthorized
    res1 = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent_user_9999@example.com", "password": "AnyPassword123!"},
    )
    assert res1.status_code == 401, res1.text
    print("PASS: Rejection of non-existent account with 401")

    # 2. Incorrect password should return 401 Unauthorized
    res2 = client.post(
        "/api/v1/auth/login",
        json={"email": "student@example.com", "password": "WrongPassword123!"},
    )
    assert res2.status_code == 401, res2.text
    print("PASS: Rejection of incorrect password with 401")


def test_register_and_onboarding():
    import uuid

    test_email = f"test_{uuid.uuid4().hex[:8]}@mentora.com"
    reg_res = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Test Student",
            "email": test_email,
            "password": "SecurePassword123!",
            "role": "student",
        },
    )
    assert reg_res.status_code == 201, reg_res.text
    reg_data = reg_res.json()
    token = reg_data["access_token"]
    assert reg_data["user"]["email"] == test_email
    assert reg_data["user"]["role"] == "student"
    print("PASS: User registration")

    # Duplicate registration should return 400 Bad Request
    dup_res = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Test Student Duplicate",
            "email": test_email,
            "password": "SecurePassword123!",
            "role": "student",
        },
    )
    assert dup_res.status_code == 400, dup_res.text
    print("PASS: Duplicate registration rejection with 400")

    # Update onboarding step
    onboarding_res = client.put(
        "/api/v1/auth/onboarding",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "step_name": "education",
            "is_last_step": False,
            "step_data": {
                "institution": "Dhaka University",
                "education_level": "Undergraduate",
                "intended_country": "Canada",
            },
        },
    )
    assert onboarding_res.status_code == 200, onboarding_res.text
    user_updated = onboarding_res.json()["user"]
    assert user_updated["institution"] == "Dhaka University"
    assert user_updated["intended_country"] == "Canada"
    print("PASS: Onboarding step progression")


def run_all():
    print("\n--- Running FastAPI Backend Tests ---")
    test_health()
    test_check_email()
    test_login_and_me()
    test_invalid_login_rejections()
    test_register_and_onboarding()
    print("\nALL BACKEND TESTS PASSED SUCCESSFULLY! ---\n")


if __name__ == "__main__":
    run_all()
