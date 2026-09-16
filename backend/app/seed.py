import sys
import os

# Add backend directory to sys.path so it can run as standalone script
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timezone
from app.core.database import engine, Base, SessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from app.models.advisor import Advisor


def base_services(prefix: str):
    return [
        {
            "id": f"{prefix}-profile",
            "name": "30-minute profile evaluation",
            "description": "A focused review of your academic record, budget and destination fit.",
            "duration": "30 min",
            "price": 500,
            "includes": ["Academic profile review", "Realistic destination options", "Written summary"],
        },
        {
            "id": f"{prefix}-shortlist",
            "name": "University shortlist review",
            "description": "Build a balanced list of ambitious, target and safe universities.",
            "duration": "60 min",
            "price": 1500,
            "includes": ["8–12 university shortlist", "Deadline map", "Tuition and cost comparison"],
        },
        {
            "id": f"{prefix}-sop",
            "name": "SOP feedback session",
            "description": "Line-by-line feedback on your statement of purpose with a rewrite plan.",
            "duration": "45 min",
            "price": 1000,
            "includes": ["Structure critique", "Annotated document", "One follow-up revision"],
        },
        {
            "id": f"{prefix}-strategy",
            "name": "Application strategy session",
            "description": "A step-by-step application plan for your chosen intake.",
            "duration": "60 min",
            "price": 2500,
            "includes": ["Intake timeline", "Document checklist", "Portal walkthrough"],
        },
        {
            "id": f"{prefix}-scholarship",
            "name": "Scholarship consultation",
            "description": "Identify funding you are genuinely competitive for and how to apply.",
            "duration": "45 min",
            "price": 1500,
            "includes": ["Scholarship long list", "Eligibility screening", "Essay pointers"],
        },
        {
            "id": f"{prefix}-visa",
            "name": "Visa interview preparation",
            "description": "Mock interview and financial documentation review.",
            "duration": "45 min",
            "price": 800,
            "includes": ["Mock interview", "Document audit", "Answer framework"],
        },
    ]


