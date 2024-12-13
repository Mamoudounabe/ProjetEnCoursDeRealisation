from typing import List
from fastapi import APIRouter

from ..managers.general_manager import GeneralManager

router = APIRouter()

@router.get("/nodes/{node_type}", response_model=List[dict], tags=["General"])
def get_all_nodes_by_type(node_type: str):
    """
    Endpoint pour récupérer tous les noeuds d'un type spécifique.
    """
    return GeneralManager.get_all_nodes_by_type(node_type)