from typing import List, Literal

from fastapi import APIRouter, Query

from app.managers.relation_type_manager import RelationTypeManager
from app.models.relation_type.relation_type import RelationType
from app.models.relation_type.relation_type_with_node import RelationTypeWithNode

router = APIRouter()

import os

if os.getenv("DISABLE_AUTO_RELATION_TYPES") != "1":
    relation_type_options = RelationTypeManager.get_all_relation_type()
else:
    relation_type_options = []

name_relation_type_options = [relation_type.relation_type for relation_type in relation_type_options]
relation_type_options_detail = RelationTypeManager.relation_details(relation_type_options)

@router.get("/relation-types", response_model=List[RelationType], tags=["Type de relations"])
def get_all_relation_type():
    """
    Récupère tous les types de relation
    """
    return relation_type_options

@router.get("/relation-types-details", response_model=List[RelationTypeWithNode], tags=["Type de relations"])
def get_relation_details():
    """
    Récupère les types de relation et leurs détails donc les propriétés
    """
    return relation_type_options_detail

@router.get("/relation-types/{name_relation_type/elements", tags=["Type de relations"])
def get_all_elements_by_relation_type(name_relation_type: Literal[name_relation_type_options]):
    """
    Récupère tous les éléments grâce à un type de relation
    """
    return RelationTypeManager.get_all_elements_by_relation_type(name_relation_type)

@router.get("/relation-types/{name_relation_type}/elements/filter", tags=["Type de relations"])
def get_all_elements_and_relation_with_one_node(src_node_id: int):
    """
    Récupère tous les éléments et les relations liées à un noeud
    """
    return RelationTypeManager.get_all_elements_and_relation_with_one_node(src_node_id)
