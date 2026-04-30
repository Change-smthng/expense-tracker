from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from database import get_db
from models import Expense
from schemas import ExpenseCreate, ExpenseOut
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/expenses", tags=["expenses"])

@router.post("", response_model=ExpenseOut, status_code=201)
def create_expense(
    data: ExpenseCreate, 
    clerk_id: str = Header(..., alias="Authorization", description="Pass clerk ID as Authorization just for simple scope"),
    db: Session = Depends(get_db)
):
    """
    Create a new expense.
    Uses 'idempotency_key' from the body to ensure that if a user clicks submit multiple times
    or the network drops and the client retries, we DO NOT create duplicate entries.
    """
    # Clean clerk_id if passed as Bearer (simple mock auth parsing for now)
    user_id = clerk_id.replace("Bearer ", "") if clerk_id.startswith("Bearer ") else clerk_id
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Idempotency Check
    existing_expense = db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.idempotency_key == data.idempotency_key
    ).first()
    
    if existing_expense:
        logger.info(f"Idempotent request caught: returning existing expense {data.idempotency_key}")
        # Return the existing resource without recreating
        return existing_expense
        
    expense = Expense(
        user_id=user_id,
        idempotency_key=data.idempotency_key,
        amount=data.amount,
        category=data.category,
        description=data.description,
        date=data.date
    )
    
    db.add(expense)
    db.commit()
    db.refresh(expense)
    
    return expense

@router.get("", response_model=list[ExpenseOut])
def list_expenses(
    category: str = Query(None, description="Filter by category"),
    sort: str = Query("date_desc", description="sort by date: date_desc or date_asc"),
    clerk_id: str = Header(..., alias="Authorization"),
    db: Session = Depends(get_db)
):
    """List expenses for the user with optional filtering and sorting."""
    user_id = clerk_id.replace("Bearer ", "") if clerk_id.startswith("Bearer ") else clerk_id
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    query = db.query(Expense).filter(Expense.user_id == user_id)
    
    if category:
        query = query.filter(Expense.category == category)
        
    if sort == "date_desc":
        query = query.order_by(desc(Expense.date), desc(Expense.created_at))
    elif sort == "date_asc":
        query = query.order_by(asc(Expense.date), asc(Expense.created_at))
        
    return query.all()
