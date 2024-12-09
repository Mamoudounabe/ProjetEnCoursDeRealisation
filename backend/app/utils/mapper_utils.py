from typing import List

from app.models.element_type.element_of_node import ElementOfNode
from app.models.element_type.property_of_element import PropertyOfElement


class MapperUtils:
    @staticmethod
    def create_element_of_node(node) -> ElementOfNode:
        """
        Crée une instance de ElementOfNode à partir d'un nœud Neo4j.
        """
        properties_element = [
            PropertyOfElement(
                id_property=str(i + 1),
                name_property=key,
                value_property=value
            ).dict()
            for i, (key, value) in enumerate(node.items())
        ]
        return ElementOfNode(
            id_element=str(node.id),
            id_neo4j=node.id,
            properties_element=properties_element
        )

    @staticmethod
    def create_properties_of_relation(relation) -> List[PropertyOfElement]:
        """
        Crée une liste de PropertyOfElement à partir des propriétés d'une relation.
        """
        return [
            PropertyOfElement(
                id_property=str(i + 1),
                name_property=key,
                value_property=value
            ).dict()
            for i, (key, value) in enumerate(relation.items())
        ]