ADVISORS_DATA = [
    {
        "id": "tanvir-ahmed",
        "name": "Tanvir Ahmed",
        "headline": "Germany Master's application adviser — public universities & TU9",
        "location": "Dhaka, Bangladesh · previously Munich",
        "countries": ["Germany", "Austria", "Netherlands"],
        "specialisation": "Germany Master's applications",
        "expertise": ["Uni-Assist", "APS Bangladesh", "Blocked account", "CS & Engineering", "Computer Science"],
        "levels": ["Master's", "MBA"],
        "languages": ["Bangla", "English", "German (B2)"],
        "years": 7,
        "rating": 4.9,
        "reviews": 186,
        "students": 412,
        "price": 800,
        "match": 92,
        "match_reason": "Strong experience with German Master's applications, Computer Science students, and scholarship guidance.",
        "next_available": "Tomorrow, 7:00 PM",
        "response_time": "Under 2 hours",
        "bio": "I completed my MSc in Informatics at TU München as a self-funded student from Dhaka, and I have guided Bangladeshi applicants through Uni-Assist, APS and blocked accounts since 2019. I focus on public universities with no tuition fees, so families spend on living costs rather than agency margins.",
        "approach": "I start with a hard look at your CGPA, backlogs and budget, then build a shortlist you can actually convert. No false promises — if a profile is not ready, I will tell you what to fix first.",
        "commission": "Receives no commission from any university or agency. Student fees only.",
        "verified": True,
        "services": base_services("tanvir"),
        "photo": "/images/mentors/tanvir.png",
    },
    {
        "id": "farhana-rahman",
        "name": "Farhana Rahman",
        "headline": "UK scholarship adviser — Chevening, Commonwealth & university awards",
        "location": "Sylhet, Bangladesh",
        "countries": ["United Kingdom", "Ireland"],
        "specialisation": "UK scholarships & funded Master's",
        "expertise": ["Chevening", "Commonwealth", "Personal statements", "Social sciences", "Public Health"],
        "levels": ["Master's", "PhD"],
        "languages": ["Bangla", "English"],
        "years": 9,
        "rating": 4.8,
        "reviews": 231,
        "students": 530,
        "price": 1000,
        "match": 88,
        "match_reason": "Deep track record with UK funded Master's applications and leadership-focused scholarship essays.",
        "next_available": "Today, 9:30 PM",
        "response_time": "Under 4 hours",
        "bio": "Chevening scholar (University of Edinburgh, 2016). I have reviewed more than 900 scholarship essays and mentored 40+ Bangladeshi Chevening and Commonwealth awardees.",
        "approach": "Scholarship writing is evidence, not adjectives. We rebuild your essays around measurable impact and a credible return-to-Bangladesh plan.",
        "commission": "Receives no commission. Discloses all partner relationships in writing.",
        "verified": True,
        "services": base_services("farhana"),
        "photo": "/images/mentors/farhana.png",
    },
    {
        "id": "sabbir-hossain",
        "name": "Sabbir Hossain",
        "headline": "Canadian college & university adviser — SDS, PGWP pathways",
        "location": "Toronto, Canada",
        "countries": ["Canada"],
        "specialisation": "Canada college & undergraduate admissions",
        "expertise": ["SDS route", "GIC & proof of funds", "PGWP planning", "Business programmes", "Business"],
        "levels": ["Bachelor's", "Diploma", "Master's"],
        "languages": ["Bangla", "English"],
        "years": 6,
        "rating": 4.7,
        "reviews": 148,
        "students": 322,
        "price": 1500,
        "match": 84,
        "match_reason": "Best fit for students targeting affordable Canadian colleges with a clear post-graduation work permit path.",
        "next_available": "Sunday, 11:00 AM",
        "response_time": "Same day",
        "bio": "I moved to Ontario as a diploma student in 2017 and now advise families on realistic college and university choices, funding proof and study-permit documentation.",
        "approach": "Canada is a documentation game. We get your funds, intent and programme choice aligned before a single application fee is paid.",
        "commission": "Declares commission from two partner colleges; always shown before booking.",
        "verified": True,
        "services": base_services("sabbir"),
        "photo": "/images/mentors/sabbir.png",
    },
    {
        "id": "nusrat-jahan",
        "name": "Nusrat Jahan",
        "headline": "Australian student visa adviser — GTE statements & subclass 500",
        "location": "Melbourne, Australia",
        "countries": ["Australia", "New Zealand"],
        "specialisation": "Australia student visa & GTE",
        "expertise": ["Subclass 500", "GTE statement", "Health & nursing", "Regional universities", "Public Health"],
        "levels": ["Bachelor's", "Master's"],
        "languages": ["Bangla", "English"],
        "years": 5,
        "rating": 4.9,
        "reviews": 119,
        "students": 240,
        "price": 1000,
        "match": 81,
        "match_reason": "Specialist in subclass 500 visa documentation and GTE statements for Bangladeshi applicants.",
        "next_available": "Monday, 8:00 PM",
        "response_time": "Under 6 hours",
        "bio": "Former university international admissions officer in Victoria. I now help students write GTE statements that survive scrutiny and avoid avoidable refusals.",
        "approach": "Honest GTE writing. We build a story that is true, consistent and verifiable.",
        "commission": "Receives no commission from universities.",
        "verified": True,
        "services": base_services("nusrat"),
        "photo": "/images/mentors/nusrat.png",
    },
    {
        "id": "imran-kabir",
        "name": "Imran Kabir",
        "headline": "Erasmus Mundus & European scholarship adviser",
        "location": "Dhaka, Bangladesh",
        "countries": ["Sweden", "Italy", "France", "Germany"],
        "specialisation": "Erasmus Mundus joint Master's",
        "expertise": ["Erasmus Mundus", "Motivation letters", "Consortium choice", "Environment & policy", "Engineering"],
        "levels": ["Master's"],
        "languages": ["Bangla", "English", "French (A2)"],
        "years": 8,
        "rating": 4.8,
        "reviews": 164,
        "students": 361,
        "price": 1500,
        "match": 79,
        "match_reason": "Strong fit for fully funded European joint Master's programmes and motivation letters.",
        "next_available": "Tomorrow, 10:00 PM",
        "response_time": "Under 12 hours",
        "bio": "Erasmus Mundus alumnus (Sweden & Italy). I help applicants pick consortia where they are competitive instead of applying blindly to the most famous ones.",
        "approach": "Programme selection first, writing second. Fit decides funding.",
        "commission": "No commission relationships.",
        "verified": True,
        "services": base_services("imran"),
        "photo": "/images/mentors/imran.png",
    },
    {
        "id": "ayesha-siddika",
        "name": "Ayesha Siddika",
        "headline": "Computer Science admission adviser — US & Canada research tracks",
        "location": "Dhaka, Bangladesh",
        "countries": ["United States", "Canada"],
        "specialisation": "Computer Science admissions",
        "expertise": ["Research SOP", "Professor outreach", "Funded MS/PhD", "GRE planning", "Computer Science", "Engineering"],
        "levels": ["Master's", "PhD"],
        "languages": ["Bangla", "English"],
        "years": 6,
        "rating": 4.9,
        "reviews": 97,
        "students": 188,
        "price": 2500,
        "match": 76,
        "match_reason": "Specialises in funded CS Master's and PhD applications with professor outreach.",
        "next_available": "Friday, 9:00 PM",
        "response_time": "Under 8 hours",
        "bio": "CS PhD candidate advising BUET, DU and NSU students on funded research admissions in North America.",
        "approach": "We target labs, not rankings. Emails to professors decide funding more than test scores.",
        "commission": "No commission relationships.",
        "verified": True,
        "services": base_services("ayesha"),
        "photo": "/images/mentors/ayesha.png",
    },
]


def seed_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

    db = SessionLocal()
    try:
        # 1. Seed Users
        users = [
            {
                "id": "user-student-demo",
                "auth_user_id": "auth-student-1",
                "username": "rafiul",
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
                "username": "tanvir",
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
                "username": "admin",
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
                for k, v in u.items():
                    setattr(existing, k, v)
                existing.updated_at = datetime.now(timezone.utc)
                print(f"Updated user: {u['email']}")

        # 2. Seed Advisors
        for adv_data in ADVISORS_DATA:
            existing_adv = db.query(Advisor).filter(Advisor.id == adv_data["id"]).first()
            if not existing_adv:
                advisor = Advisor(
                    **adv_data,
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc),
                )
                db.add(advisor)
                print(f"Seeded advisor: {adv_data['name']} ({adv_data['id']})")
            else:
                # Update existing advisor fields
                for key, val in adv_data.items():
                    setattr(existing_adv, key, val)
                existing_adv.updated_at = datetime.now(timezone.utc)
                print(f"Updated advisor: {adv_data['name']} ({adv_data['id']})")

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
