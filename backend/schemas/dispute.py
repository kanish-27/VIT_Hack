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
