from typing import List
from fastapi import APIRouter

from ..managers.general_manager import GeneralManager

router = APIRouter()

@router.get("/nodes/{node_type}", response_model=List[dict], tags=["General"])
def get_all_nodes_by_type(node_type: str):
    """
    Récupère tous les nœuds d'un type spécifique.
    """
    return GeneralManager.get_all_nodes_by_type(node_type)

@router.get("/general/annee/{annee}", response_model=List[dict], tags=["General"])
def get_all_filiere_etablissement_admission_proportion_by_annee(annee: str):
    """
    Récupère toutes les admissions et proportions par filière et établissement pour une année donnée.
    """
    return GeneralManager.get_all_filiere_etablissement_admission_proportion_by_annee(annee)

@router.get("/general/filiere/{filiere_id}", response_model=dict, tags=["General"])
def get_filiere_by_id(filiere_id: int):
    """
    Récupère une filière spécifique selon son identifiant.
    """
    return GeneralManager.get_filiere_by_id(filiere_id)

@router.get("/general/etablissements/{annee}", response_model=List[dict], tags=["General"])
def get_filieres_etablissements_by_year(annee: str):
    """
    Récupère les filières et établissements pour une année donnée.
    """
    return GeneralManager.get_filieres_etablissements_by_year(annee)
