from typing import List, Dict, Any
from fastapi import APIRouter, Query, HTTPException, Path, Depends
from fastapi.responses import JSONResponse
from app.services.etablissement_service import EtablissementService

router = APIRouter()

@router.get("/etablissements/region", response_model=List[dict], tags=["Etablissement"])
def get_etablissement_by_region(
    region_name: str = Query(..., description="Nom de la région à rechercher"),
    service: EtablissementService = Depends()
):
    return service.get_etablissement_by_region(region_name)


@router.get("/etablissements/popularite/capacite", response_model=List[dict], tags=["Etablissement"])
def get_etablissement_by_popularity_capacity():
    return EtablissementService().get_etablissement_by_popularity_capacity()



@router.get("/filiere/etablissement/admission", response_model=List[dict], tags=["Etablissement"])
def get_filiere_etablissement_admission(
    query: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(8, le=100)
):
    try:
        result = EtablissementService().get_filiere_etablissement_admission(query, page, page_size)
        return JSONResponse(content=result, headers={"Content-Type": "application/json; charset=utf-8"})
    except Exception as e:
        print(f"Erreur dans get_filiere_etablissement_admission: {e}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")


@router.get("/Etablissement/Candidat/Bachelier/{etablissementID}", response_model=List[Dict[str, Any]], tags=["Etablissement"])
def get_etablissement_by_effectif(
    etablissementID: int,
    anneeactuelle: str = Query(..., description="Année de la session"),
    service: EtablissementService = Depends()
):
    return service.get_etablissement_by_effectif(etablissementID, anneeactuelle)

@router.get("/filiere/Candidat/Bachelier/{filiereID}", response_model=List[Dict[str, Any]], tags=["Etablissement"])
def get_filiere_by_details(
    filiereID: int,
    anneeactuelle: str = Query(..., description="Année de la session")
):
    return EtablissementService().get_filiere_by_details(filiereID, anneeactuelle)


@router.get("/etablissements/comparaison/{etablissementID1}/{etablissementID2}", response_model=List[Dict[str, Any]], tags=["Etablissement"])
def get_comp_etablissements(
    etablissementID1: int,
    etablissementID2: int,
    anneeactuelle: str = Query(..., description="Année de la session")
):
    return EtablissementService().get_comp_etablissements(etablissementID1, etablissementID2, anneeactuelle)

@router.get("/etablissements/comparaison", response_model=List[Dict[str, Any]], tags=["Etablissement"])
def get_comp_plus_etablissements(
    etablissementIDs: List[int] = Query(..., description="Liste des IDs"),
    anneeactuelle: str = Query(..., description="Année de la session")
):
    return EtablissementService().get_comp_plus_etablissements(etablissementIDs, anneeactuelle)

@router.get("/etablissements/filiere", response_model=List[dict], tags=["Etablissement"])
def get_etablissement_by_filiere(
    type_filiere: str = Query(..., description="Type de filière à rechercher"),
    service: EtablissementService = Depends()
):
    return service.get_etablissement_by_filiere(type_filiere)





@router.get("/api/etablissements/popularite/candidats")
def get_etablissement_by_popularity_candidates(service: EtablissementService = Depends()):
    return service.get_etablissement_by_popularity_candidates()


@router.get("/api/filiere/etablissement/admission")
def get_filiere_etablissement_admission(
    query: str,
    page: int,
    page_size: int,
    service: EtablissementService = Depends()
):
    print("Query envoyée à Neo4J:", query)
    return service.get_filiere_etablissement_admission(query, page, page_size)



