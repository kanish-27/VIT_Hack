from pydantic import BaseModel
from typing import List, Optional

class EvidenceCheck(BaseModel):
    id: str
    name: str
    status: str
    explanation: str
    score: int

class VerificationResult(BaseModel):
    confidence_score: int
    decision: str
    explanation: str
    evidence_checks: List[EvidenceCheck]
    incentive_protected: bool
    protected_amount: int
    verification_hash: str
    timestamp: str

class Dispute(BaseModel):
    id: str
    worker_name: str
    platform: str
    delivery_id: str
    date: str
    penalty_type: str
    customer_rating: Optional[int]
    complaint: str
    amount_at_risk: int
    status: str
    incentive_shield_status: str
    pickup_time: str
    delivery_time: str
    pickup_location: str
    delivery_location: str
    completion_status: str
    verification: Optional[VerificationResult] = None

class ActivityItem(BaseModel):
    title: str
    time: str
    type: str

class DashboardSummary(BaseModel):
    protection_status: str
    protected_amount: int
    recovered_amount: int
    amount_at_risk: int
    incentive_shield_status: str
    
    protection_score: int
    score_status: str
    score_explanation: str
    score_factors: List[str]
    
    total_disputes: int
    pending_disputes: int
    under_review_disputes: int
    resolved_disputes: int
    rejected_disputes: int
    
    verification_insights: dict
    recent_disruptions: List[Dispute]
    recent_activity: List[ActivityItem]

