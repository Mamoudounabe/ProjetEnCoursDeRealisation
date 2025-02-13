from typing import List
from fastapi import APIRouter, Query

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
def get_filiere_etablissement_admission():
    """
    Endpoint pour récupérer les établissements par nombre total de candidats décroissant.
    """
    # Appel au manager pour récupérer les données
    results = EtablissementManager.get_filiere_etablissement_admission()
    return results
