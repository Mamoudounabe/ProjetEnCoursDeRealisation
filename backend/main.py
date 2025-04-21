from fastapi import FastAPI
from app.routes_register import register_routes

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
        {
            "name": "Etablissement",
            "description": "Endpoints permettant de récupérer des informations sur les établissements.",
        },
    ]
)

app.add_middleware(
    CORSMiddleware,
    #allow_origins=["http://localhost:3000", "http://localhost:80", "http://docker-nginx-frontend:3000", "http://docker-nginx-frontend:80"],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": "Hello Parcoursup"}


register_routes(app)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)

