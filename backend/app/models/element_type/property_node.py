from pydantic import BaseModel


class PropertyNode(BaseModel):
    id_property: str
    name_property: str
    type_property: str
