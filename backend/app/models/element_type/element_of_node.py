from typing import List
from pydantic import BaseModel
from app.models.element_type.property_of_element import PropertyOfElement


class ElementOfNode(BaseModel):
    id_element: str
    id_neo4j: int
    properties_element: List[PropertyOfElement]
