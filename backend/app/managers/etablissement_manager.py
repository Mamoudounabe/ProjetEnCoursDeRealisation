from typing import List
from app.services.neo4j_driver import Neo4JDriver 

import pdb



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
    def get_filiere_etablissement_admission(page: int = 1, page_size: int = 10) -> dict:
        """
        Retourne les établissements par nombre total de candidats décroissant avec pagination.
        """
        # Calculer l'offset pour la pagination
        skip = (page - 1) * page_size

        # Requête pour récupérer les établissements
        query = f"""
        MATCH (f:Filiere)<-[offers:OFFERS]-(e:Etablissement)-[has_admission:HAS_ADMISSION]->(a:Admission)
        RETURN e.etablissement,  
            e.commune_etablissement, 
            f.filiere_formation, 
            f.filiere_formation_detaillee, 
            f.filiere_formation_tres_detaillee,
            e.academie_etablissement, 
            e.statut_etablissement_filiere, 
            f.selectivite, 
            a.effectif_total_candidats_admis,
            ID(f) AS id_filiere
        ORDER BY a.effectif_total_candidats_admis DESC
        SKIP {skip} LIMIT {page_size}
        """

        try:
            db = Neo4JDriver.get_driver()  # Remplace par la bonne fonction pour te connecter à la base de données Neo4J
            with db.session() as session:
                # Exécution de la requête pour récupérer les établissements
                results = session.run(query)
                records = [record.data() for record in results]

                # Vérifier si les résultats sont valides (c'est-à-dire si ce sont des dictionnaires)
                if not all(isinstance(r, dict) for r in records):
                    raise ValueError("Les données retournées ne sont pas valides (doivent être des dictionnaires).")

                # Calcul du nombre total d'établissements
                count_query = """
                MATCH (f:Filiere)<-[offers:OFFERS]-(e:Etablissement)-[has_admission:HAS_ADMISSION]->(a:Admission)
                RETURN count(DISTINCT e) AS total_count
                """
                count_results = session.run(count_query)
            
                # Vérification du résultat de la requête de comptage
                if count_results.peek() is None:
                    total_count = 0  # Si aucun résultat trouvé
                else:
                  total_count = count_results.single()[0]  # Récupérer le total count
            
                # Calcul du nombre total de pages
                total_pages = (total_count + page_size - 1) // page_size  # Arrondir le nombre total de pages

                return {
                "page": page,
                "page_size": page_size,
                "total_items": total_count,
                "total_pages": total_pages,
                "items": records
             }

        except ValueError as ve:
            print(f"Erreur de données : {ve}")
            return {"error": f"Erreur de données : {str(ve)}"}
        except Exception as e:
            import traceback
            print(f"Erreur dans get_filiere_etablissement_admission: {e}")
            print(traceback.format_exc())  # Affiche l'exception complète pour le débogage
            return {"error": "Erreur lors de la récupération des données"}
