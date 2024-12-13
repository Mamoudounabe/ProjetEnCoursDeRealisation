from pydantic import BaseModel
from app.models.relation_type.relation_type import RelationType


class RelationTypeWithNode(BaseModel):
    id_relation_type: str
    source_node: str
    target_node: str
    relation: RelationType
