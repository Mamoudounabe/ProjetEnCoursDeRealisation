from typing import List
from pydantic import BaseModel

from app.models.element_type.element_of_node import ElementOfNode
from app.models.relation_type.property_of_element import PropertyOfElement


class ElementOfRelation(BaseModel):
    id_element: str
    id_neo4j: int
    source_node: ElementOfNode
    target_node: ElementOfNode
    properties_element: List[PropertyOfElement]
