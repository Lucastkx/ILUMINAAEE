import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import engine, Base
import models  # carrega as tabelas ANTES do create_all
from routes import router

Base.metadata.create_all(engine)
os.makedirs("uploads", exist_ok=True)

app = FastAPI(title="Ilumina Aeee API")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_methods=["*"], allow_headers=["*"])
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(router)