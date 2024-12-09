from pydantic import BaseModel


class PropertyRelation(BaseModel):
    id_property: str
    name_property: str
    type_property: str
