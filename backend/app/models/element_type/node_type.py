from typing import List
from pydantic import BaseModel
from app.models.element_type.property_node import PropertyNode


class NodeType(BaseModel):
    id_node_type: str
    name_node_type: str
    properties_node_type: List[PropertyNode]
