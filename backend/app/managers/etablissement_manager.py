from typing import List
from app.services.neo4j_driver import Neo4JDriver 




class EtablissementManager:

    @staticmethod
    def get_etablissement_by_filiere(type_filiere: str) -> List[dict]:
        """
        Retourne les établissements offrant une filière spécifique.
        """
        query = """
        MATCH (e:Etablissement)-[:OFFERS]->(f:Filiere)
        WHERE toLower(f.filiere_formation) CONTAINS toLower($type_filiere)
        RETURN DISTINCT e.etablissement AS etablissement, 
                        f.filiere_formation AS filiere, 
                        e.region_etablissement AS region
        """
        db = Neo4JDriver.get_driver()
        with db.session() as session:
            results = session.run(query, type_filiere=type_filiere)
            return [record for record in results]

    @staticmethod
    def get_etablissement_by_region(region_name: str) -> List[dict]:
        """
        Retourne les établissements situés dans une région spécifique.
        """
        query = """
        MATCH (e:Etablissement)-[:OFFERS]->(f:Filiere)
        WHERE toLower(e.region_etablissement) CONTAINS toLower($region_name)
        RETURN DISTINCT e.etablissement AS etablissement, 
                        f.filiere_formation AS filiere, 
                        e.region_etablissement AS region
        """
        db = Neo4JDriver.get_driver()
        with db.session() as session:
            results = session.run(query, region_name=region_name)
            return [record for record in results]

    @staticmethod
    def get_etablissement_by_popularity_capacity() -> List[dict]:
        """
        Retourne les établissements par capacité décroissante.
        """
        query = """
        MATCH (e:Etablissement)-[:OFFERS]->(f:Filiere)
        WHERE f.capacite_etablissement_formation IS NOT NULL
        RETURN DISTINCT e.etablissement AS etablissement, 
                        f.filiere_formation AS filiere, 
                        toInteger(f.capacite_etablissement_formation) AS capacite
        ORDER BY capacite DESC
        """
        db = Neo4JDriver.get_driver()
        with db.session() as session:
            results = session.run(query)
            return [record for record in results]

    @staticmethod
    def get_etablissement_by_popularity_candidates() -> List[dict]:
        """
        Retourne les établissements par nombre total de candidats décroissant.
        """
        query = """
        MATCH (e:Etablissement)-[:OFFERS]->(f:Filiere),
              (e)-[:HAS_CANDIDAT]->(c:Candidat)
        WHERE c.effectif_total_candidats_formation IS NOT NULL
        RETURN DISTINCT e.etablissement AS etablissement, 
                        f.filiere_formation AS filiere, 
                        toInteger(c.effectif_total_candidats_formation) AS candidats_par_formation
        ORDER BY candidats_par_formation DESC
        """
        db = Neo4JDriver.get_driver()
        with db.session() as session:
            results = session.run(query)
            return [record for record in results]
        



    @staticmethod
    def get_filiere_etablissement_admission() -> List[dict]:
        """
        Retourne les établissements par nombre total de candidats décroissant.
        """
        query = """
        MATCH (f:Filiere)<-[offers:OFFERS]-(e:Etablissement)-[has_admission:HAS_ADMISSION]->(a:Admission)
        RETURN e.etablissement AS etablissement,  
               e.commune_etablissement AS commune_etablissement, 
               f.filiere_formation AS filiere_formation, 
               f.filiere_formation_detaillee AS filiere_formation_detaillee, 
               f.filiere_formation_tres_detaillee AS filiere_formation_tres_detaillee,
               e.academie_etablissement AS academie_etablissement, 
               e.statut_etablissement_filiere AS statut_etablissement_filiere, 
               f.selectivite AS selectivite, 
               a.effectif_total_candidats_admis AS effectif_total_candidats_admis, 
               ID(f) AS id_filiere
        """
        db = Neo4JDriver.get_driver()
        with db.session() as session:
            results = session.run(query)
            #print("Résultats de la requête 'get_filiere_etablissement_admission' :", results)
            #return [record for record in results]
            # Retourne les résultats sous forme de dictionnaires
            print("Résultats de la requête 'get_filiere_etablissement_admission' :", results)
            return [{key: record[key] for key in record.keys()} for record in results]
