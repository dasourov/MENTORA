import sys
import os

# Add backend directory to sys.path so it can run as standalone script
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timezone
from app.core.database import engine, Base, SessionLocal
from app.core.security import get_password_hash
from app.models.user import User


def seed_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

    db = SessionLocal()
    try:
        users = [
            {
                "id": "user-student-demo",
                "auth_user_id": "auth-student-1",
                "full_name": "Rafiul Islam",
                "email": "student@example.com",
                "password_hash": get_password_hash("StudentPass123!"),
                "auth_provider": "email",
                "email_verified": True,
                "role": "student",
                "onboarding_status": "completed",
                "account_status": "active",
                "country": "Bangladesh",
                "intended_country": "Germany",
                "education_level": "Undergraduate",
                "institution": "BUET",
                "subject_field": "Computer Science & Engineering",
                "budget": "BDT 15-20 Lakhs",
                "services_needed": ["Profile Evaluation", "University Shortlisting", "Visa Interview Preparation"],
            },
            {
                "id": "user-advisor-demo",
                "auth_user_id": "auth-advisor-1",
                "full_name": "Tanvir Ahmed",
                "email": "advisor@example.com",
                "password_hash": get_password_hash("AdvisorPass123!"),
                "auth_provider": "email",
                "email_verified": True,
                "role": "advisor",
                "onboarding_status": "completed",
                "advisor_verification_status": "approved",
                "account_status": "active",
                "country": "Bangladesh",
                "headline": "Germany Master's Application Adviser — Public Universities & TU9",
                "bio": "Admitted to TU Munich & TU Darmstadt. Helped 50+ students secure tuition-free admission, blocked account setups and embassy interview dates.",
                "education_level": "Master's Degree",
                "institution": "TU Darmstadt",
                "subject_field": "Informatics",
            },
            {
                "id": "user-admin-demo",
                "auth_user_id": "auth-admin-1",
                "full_name": "Mentora Admin",
                "email": "admin@example.com",
                "password_hash": get_password_hash("AdminPass123!"),
                "auth_provider": "email",
                "email_verified": True,
                "role": "admin",
                "onboarding_status": "completed",
                "account_status": "active",
                "country": "Bangladesh",
            },
        ]

        for u in users:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                new_user = User(
                    **u,
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc),
                )
                db.add(new_user)
                print(f"Seeded user: {u['email']} ({u['role']})")
            else:
                print(f"User already exists: {u['email']}")

        db.commit()
        print("Database seeding completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_db()
