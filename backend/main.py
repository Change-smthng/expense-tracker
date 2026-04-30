from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import expenses

app = FastAPI(title="Personal Expense Tracker API")


@app.on_event("startup")
def startup_event():
    init_db()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost:3000",
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# Include only the expenses router as per assignment
app.include_router(expenses.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Personal Expense Tracker API"}
