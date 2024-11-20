from typing import Union
from pydantic import BaseModel


class PropertyOfElement(BaseModel):
    id_property: str
    name_property: str
    value_property: Union[str, int, float]
