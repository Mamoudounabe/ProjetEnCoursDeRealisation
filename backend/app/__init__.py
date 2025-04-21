from fastapi import FastAPI  
from app.controllers.etablissement_controller import router as etablissement_router  


def register_routes(app: FastAPI):
    app.include_router(etablissement.router)
