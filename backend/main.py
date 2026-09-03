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
    },
    "GS-2026-48280": {
        "id": "GS-2026-48280",
        "worker_name": "Rahul Kumar",
        "platform": "Delivery Partner",
        "delivery_id": "DEL-48280",
        "date": "2026-08-28",
        "penalty_type": "Late Delivery Penalty",
        "customer_rating": 3,
        "complaint": "Late arrival due to traffic",
        "amount_at_risk": 500,
        "status": "Resolved",
        "incentive_shield_status": "Incentive Restored",
        "pickup_time": "1:15 PM",
        "delivery_time": "2:30 PM",
        "pickup_location": "T Nagar",
        "delivery_location": "Mylapore",
        "completion_status": "Completed",
        "verification": {
            "confidence_score": 95,
            "decision": "Likely Unfair Penalty",
            "explanation": "Traffic API confirms heavy congestion on the route.",
            "evidence_checks": [
                {"id": "gps", "name": "GPS Location Match", "status": "VERIFIED", "explanation": "Route followed", "score": 30},
                {"id": "traffic", "name": "Traffic Conditions", "status": "VERIFIED", "explanation": "Heavy congestion confirmed", "score": 65}
            ],
            "incentive_protected": True,
            "protected_amount": 500,
            "verification_hash": "abc123hash",
            "timestamp": "2026-08-28T14:40:00Z"
        }
    },
    "GS-2026-48275": {
        "id": "GS-2026-48275",
        "worker_name": "Rahul Kumar",
        "platform": "Delivery Partner",
        "delivery_id": "DEL-48275",
        "date": "2026-08-20",
        "penalty_type": "Item Damage",
        "customer_rating": 2,
        "complaint": "Package was damaged",
        "amount_at_risk": 1200,
        "status": "Under Review",
        "incentive_shield_status": "Protected During Review",
        "pickup_time": "10:00 AM",
        "delivery_time": "10:45 AM",
        "pickup_location": "Guindy",
        "delivery_location": "Velachery",
        "completion_status": "Completed",
        "verification": None
    },
    "GS-2026-48250": {
        "id": "GS-2026-48250",
        "worker_name": "Rahul Kumar",
        "platform": "Delivery Partner",
        "delivery_id": "DEL-48250",
        "date": "2026-08-10",
        "penalty_type": "Non-delivery",
        "customer_rating": 1,
        "complaint": "Did not receive order",
        "amount_at_risk": 2000,
        "status": "Rejected",
        "incentive_shield_status": "Not Protected",
        "pickup_time": "7:00 PM",
        "delivery_time": "7:30 PM",
        "pickup_location": "Adyar",
        "delivery_location": "Besant Nagar",
        "completion_status": "Completed",
        "verification": {
            "confidence_score": 40,
            "decision": "Penalty Upheld",
            "explanation": "GPS data does not match delivery location.",
            "evidence_checks": [
                {"id": "gps", "name": "GPS Location Match", "status": "FAILED", "explanation": "GPS was 5km away from delivery location", "score": 0}
            ],
            "incentive_protected": False,
            "protected_amount": 0,
            "verification_hash": "xyz789hash",
            "timestamp": "2026-08-11T10:00:00Z"
        }
    }
}
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "GigShield API is running."}

