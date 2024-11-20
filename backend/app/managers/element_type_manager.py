from typing import List

from app.models.element_type.element_of_node import ElementOfNode
from app.models.element_type.node_type import NodeType
from app.models.element_type.property_node import PropertyNode
from app.models.element_type.property_of_element import PropertyOfElement
from app.services.neo4j_driver import Neo4JDriver


class NodeTypeManager:

    @staticmethod
    def get_all_node_type() -> List[NodeType]:
        """
        Retourne tous les types de noeuds de la base de données.
        """

        db = Neo4JDriver.get_driver()

        query = """
        MATCH (n)
        UNWIND labels(n) AS Label
        UNWIND keys(n) AS Property
        WITH Label, collect(DISTINCT Property) AS Properties
        RETURN Label, Properties
        """

        with db.session() as session:

            results = session.run(query)

            node_types = []
            for record in results:
                label = record["Label"]
                properties = record["Properties"]

                properties_list = [
                    PropertyNode(id_property=str(i + 1), name_property=prop, type_property="str")
                    for i, prop in enumerate(properties) if isinstance(prop, str)
                ]

                node_type = NodeType(
                    id_node_type=str(len(node_types) + 1),
                    name_node_type=label,
                    properties_node_type=properties_list
                )
                node_types.append(node_type)

            return node_types

    @staticmethod
    def get_all_elements_by_node_type(name_node_type: str) -> List[ElementOfNode]:
        """
        Retourne tous les éléments pour un type de nœud spécifique.
        """
        db = Neo4JDriver.get_driver()

        query = f"""
        MATCH (n:{name_node_type})
        RETURN n LIMIT 100
        """

        with db.session() as session:
            results = session.run(query)
            return NodeTypeManager._parse_results_to_elements(results)

    @staticmethod
    def get_all_elements_by_node_type_and_property(name_node_type: str, property_name: str, property_value: str) -> List[ElementOfNode]:
        """
        Retourne tous les éléments pour un type de noeuds et une propriété.
        """

        db = Neo4JDriver.get_driver()

        query = f"""
        MATCH (n:{name_node_type})
        WHERE n.{property_name} = $property_value
        RETURN n
        """

        with db.session() as session:
            results = session.run(query, property_value=property_value)
            return NodeTypeManager._parse_results_to_elements(results)

    @staticmethod
    def _parse_results_to_elements(results) -> List[ElementOfNode]:
        """
        Méthode privée pour convertir les résultats Neo4j en éléments.
        """
        elements = []
        for record in results:
            node = record["n"]
            properties_element = [
                PropertyOfElement(
                    id_property=str(i + 1),
                    name_property=key,
                    value_property=value
                )
                for i, (key, value) in enumerate(node.items())
            ]

            element = ElementOfNode(
                id_element=node["id"],
                id_neo4j=node.id,
                properties_element=properties_element
            )
            elements.append(element)

        return elements