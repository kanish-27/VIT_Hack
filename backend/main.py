from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from schemas.dispute import Dispute, VerificationResult, EvidenceCheck
from typing import List
import hashlib
import json
from datetime import datetime, timezone

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GigShield API",
    description="API for the GigShield platform",
    version="0.1.0",
)

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Data
MOCK_DISPUTES = {
    "GS-2026-48291": {
        "id": "GS-2026-48291",
        "worker_name": "Rahul Kumar",
        "platform": "Delivery Partner",
        "delivery_id": "DEL-48291",
        "date": "2026-09-03",
        "penalty_type": "Incentive deduction",
        "customer_rating": 1,
        "complaint": "Order not received",
        "amount_at_risk": 1800,
        "status": "Under Review",
        "incentive_shield_status": "Protected",
        "pickup_time": "8:02 PM",
        "delivery_time": "8:42 PM",
        "pickup_location": "Chennai Central",
        "delivery_location": "Anna Nagar",
        "completion_status": "Completed",
        "verification": None
    }
}

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "GigShield API is running."}

@app.get("/api/db-test")
def test_db(db: Session = Depends(get_db)):
    return {"status": "ok", "message": "Database connection successful."}

@app.get("/api/disputes", response_model=List[Dispute])
def get_disputes():
    return list(MOCK_DISPUTES.values())

@app.post("/api/disputes", response_model=Dispute)
def create_dispute(dispute: Dispute):
    if dispute.id in MOCK_DISPUTES:
        raise HTTPException(status_code=400, detail="Dispute already exists")
    MOCK_DISPUTES[dispute.id] = dispute.model_dump()
    return dispute

@app.get("/api/disputes/{dispute_id}", response_model=Dispute)
def get_dispute(dispute_id: str):
    dispute = MOCK_DISPUTES.get(dispute_id)
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    return dispute

@app.post("/api/disputes/{dispute_id}/verify", response_model=VerificationResult)
def verify_dispute(dispute_id: str):
    dispute = MOCK_DISPUTES.get(dispute_id)
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    
    # Deterministic verification logic
    # In a real system, these would be checked against actual databases/GPS logs.
    # For the demo, we assume all conditions are met perfectly.
    gps_match = True
    timestamp_valid = True
    completion_verified = True
    route_consistent = True
    suspicious_rating = True

    score = 0
    checks = []

    if gps_match:
        score += 30
        checks.append(EvidenceCheck(id="gps", name="GPS Location Match", status="VERIFIED", explanation="Worker GPS data indicates the delivery was completed within the expected delivery radius.", score=30))
    if timestamp_valid:
        score += 20
        checks.append(EvidenceCheck(id="time", name="Completion Timestamp", status="VERIFIED", explanation="Delivery time recorded within the platform's active delivery window.", score=20))
    if completion_verified:
        score += 25
        checks.append(EvidenceCheck(id="completion", name="Delivery Completion", status="VERIFIED", explanation="Delivery photo and app status both marked as completed.", score=25))
    if route_consistent:
        score += 15
        checks.append(EvidenceCheck(id="route", name="Route Consistency", status="VERIFIED", explanation="Worker followed the optimal route to the delivery location.", score=15))
    if suspicious_rating:
        score += 10
        checks.append(EvidenceCheck(id="rating", name="Customer Rating Pattern", status="FLAGGED FOR REVIEW", explanation="Customer has a recent pattern of claiming non-delivery.", score=10))

    if score >= 90:
        decision = "Likely Unfair Penalty"
        explanation = "Available delivery telemetry strongly supports successful completion. GPS location, completion timestamp, route consistency, and delivery status are all verified. The customer complaint conflicts with the available delivery evidence."
        incentive_protected = True
        protected_amount = int(dispute.get("amount_at_risk", 1800))  # type: ignore
    else:
        decision = "Requires Manual Review"
        explanation = "Evidence is inconclusive. The dispute will be escalated for manual review."
        incentive_protected = False
        protected_amount = 0

    timestamp = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    # Canonical representation for hashing
    canonical_data = {
        "dispute_id": dispute_id,
        "delivery_id": dispute.get("delivery_id"),
        "worker_name": dispute.get("worker_name"),
        "penalty_type": dispute.get("penalty_type"),
        "complaint": dispute.get("complaint"),
        "evidence_checks": [{"id": c.id, "status": c.status} for c in checks],
        "confidence_score": score,
        "decision": decision,
        "incentive_protected": incentive_protected,
        "protected_amount": protected_amount,
        "timestamp": timestamp
    }
    canonical_str = json.dumps(canonical_data, sort_keys=True)
    verification_hash = hashlib.sha256(canonical_str.encode("utf-8")).hexdigest()

    verification_result = VerificationResult(
        confidence_score=score,
        decision=decision,
        explanation=explanation,
        evidence_checks=checks,
        incentive_protected=incentive_protected,
        protected_amount=protected_amount,
        verification_hash=verification_hash,
        timestamp=timestamp
    )
    
    # Update mock database state
    dispute["verification"] = verification_result.model_dump()
    if score >= 90:
        dispute["status"] = "Likely Unfair"
        dispute["incentive_shield_status"] = "Protected During Review"

    return verification_result

@app.post("/api/disputes/{dispute_id}/resolve", response_model=Dispute)
def resolve_dispute(dispute_id: str):
    dispute = MOCK_DISPUTES.get(dispute_id)
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    
    if dispute["status"] != "Likely Unfair":
        raise HTTPException(status_code=400, detail="Cannot resolve dispute in current state")
        
    dispute["status"] = "Resolved"
    dispute["incentive_shield_status"] = "Incentive Restored"
    
    return dispute
