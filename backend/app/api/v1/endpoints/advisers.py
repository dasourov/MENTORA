from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, cast, String

from app.core.database import get_db
from app.models.advisor import Advisor
from app.schemas.advisor import AdvisorRead, AdvisorListResponse

router = APIRouter()


@router.get("", response_model=AdvisorListResponse)
def list_advisers(
    q: Optional[str] = Query(None, description="Search term across name, headline, location, bio, expertise"),
    sort: Optional[str] = Query("match", description="Sort by: match, rating, price_asc, price_desc, experience, reviews"),
    max_price: Optional[int] = Query(None, description="Filter by maximum price in BDT"),
    min_rating: Optional[float] = Query(None, description="Filter by minimum rating (e.g. 4.5, 4.8, 4.9)"),
    verified_only: Optional[bool] = Query(False, description="Filter only verified advisers"),
    countries: Optional[str] = Query(None, description="Comma-separated destination countries"),
    levels: Optional[str] = Query(None, description="Comma-separated study levels"),
    fields: Optional[str] = Query(None, description="Comma-separated fields of study"),
    services: Optional[str] = Query(None, description="Comma-separated services"),
    languages: Optional[str] = Query(None, description="Comma-separated languages"),
    availability: Optional[str] = Query(None, description="Comma-separated availability"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Advisor)

    # 1. Verified filter
    if verified_only:
        query = query.filter(Advisor.verified == True)

    # 2. Price filter
    if max_price is not None:
        query = query.filter(Advisor.price <= max_price)

    # 3. Rating filter
    if min_rating is not None and min_rating > 0:
        query = query.filter(Advisor.rating >= min_rating)

    # 4. Search query (multi-column)
    if q and q.strip():
        term = f"%{q.strip().lower()}%"
        query = query.filter(
            or_(
                Advisor.name.ilike(term),
                Advisor.headline.ilike(term),
                Advisor.location.ilike(term),
                Advisor.specialisation.ilike(term),
                Advisor.bio.ilike(term),
                cast(Advisor.countries, String).ilike(term),
                cast(Advisor.expertise, String).ilike(term),
                cast(Advisor.languages, String).ilike(term),
            )
        )

    # 5. Destination country filter
    if countries and countries.strip():
        country_list = [c.strip().lower() for c in countries.split(",") if c.strip()]
        if country_list:
            country_conditions = [
                cast(Advisor.countries, String).ilike(f"%{c}%")
                for c in country_list
            ]
            query = query.filter(or_(*country_conditions))

    # 6. Study level filter
    if levels and levels.strip():
        level_list = [l.strip().lower() for l in levels.split(",") if l.strip()]
        if level_list:
            level_conditions = [
                cast(Advisor.levels, String).ilike(f"%{lvl}%")
                for lvl in level_list
            ]
            query = query.filter(or_(*level_conditions))

    # 7. Field of study filter
    if fields and fields.strip():
        field_list = [f.strip().lower() for f in fields.split(",") if f.strip()]
        if field_list:
            field_conditions = []
            for f in field_list:
                field_conditions.append(Advisor.specialisation.ilike(f"%{f}%"))
                field_conditions.append(cast(Advisor.expertise, String).ilike(f"%{f}%"))
                field_conditions.append(Advisor.headline.ilike(f"%{f}%"))
            query = query.filter(or_(*field_conditions))

    # 8. Service filter
    if services and services.strip():
        service_list = [s.strip().lower() for s in services.split(",") if s.strip()]
        if service_list:
            service_conditions = [
                cast(Advisor.services, String).ilike(f"%{s}%")
                for s in service_list
            ]
            query = query.filter(or_(*service_conditions))

    # 9. Language filter
    if languages and languages.strip():
        lang_list = [l.strip().lower() for l in languages.split(",") if l.strip()]
        if lang_list:
            lang_conditions = [
                cast(Advisor.languages, String).ilike(f"%{lang}%")
                for lang in lang_list
            ]
            query = query.filter(or_(*lang_conditions))

    # 10. Availability filter
    if availability and availability.strip():
        avail_list = [a.strip().lower() for a in availability.split(",") if a.strip()]
        avail_conditions = []
        for a in avail_list:
            if "today" in a:
                avail_conditions.append(Advisor.next_available.ilike("%today%"))
            elif "weekend" in a:
                avail_conditions.append(
                    or_(
                        Advisor.next_available.ilike("%sunday%"),
                        Advisor.next_available.ilike("%saturday%"),
                    )
                )
            elif "week" in a:
                # e.g. "this week" matches tomorrow, weekdays or any upcoming day
                avail_conditions.append(Advisor.next_available.isnot(None))
        if avail_conditions:
            query = query.filter(or_(*avail_conditions))

    # 11. Sorting
    if sort in ("price_asc", "price"):
        query = query.order_by(Advisor.price.asc(), Advisor.rating.desc())
    elif sort == "price_desc":
        query = query.order_by(Advisor.price.desc(), Advisor.rating.desc())
    elif sort == "rating":
        query = query.order_by(Advisor.rating.desc(), Advisor.reviews.desc())
    elif sort == "experience":
        query = query.order_by(Advisor.years.desc(), Advisor.rating.desc())
    elif sort == "reviews":
        query = query.order_by(Advisor.reviews.desc(), Advisor.rating.desc())
    else:  # default to match
        query = query.order_by(Advisor.match.desc(), Advisor.rating.desc())

    total = query.count()
    items = query.offset(skip).limit(limit).all()

    return AdvisorListResponse(
        total=total,
        items=[
            AdvisorRead(
                id=item.id,
                name=item.name,
                headline=item.headline,
                location=item.location,
                countries=item.countries or [],
                specialisation=item.specialisation,
                expertise=item.expertise or [],
                levels=item.levels or [],
                languages=item.languages or [],
                years=item.years,
                rating=item.rating,
                reviews=item.reviews,
                students=item.students,
                price=item.price,
                match=item.match,
                match_reason=item.match_reason or "",
                next_available=item.next_available or "",
                response_time=item.response_time or "",
                bio=item.bio or "",
                approach=item.approach or "",
                commission=item.commission or "",
                verified=item.verified,
                services=item.services or [],
                photo=item.photo or "",
                created_at=item.created_at,
                updated_at=item.updated_at,
            )
            for item in items
        ],
    )


@router.get("/{id}", response_model=AdvisorRead)
def get_adviser_by_id(id: str, db: Session = Depends(get_db)):
    adviser = db.query(Advisor).filter(Advisor.id == id).first()
    if not adviser:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Advisor '{id}' not found",
        )
    return AdvisorRead(
        id=adviser.id,
        name=adviser.name,
        headline=adviser.headline,
        location=adviser.location,
        countries=adviser.countries or [],
        specialisation=adviser.specialisation,
        expertise=adviser.expertise or [],
        levels=adviser.levels or [],
        languages=adviser.languages or [],
        years=adviser.years,
        rating=adviser.rating,
        reviews=adviser.reviews,
        students=adviser.students,
        price=adviser.price,
        match=adviser.match,
        match_reason=adviser.match_reason or "",
        next_available=adviser.next_available or "",
        response_time=adviser.response_time or "",
        bio=adviser.bio or "",
        approach=adviser.approach or "",
        commission=adviser.commission or "",
        verified=adviser.verified,
        services=adviser.services or [],
        photo=adviser.photo or "",
        created_at=adviser.created_at,
        updated_at=adviser.updated_at,
    )
