from typing_extensions import Unpack

from http.client import HTTPException
from typing import List, Literal
from fastapi import APIRouter, Query

from ..managers.element_type_manager import NodeTypeManager
from ..models.element_type.element_of_node import ElementOfNode
from ..models.element_type.node_type import NodeType

router = APIRouter()

node_type_options = [node_type.name_node_type for node_type in NodeTypeManager.get_all_node_type()]

@router.get("/node-types", response_model=List[NodeType], tags=["Node Types"])
def get_all_node_type():
    try:
        return NodeTypeManager.get_all_node_type()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/node-types/{name_node_type}/elements", response_model=List[ElementOfNode], tags=["Node Types"])
def get_all_elements_by_node_type(name_node_type: Literal[Unpack[node_type_options]]):
    """
    Endpoint pour récupérer tous les éléments pour un type de nœud spécifique.
    """

    try:
        return NodeTypeManager.get_all_elements_by_node_type(name_node_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/node-types/{name_node_type}/elements/filter", response_model=List[ElementOfNode], tags=["Node Types"])
async def get_all_elements_by_node_type_and_property(
    name_node_type: Literal[Unpack[node_type_options]],
    property_name: str = Query(..., description="Nom de la propriété à filtrer"),
    property_value: str = Query(..., description="Valeur de la propriété à filtrer")
):
    """
    Endpoint pour récupérer tous les éléments d'un type de nœud spécifique en filtrant sur une propriété et une valeur.
    """
    if name_node_type not in node_type_options:
        raise HTTPException(status_code=400, detail="Type de nœud invalide")

    try:
        return NodeTypeManager.get_all_elements_by_node_type_and_property(
            name_node_type, property_name, property_value
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))