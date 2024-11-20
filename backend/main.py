from fastapi import FastAPI
from app.routes import register_routes
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    openapi_tags=[
        {
            "name": "Type de noeuds",
            "description": "Opérations liées aux types de nœuds, telles que leur récupération ou les éléments associés.",
        },
        {
            "name": "Type de relations",
            "description": "Endpoints permettant de gérer les types de relations entre les nœuds. Ils permettent de visualiser les liens et les interactions entre différents éléments, ainsi que leurs propriétés associées.",
        },
    ]
)
