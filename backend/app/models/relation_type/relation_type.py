from pydantic import BaseModel
from typing import List

from app.models.relation_type.property_relation import PropertyRelation


class RelationType(BaseModel):
    relation_type: str
    properties_relation_type: List[PropertyRelation]

