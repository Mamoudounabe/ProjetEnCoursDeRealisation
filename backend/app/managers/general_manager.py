from typing import List
from app.services.neo4j_driver import Neo4JDriver


class GeneralManager:

    @staticmethod
    def get_all_nodes_by_type(node_type: str) -> List[dict]:
        """
        Retourne tous les noeuds d'un type spécifique.
        """
        query = f"""
        MATCH (n:{node_type})
        RETURN n
        """
        db = Neo4JDriver.get_driver()
        with db.session() as session:
            results = session.run(query)
            return [record["n"] for record in results]


# Liste des noeuds supporté
SUPPORTED_NODE_TYPES = [
    "Admission",
    "Bachelier",
    "Candidat",
    "Classement",
    "ClassementRang",
    "ComplementPhase",
    "Etablissement",
    "Filiere",
    "Proportion",
    "Session",
    "Terminale"
]
