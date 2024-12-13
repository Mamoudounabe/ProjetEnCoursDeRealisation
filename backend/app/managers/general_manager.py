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

    @staticmethod
    def get_all_filiere_etablissement_admission_proportion_by_annee(annee: str) -> List[dict]:
        """
        Retourne toutes les admissions et les proportions dans toutes les filieres reliée à un établissement par année
        """
        query = f"""
        MATCH (f:Filiere)<-[:OFFERS]-(e:Etablissement)-[:HAS_ADMISSION]->(a:Admission),
              (e)<-[:HAS_ETABLISSEMENT]-(s:Session),
              (a)-[:HAS_PROPORTION]->(p:Proportion)
        WHERE s.annee = "2021"
        RETURN f AS filiere, 
               e AS etablissement, 
               a AS admission,
               p AS proportion;
        """
        db = Neo4JDriver.get_driver()
        with db.session() as session:
            results = session.run(query, annee=annee)
            return [
                {
                    "filiere": record["f"],
                    "etablissement": record["e"],
                    "admission": record["a"],
                    "proportion": record["p"]
                }
                for record in results
            ]

    @staticmethod
    def get_filieres_etablissements_by_year(annee: str) -> List[dict]:
        """
        Retourne les filières et établissements pour une année donnée.
        """
        query = """
        MATCH (f:Filiere)<-[:OFFERS]-(e:Etablissement),
              (e)<-[:HAS_ETABLISSEMENT]-(s:Session)
        WHERE s.annee = $annee
        RETURN f AS filiere, e AS etablissement
        ORDER BY etablissement DESC
        """
        db = Neo4JDriver.get_driver()
        with db.session() as session:
            results = session.run(query, annee=annee)
            return [
                {
                    "filiere": record["f"],
                    "etablissement": record["e"]
                }
                for record in results
            ]

    @staticmethod
    def get_filiere_by_id(filiere_id: int) -> dict:
        """
        Retourne une filière spécifique selon son identifiant.
        """
        query = """
            MATCH (f:Filiere)
            WHERE id(f) = $filiere_id
            RETURN f
            """
        db = Neo4JDriver.get_driver()
        with db.session() as session:
            result = session.run(query, filiere_id=filiere_id).single()
            return {"filiere": result["f"]} if result else None