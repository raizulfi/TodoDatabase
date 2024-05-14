from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine, Base, TodoItem
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3003"],  # Adjust this to match your frontend's origin
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],  # Include PATCH method
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class TodoItemCreate(BaseModel):
    text: str
    completed: bool = False
    category: str = "incomplete"

class TodoItemRead(TodoItemCreate):
    id: int

    class Config:
        orm_mode = True

@app.get("/todos", response_model=List[TodoItemRead])
def get_todos(category: Optional[str] = None, db: Session = Depends(get_db)):
    if category == "completed":
        return db.query(TodoItem).filter(TodoItem.completed == True).all()
    elif category == "incomplete":
        return db.query(TodoItem).filter(TodoItem.completed == False).all()
    return db.query(TodoItem).all()

@app.post("/todos", response_model=TodoItemRead)
def create_todo(todo: TodoItemCreate, db: Session = Depends(get_db)):
    db_todo = TodoItem(**todo.dict())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.put("/todos/{todo_id}", response_model=TodoItemRead)
def update_todo(todo_id: int, todo: TodoItemCreate, db: Session = Depends(get_db)):
    db_todo = db.query(TodoItem).filter(TodoItem.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    for key, value in todo.dict().items():
        setattr(db_todo, key, value)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.delete("/todos/{todo_id}", response_model=TodoItemRead)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(TodoItem).filter(TodoItem.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
    return db_todo

@app.patch("/todos/{todo_id}", response_model=TodoItemRead)
def toggle_todo_completed(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(TodoItem).filter(TodoItem.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db_todo.completed = not db_todo.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo
