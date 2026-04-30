from sqlalchemy import Column, Integer, String, Numeric, DateTime, Date
from datetime import datetime, timezone
from database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False) # Clerk User ID for isolation
    idempotency_key = Column(String, unique=True, index=True, nullable=False)
    
    amount = Column(Numeric(10, 2), nullable=False)
    category = Column(String, nullable=False, index=True)
    description = Column(String, nullable=False)
    date = Column(Date, nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