@app.get("/api/worker/dashboard")
def get_dashboard():
    disputes = list(MOCK_DISPUTES.values())
    active_disputes = sum(1 for d in disputes if d.get("status") not in ["Resolved", "Rejected"])
    resolved_disputes = sum(1 for d in disputes if d.get("status") == "Resolved")
    
    amount_recovered = sum(d.get("amount_at_risk", 0) for d in disputes if d.get("status") == "Resolved")
    amount_at_risk = sum(d.get("amount_at_risk", 0) for d in disputes if d.get("status") == "Under Review")
    
    protected_disruptions = sum(1 for d in disputes if d.get("incentive_shield_status") in ["Protected", "Protected During Review", "Incentive Restored"])
    total_protected = sum(d.get("amount_at_risk", 0) for d in disputes if d.get("incentive_shield_status") in ["Protected", "Protected During Review", "Incentive Restored"])
    
    total_disputes = len(disputes)
    legit_ratio = resolved_disputes / total_disputes if total_disputes > 0 else 1
    protection_score = min(100, int(legit_ratio * 100) + 10) 

    if protection_score >= 80:
        score_explanation = "Your score is excellent because your recent deliveries show strong verification signals and successful dispute resolutions."
    elif protection_score >= 50:
        score_explanation = "Your score is good, reflecting solid verification history, though some recent claims may still require review."
    else:
        score_explanation = "Your score is currently lower because some recent claims require review and not all verification signals were successful."

    # Verification Insights
    insights_map = {}
    for d in disputes:
        if d.get("verification") and d["verification"].get("evidence_checks"):
            for check in d["verification"]["evidence_checks"]:
                name = check["name"]
                if name not in insights_map:
                    insights_map[name] = {"total": 0, "verified": 0}
                insights_map[name]["total"] += 1
                if check["status"] == "VERIFIED":
                    insights_map[name]["verified"] += 1
                    
    verification_insights = [
        {"signal": k, "percentage": int(v["verified"] / v["total"] * 100)}
        for k, v in insights_map.items()
    ]

    # Protection Factors
    positive_factors = []
    if any(i["percentage"] >= 50 for i in verification_insights):
        positive_factors.append("Verified delivery evidence")
    if insights_map.get("GPS Location Match", {}).get("percentage", 0) > 0:
        positive_factors.append("Consistent GPS data")
    positive_factors.append("Successful completed deliveries")

    review_factors = []
    if any(d.get("status") == "Rejected" for d in disputes):
        review_factors.append("Previous claim rejected")
    if active_disputes > 0:
        review_factors.append("Previous claim requiring review")

    sorted_disputes = sorted(disputes, key=lambda x: x.get("date", ""), reverse=True)
    
    # Current Shield Status (based on most recent shielded dispute)
    shielded_disputes = [d for d in sorted_disputes if d.get("incentive_shield_status") in ["Protected", "Protected During Review", "Incentive Restored"]]
    if shielded_disputes:
        latest_shield = shielded_disputes[0]
        shield_amount = latest_shield.get("amount_at_risk", 0)
        shield_status = latest_shield.get("incentive_shield_status", "Active")
        if shield_status == "Incentive Restored":
            shield_explanation = "Your incentive is protected because recent disruption evidence was successfully verified."
        else:
            shield_explanation = "Incentive Shield remains active based on your protected incentive history. Claim review status does not automatically remove existing incentive protection."
    else:
        shield_amount = 0
        shield_status = "Not Active"
        shield_explanation = "No active protections."

    recent_activity = []
    for d in sorted_disputes[:4]:
        if d.get("status") == "Resolved":
            recent_activity.append({
                "title": f"Dispute Resolved — ₹{d.get('amount_at_risk', 0):,} restored",
                "time": d.get("date"),
                "type": "success"
            })
        elif d.get("status") == "Under Review":
            recent_activity.append({
                "title": f"Dispute Filed — {d.get('penalty_type')}",
                "time": d.get("date"),
                "type": "warning"
            })
        elif d.get("status") == "Rejected":
            recent_activity.append({
                "title": f"Dispute Rejected — {d.get('penalty_type')}",
                "time": d.get("date"),
                "type": "error"
            })
        else:
             recent_activity.append({
                "title": f"Dispute Update — {d.get('status')}",
                "time": d.get("date"),
                "type": "info"
            })

    return {
        "active_disputes": active_disputes,
        "resolved_disputes": resolved_disputes,
        "protected_income": total_protected,
        "protection_score": protection_score,
        "recent_activity": recent_activity,
        "recent_disputes": sorted_disputes[:5],
        
        "earnings_breakdown": {
            "total_protected": total_protected,
            "amount_recovered": amount_recovered,
            "amount_at_risk": amount_at_risk,
            "protected_disruptions": protected_disruptions
        },
        "shield": {
            "amount": shield_amount,
            "status": shield_status,
            "explanation": shield_explanation
        },
        "verification_insights": verification_insights,
        "protection_factors": {
            "positive": positive_factors,
            "review": review_factors
        },
        "score_explanation": score_explanation
    }
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
