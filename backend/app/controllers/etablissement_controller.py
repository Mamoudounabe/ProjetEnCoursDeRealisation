from typing import List
from fastapi import APIRouter, Query
from fastapi import HTTPException
from fastapi.responses import JSONResponse

from ..managers.etablissement_manager import EtablissementManager

router = APIRouter()

@router.get("/etablissements/filiere", response_model=List[dict], tags=["Etablissement"])
def get_etablissement_by_filiere(type_filiere: str = Query(..., description="Type de filière à rechercher")):
    """
    Endpoint pour récupérer les établissements offrant une filière spécifique.
    """
    return EtablissementManager.get_etablissement_by_filiere(type_filiere)


@router.get("/etablissements/region", response_model=List[dict], tags=["Etablissement"])
def get_etablissement_by_region(region_name: str = Query(..., description="Nom de la région à rechercher")):
    """
    Endpoint pour récupérer les établissements situés dans une région spécifique.
    """
    return EtablissementManager.get_etablissement_by_region(region_name)


@router.get("/etablissements/popularite/capacite", response_model=List[dict], tags=["Etablissement"])
def get_etablissement_by_popularity_capacity():
    """
    Endpoint pour récupérer les établissements par capacité décroissante.
    """
    return EtablissementManager.get_etablissement_by_popularity_capacity()


@router.get("/etablissements/popularite/candidats", response_model=List[dict], tags=["Etablissement"])
def get_etablissement_by_popularity_candidates():
    """
    Endpoint pour récupérer les établissements par nombre total de candidats décroissant.
    """
    return EtablissementManager.get_etablissement_by_popularity_candidates()





@router.get("/filiere/etablissement/admission", response_model=List[dict], tags=["Etablissement"])
def get_filiere_etablissement_admission(page: int = Query(1, ge=1), page_size: int = Query(8, le=100)):
    """
    Endpoint pour récupérer les établissements par nombre total de candidats décroissant avec pagination.
    """
    try:
        result = EtablissementManager.get_filiere_etablissement_admission(page, page_size)
        return JSONResponse(content=result, headers={"Content-Type": "application/json; charset=utf-8"})
    except Exception as e:
        print(f"Error in get_filiere_etablissement_admission: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
