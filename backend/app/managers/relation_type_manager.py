from typing import List

from app.managers.element_type_manager import NodeTypeManager
from app.models.relation_type.element_of_relation import ElementOfRelation
from app.models.relation_type.property_relation import PropertyRelation
from app.models.relation_type.relation_type import RelationType
from app.models.relation_type.relation_type_with_node import RelationTypeWithNode
from app.services.neo4j_driver import Neo4JDriver
from app.utils.mapper_utils import MapperUtils


class RelationTypeManager:

    @staticmethod
    def get_all_relation_type() -> List[RelationType]:
        """
        Récupère tous les types de relation
        """
        db = Neo4JDriver.get_driver()

        with db.session() as session:
            result = session.run("""
                MATCH ()-[r]->()
                RETURN DISTINCT type(r) AS relation_type, keys(r) AS properties
            """).data()

            relation_map = {}

            for record in result:
                relation_type = record["relation_type"]
                properties = record.get("properties", [])

                if relation_type not in relation_map:
                    relation_map[relation_type] = set(properties)
                else:
                    relation_map[relation_type].update(properties)

            relation_types = []
            for index, (relation_type, properties) in enumerate(relation_map.items()):
                relation_types.append(
                    RelationType(
                        relation_type=relation_type,
                        properties_relation_type=[
                            PropertyRelation(
                                id_property=str(prop_index + 1),
                                name_property=prop,
                                type_property="str"
                            )
                            for prop_index, prop in enumerate(sorted(properties))
                        ]
                    )
                )

        return relation_types

    @staticmethod
    def relation_details(all_relation_type: List[RelationType]) -> List[RelationTypeWithNode]:
        """
        Récupère les détails du type de relation, donc leurs propriétés
        """
        db = Neo4JDriver.get_driver()
        relations_with_nodes = []
        unique_combinations = {}
        id_counter = 1

        with db.session() as session:
            for relation_type in all_relation_type:
                result = session.run(f"""
                    MATCH (start)-[r:`{relation_type.relation_type}`]->(end)
                    RETURN DISTINCT
                        labels(start) AS start_labels,
                        labels(end) AS end_labels
                """)

                for record in result:
                    source_node = ":".join(record.get("start_labels", []))
                    target_node = ":".join(record.get("end_labels", []))

                    unique_combination = (relation_type.relation_type, source_node, target_node)

                    if unique_combination not in unique_combinations:
                        unique_combinations[unique_combination] = id_counter
                        id_counter += 1

                    relations_with_nodes.append(
                        RelationTypeWithNode(
                            id_relation_type=str(unique_combinations[unique_combination]),
                            source_node=source_node,
                            target_node=target_node,
                            relation=relation_type
                        )
                    )

        return relations_with_nodes

    @staticmethod
    def get_all_elements_by_relation_type(name_relation_type: str) -> List[ElementOfRelation]:
        """
        Récupère tous les elements d'une relation spécifique
        """
        db = Neo4JDriver.get_driver()

        query = f"""
        MATCH ()-[r:{name_relation_type}]->()
        RETURN r LIMIT 100 
        """

        with db.session() as session:
            results = session.run(query)
            elements = []

            for record in results:
                relation = record["r"]
                nodes = relation.nodes

                source_node = nodes[0]
                target_node = nodes[1]

                source_id = source_node.id
                target_id = target_node.id

                source_node_element = NodeTypeManager.get_element_node_by_internal_eno4j_id(source_id)
                target_node_element = NodeTypeManager.get_element_node_by_internal_eno4j_id(target_id)

                properties_element = MapperUtils.create_properties_of_relation(relation)

                element = ElementOfRelation(
                    id_element=str(relation.id),
                    id_neo4j=relation.id,
                    source_node=source_node_element,
                    target_node=target_node_element,
                    properties_element=properties_element
                )
                elements.append(element)

            return elements

    @staticmethod
    def get_all_elements_and_relation_with_one_node(src_node_id: int) -> List[ElementOfRelation]:
        """
        Récupère tous les noeuds et les relations connectés à un certain noeud
        """
        db = Neo4JDriver.get_driver()

        query = """
        MATCH (src)-[r]->(target)
        WHERE id(src) = $src_node_id
        RETURN src, r, target
        """

        with db.session() as session:
            results = session.run(query, src_node_id=src_node_id)

            elements = []
            for record in results:
                src_node = record["src"]
                relation = record["r"]
                target_node = record["target"]

                source_node_element = MapperUtils.create_element_of_node(src_node)
                target_node_element = MapperUtils.create_element_of_node(target_node)
                properties_relation = MapperUtils.create_properties_of_relation(relation)

                element = ElementOfRelation(
                    id_element=str(relation.id),
                    id_neo4j=relation.id,
                    source_node=source_node_element,
                    target_node=target_node_element,
                    properties_element=properties_relation
                )
                elements.append(element)

            return elements
