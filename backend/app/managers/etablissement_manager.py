from typing import List
from app.services.neo4j_driver import Neo4JDriver 
from typing import List, Dict, Any
import traceback



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
    def get_filiere_etablissement_admission(query: str, page: int = 1, page_size: int = 10) -> dict:
        """
        Retourne les établissements par nombre total de candidats décroissant avec pagination.
        """
        # Calculer l'offset pour la pagination
        skip = (page - 1) * page_size

        # Construction de la requête de base
        base_query = """
        MATCH (f:Filiere)<-[offers:OFFERS]-(e:Etablissement)-[has_admission:HAS_ADMISSION]->(a:Admission)
        MATCH (e:Etablissement)-[:HAS_CANDIDAT]->(c:Candidat)
        """

        # Ajouter un filtre sur la variable `query` si elle est fournie
        if query:
            base_query += """
            WHERE toLower(e.etablissement) CONTAINS toLower($query) OR
                    toLower(f.filiere_formation) CONTAINS toLower($query) OR
                    toLower(f.filiere_formation_detaillee) CONTAINS toLower($query) OR
                    toLower(f.filiere_formation_tres_detaillee) CONTAINS toLower($query) OR
                    toLower(e.academie_etablissement) CONTAINS toLower($query) OR
                    toLower(e.statut_etablissement_filiere) CONTAINS toLower($query) OR
                    toLower(e.commune_etablissement) CONTAINS toLower($query) OR
                    toLower(f.selectivite ) CONTAINS toLower($query) OR
                    toLower(a.effectif_total_candidats_admis) CONTAINS toLower($query)

            """


        # Ajouter la partie de retour et la pagination
        base_query += f"""
        RETURN DISTINCT
            e.etablissement AS etablissement,
            e.commune_etablissement AS commune_etablissement, 
            f.filiere_formation AS filiere_formation,
            f.filiere_formation_detaillee AS filiere_formation_detaillee,
            f.filiere_formation_tres_detaillee AS filiere_formation_tres_detaillee,
            e.academie_etablissement AS academie_etablissement,
            e.statut_etablissement_filiere AS statut_etablissement_filiere,
            f.selectivite AS selectivite,
            toInteger(f.capacite_etablissement_formation) AS capacite,
            toInteger(c.effectif_total_candidats_formation) AS effectif_total_candidats_formation,
            toInteger(a.effectif_total_candidats_admis) AS effectif_total_candidats_admis,
            ID(e) AS id_etablissement,
            ID(f) AS id_filiere
        SKIP {skip} LIMIT {page_size}
        """

        try:
            db = Neo4JDriver.get_driver()  # Remplace par la bonne fonction pour te connecter à la base de données Neo4J
            with db.session() as session:
                # Ajout du print pour vérifier que le paramètre query est passé
                print(f"Query envoyée à Neo4J: {query}")
                
                # Exécution de la requête pour récupérer les établissements
                results = session.run(base_query, {"query": query})  
                records = [record.data() for record in results]
                print(f"Nombre d'établissements trouvés: {len(records)}")

                # Vérifier si les résultats sont valides (c'est-à-dire si ce sont des dictionnaires)
                if not all(isinstance(r, dict) for r in records):
                    raise ValueError("Les données retournées ne sont pas valides (doivent être des dictionnaires).")

                # Calcul du nombre total d'établissements
                count_query = """
                MATCH (f:Filiere)<-[offers:OFFERS]-(e:Etablissement)-[has_admission:HAS_ADMISSION]->(a:Admission)
                MATCH (e:Etablissement)-[:HAS_CANDIDAT]->(c:Candidat)
                """
                if query:
                    count_query += """
                    WHERE toLower(e.etablissement) CONTAINS toLower($query) OR
                          toLower(f.filiere_formation) CONTAINS toLower($query) OR
                          toLower(f.filiere_formation_detaillee) CONTAINS toLower($query) OR
                          toLower(f.filiere_formation_tres_detaillee) CONTAINS toLower($query) OR
                          toLower(e.academie_etablissement) CONTAINS toLower($query) OR
                          toLower(e.statut_etablissement_filiere) CONTAINS toLower($query) OR
                          toLower(e.commune_etablissement) CONTAINS toLower($query) OR
                          toLower(f.selectivite) CONTAINS toLower($query) OR
                          toLower(a.effectif_total_candidats_admis) CONTAINS toLower($query)
                    """
                count_query += """
                RETURN count(DISTINCT e) AS total_count
                """
                
                count_results = session.run(count_query, {"query": query})
                count_data = count_results.single()
                
                # Vérification du résultat de la requête de comptage
                if count_data is None:
                    total_count = 0  # Si aucun résultat trouvé
                else:
                    total_count = count_data[0]  # Récupérer le total count
                print(f"Total d'établissements correspondant à la requête : {total_count}")
            
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

  

    @staticmethod
    def get_etablissement_by_effectif(etablissementID: int, anneeactuelle: str) -> List[Dict[str, Any]]:
        """
        Retourne les informations sur les établissements en fonction de l'ID de l'établissement 
        et de l'année de session.
        """
        query = """
        MATCH (e:Etablissement)-[:HAS_CANDIDAT]->(c:Candidat)-[:HAS_BACHELIER]->(b:Bachelier)
        MATCH (s:Session)-[:HAS_ETABLISSEMENT]->(e:Etablissement)
        MaTCH (e:Etablissement)-[:HAS_ADMISSION]->(a:Admission)
        MATCH (e:Etablissement)-[:OFFERS]->(f:Filiere)
        MATCH (e:Etablissement)-[:HAS_TAUX_ACCES]->(cl:ClassementRang)
        WHERE ID(e) = $etablissementID AND s.annee = $anneeactuelle
        RETURN e.etablissement AS NomEtablissement,
               e.academie_etablissement AS academie, 
               e.region_etablissement AS region, 
               e.etablissement AS etablissement, 
               e.statut_etablissement_filiere AS statut,
                e.commune_etablissement AS commune,
                e.coordonnees_gps_formation AS localisation,
                





                f.filiere_formation AS filiere_formation,
                f.filiere_formation_detaillee AS filiere_formation_detaillee,
                f.filiere_formation_tres_detaillee AS filiere_formation_tres_detaillee,
                f.lien_parcoursup AS lien_parcoursup,
                f.selectivite AS selectivite,
                toInteger(f.capacite_etablissement_formation) AS capacite,
               
                

                
                toInteger(cl.taux_acces),
                toInteger(cl.rang_dernier_appele_groupe_3),
                toInteger(cl.rang_dernier_appele_groupe_2),
                toInteger(cl.rang_dernier_appele_groupe_1),
                toInteger(cl.part_terminales_generales_position_recevoir_proposition_phase_principale),
                toInteger(cl.part_terminales_technologiques_position_recevoir_proposition_phase_principale),
                toInteger(cl.part_terminales_professionnelles_position_recevoir_proposition_phase_principale),



                


               toInteger(c.effectif_total_candidats_formation) AS TotalCandidat,
               toInteger(c.effectif_total_candidats_phase_principale),
               toInteger(c.effectif_candidates_formation),


               toInteger(b.effectif_neo_bacheliers_generaux_phase_principale) AS NeoBacheliersGeneraux,
               toInteger(b.effectif_neo_bacheliers_technologiques_phase_principale) AS NeoBacheliersTechnologiques,
               toInteger(b.effectif_neo_bacheliers_professionnels_phase_principale) AS NeoBacheliersProfessionnels,

               toInteger(b.effectif_boursiers_professionnels_phase_principale),
               toInteger(b.effectif_autres_candidats_phase_principale),
               toInteger(b.effectif_boursiers_generaux_phase_principale),
               toInteger(b.effectif_boursiers_technologiques_phase_principale),




               
               

               toInteger(a.effectif_admis_proposition_avant_fin_procedure_principale),
               toInteger(a.effectif_neo_bacheliers_mention_bien_bac_admis),
               toInteger(a.effectif_candidates_admises),
               toInteger(a.effectif_neo_bacheliers_mention_assez_bien_bac_admis),
               toInteger(a.effectif_admis_phase_principale),
               toInteger(a.effectif_total_candidats_proposition_admission),
               toInteger(a.effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis),
               toInteger(a.effectif_neo_bacheliers_sans_mention_bac_admis),
               toInteger(a.effectif_generaux_admis),
               toInteger(a.effectif_admises_meme_etablissement_bts_cpge),
               toInteger(a.effectif_total_candidats_admis),
               toInteger(a.effectif_technologiques_mention_bac_admis),
               toInteger(a.effectif_neo_bacheliers_admis),
               toInteger(a.effectif_professionnels_mention_bac_admis),
               toInteger(a.effectif_professionnels_admis),
               toInteger(a.effectif_autres_admis),
               toInteger(a.effectif_boursiers_admis),
               toInteger(a.effectif_admis_meme_academie),
               toInteger(a.effectif_admis_meme_etablissement_bts_cpge),
               toInteger(a.effectif_admis_proposition_ouverture_phase_principale),
               toInteger(a.effectif_neo_bacheliers_sans_info_mention_bac_admis),
               toInteger(a.effectif_admis_phase_complementaire),
               toInteger(a.effectif_neo_bacheliers_mention_tres_bien_bac_admis),
               toInteger(a.effectif_admis_meme_academie_paris_creteil_versailles),
               toInteger(a.effectif_admis_proposition_avant_baccalaureat),
               toInteger(a.effectif_generaux_mention_bac_admis),
               toInteger(a.effectif_technologiques_admis)
 

        """
        try:
            # Récupère le driver Neo4j
            db = Neo4JDriver.get_driver()
            print(f"Connexion à Neo4j établie : {db}")

            with db.session() as session:
                # Log des paramètres envoyés à la requête
                print(f"Exécution de la requête avec etablissementID={etablissementID} et anneeactuelle={anneeactuelle}")
                results = session.run(query, etablissementID=etablissementID, anneeactuelle=anneeactuelle)
                records = [record.data() for record in results]

                # Log du résultat obtenu
                print(f"Résultats de la requête : {records}")

                # Vérifie que chaque résultat est un dictionnaire
                if not all(isinstance(r, dict) for r in records):
                    raise ValueError("Les données retournées ne sont pas valides (doivent être des dictionnaires).")

                return records

        except ValueError as ve:
            print(f"Erreur de données : {ve}")
            return []
        except Exception as e:
            import traceback
            print(f"Erreur dans get_etablissement_by_effectif: {e}")
            print(traceback.format_exc())
            return []
        











    @staticmethod
    def get_filiere_by_details(filiereID: int, anneeactuelle: str) -> List[Dict[str, Any]]:
        """
        Retourne les informations sur les établissements en fonction de l'ID de l'établissement 
        et de l'année de session.
        """
        query = """
        MATCH (e:Etablissement)-[:HAS_CANDIDAT]->(c:Candidat)-[:HAS_BACHELIER]->(b:Bachelier)
        MATCH (s:Session)-[:HAS_ETABLISSEMENT]->(e:Etablissement)
        MaTCH (e:Etablissement)-[:HAS_ADMISSION]->(a:Admission)
        MATCH (e:Etablissement)-[:OFFERS]->(f:Filiere)
        MATCH (e:Etablissement)-[:HAS_TAUX_ACCES]->(cl:ClassementRang)
        WHERE ID(f) = $filiereID AND s.annee = $anneeactuelle
        RETURN e.etablissement AS NomEtablissement,
               e.academie_etablissement AS academie, 
               e.region_etablissement AS region, 
               e.etablissement AS etablissement, 
               e.statut_etablissement_filiere AS statut,
                e.commune_etablissement AS commune,
                e.coordonnees_gps_formation AS localisation,





                f.filiere_formation AS filiere_formation,
                f.filiere_formation_detaillee AS filiere_formation_detaillee,
                f.filiere_formation_tres_detaillee AS filiere_formation_tres_detaillee,
                f.lien_parcoursup AS lien_parcoursup,
                f.selectivite AS selectivite,
                toInteger(f.capacite_etablissement_formation) AS capacite,
               
                

                
                toInteger(cl.taux_acces),
                toInteger(cl.rang_dernier_appele_groupe_3),
                toInteger(cl.rang_dernier_appele_groupe_2),
                toInteger(cl.rang_dernier_appele_groupe_1),
                toInteger(cl.part_terminales_generales_position_recevoir_proposition_phase_principale),
                toInteger(cl.part_terminales_technologiques_position_recevoir_proposition_phase_principale),
                toInteger(cl.part_terminales_professionnelles_position_recevoir_proposition_phase_principale),



                


               toInteger(c.effectif_total_candidats_formation) AS TotalCandidat,
               toInteger(c.effectif_total_candidats_phase_principale),
               toInteger(c.effectif_candidates_formation),


               toInteger(b.effectif_neo_bacheliers_generaux_phase_principale) AS NeoBacheliersGeneraux,
               toInteger(b.effectif_neo_bacheliers_technologiques_phase_principale) AS NeoBacheliersTechnologiques,
               toInteger(b.effectif_neo_bacheliers_professionnels_phase_principale) AS NeoBacheliersProfessionnels,

               toInteger(b.effectif_boursiers_professionnels_phase_principale),
               toInteger(b.effectif_autres_candidats_phase_principale),
               toInteger(b.effectif_boursiers_generaux_phase_principale),
               toInteger(b.effectif_boursiers_technologiques_phase_principale),




               
               

               toInteger(a.effectif_admis_proposition_avant_fin_procedure_principale),
               toInteger(a.effectif_neo_bacheliers_mention_bien_bac_admis),
               toInteger(a.effectif_candidates_admises),
               toInteger(a.effectif_neo_bacheliers_mention_assez_bien_bac_admis),
               toInteger(a.effectif_admis_phase_principale),
               toInteger(a.effectif_total_candidats_proposition_admission),
               toInteger(a.effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis),
               toInteger(a.effectif_neo_bacheliers_sans_mention_bac_admis),
               toInteger(a.effectif_generaux_admis),
               toInteger(a.effectif_admises_meme_etablissement_bts_cpge),
               toInteger(a.effectif_total_candidats_admis),
               toInteger(a.effectif_technologiques_mention_bac_admis),
               toInteger(a.effectif_neo_bacheliers_admis),
               toInteger(a.effectif_professionnels_mention_bac_admis),
               toInteger(a.effectif_professionnels_admis),
               toInteger(a.effectif_autres_admis),
               toInteger(a.effectif_boursiers_admis),
               toInteger(a.effectif_admis_meme_academie),
               toInteger(a.effectif_admis_meme_etablissement_bts_cpge),
               toInteger(a.effectif_admis_proposition_ouverture_phase_principale),
               toInteger(a.effectif_neo_bacheliers_sans_info_mention_bac_admis),
               toInteger(a.effectif_admis_phase_complementaire),
               toInteger(a.effectif_neo_bacheliers_mention_tres_bien_bac_admis),
               toInteger(a.effectif_admis_meme_academie_paris_creteil_versailles),
               toInteger(a.effectif_admis_proposition_avant_baccalaureat),
               toInteger(a.effectif_generaux_mention_bac_admis),
               toInteger(a.effectif_technologiques_admis)
 

        """
        try:
            # Récupère le driver Neo4j
            db = Neo4JDriver.get_driver()
            print(f"Connexion à Neo4j établie : {db}")

            with db.session() as session:
                # Log des paramètres envoyés à la requête
                print(f"Exécution de la requête avec filiereID={filiereID} et anneeactuelle={anneeactuelle}")
                results = session.run(query, filiereID=filiereID, anneeactuelle=anneeactuelle)
                records = [record.data() for record in results]

                # Log du résultat obtenu
                print(f"Résultats de la requête : {records}")

                # Vérifie que chaque résultat est un dictionnaire
                if not all(isinstance(r, dict) for r in records):
                    raise ValueError("Les données retournées ne sont pas valides (doivent être des dictionnaires).")

                return records

        except ValueError as ve:
            print(f"Erreur de données : {ve}")
            return []
        except Exception as e:
            import traceback
            print(f"Erreur dans get_etablissement_by_effectif: {e}")
            print(traceback.format_exc())
            return []
        







    @staticmethod
    def get_comp_etablissements(etablissementID1: int, etablissementID2: int, anneeactuelle: str) -> List[Dict[str, Any]]:
        """
        Retourne les informations sur les établissements en fonction de l'ID de l'établissement 
        et de l'année de session.
        """
        query = """
        MATCH (e:Etablissement)-[:HAS_CANDIDAT]->(c:Candidat)-[:HAS_BACHELIER]->(b:Bachelier)
        MATCH (s:Session)-[:HAS_ETABLISSEMENT]->(e:Etablissement)
        MaTCH (e:Etablissement)-[:HAS_ADMISSION]->(a:Admission)
        MATCH (e:Etablissement)-[:OFFERS]->(f:Filiere)
        MATCH (e:Etablissement)-[:HAS_TAUX_ACCES]->(cl:ClassementRang)
        WHERE (ID(e) = $etablissementID1 AND s.annee = $anneeactuelle)  OR (ID(e) = $etablissementID2 AND s.annee = $anneeactuelle)
        RETURN e.etablissement AS NomEtablissement,
               e.academie_etablissement AS academie, 
               e.region_etablissement AS region, 
               e.etablissement AS etablissement, 
               e.statut_etablissement_filiere AS statut,
                e.commune_etablissement AS commune,
                e.coordonnees_gps_formation AS localisation,





                f.filiere_formation AS filiere_formation,
                f.filiere_formation_detaillee AS filiere_formation_detaillee,
                f.filiere_formation_tres_detaillee AS filiere_formation_tres_detaillee,
                f.lien_parcoursup AS lien_parcoursup,
                f.selectivite AS selectivite,
                toInteger(f.capacite_etablissement_formation) AS capacite,
               
                

                
                toInteger(cl.taux_acces),
                toInteger(cl.rang_dernier_appele_groupe_3),
                toInteger(cl.rang_dernier_appele_groupe_2),
                toInteger(cl.rang_dernier_appele_groupe_1),
                toInteger(cl.part_terminales_generales_position_recevoir_proposition_phase_principale),
                toInteger(cl.part_terminales_technologiques_position_recevoir_proposition_phase_principale),
                toInteger(cl.part_terminales_professionnelles_position_recevoir_proposition_phase_principale),



                


               toInteger(c.effectif_total_candidats_formation) AS TotalCandidat,
               toInteger(c.effectif_total_candidats_phase_principale),
               toInteger(c.effectif_candidates_formation),
               toInteger(f.capacite_etablissement_formation) AS capacite,


               toInteger(b.effectif_neo_bacheliers_generaux_phase_principale) AS NeoBacheliersGeneraux,
               toInteger(b.effectif_neo_bacheliers_technologiques_phase_principale) AS NeoBacheliersTechnologiques,
               toInteger(b.effectif_neo_bacheliers_professionnels_phase_principale) AS NeoBacheliersProfessionnels,

               toInteger(b.effectif_boursiers_professionnels_phase_principale),
               toInteger(b.effectif_autres_candidats_phase_principale),
               toInteger(b.effectif_boursiers_generaux_phase_principale),
               toInteger(b.effectif_boursiers_technologiques_phase_principale),




               
               

               toInteger(a.effectif_admis_proposition_avant_fin_procedure_principale),
               toInteger(a.effectif_neo_bacheliers_mention_bien_bac_admis),
               toInteger(a.effectif_candidates_admises),
               toInteger(a.effectif_neo_bacheliers_mention_assez_bien_bac_admis),
               toInteger(a.effectif_admis_phase_principale),
               toInteger(a.effectif_total_candidats_proposition_admission),
               toInteger(a.effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis),
               toInteger(a.effectif_neo_bacheliers_sans_mention_bac_admis),
               toInteger(a.effectif_generaux_admis),
               toInteger(a.effectif_admises_meme_etablissement_bts_cpge),
               toInteger(a.effectif_total_candidats_admis),
               toInteger(a.effectif_technologiques_mention_bac_admis),
               toInteger(a.effectif_neo_bacheliers_admis),
               toInteger(a.effectif_professionnels_mention_bac_admis),
               toInteger(a.effectif_professionnels_admis),
               toInteger(a.effectif_autres_admis),
               toInteger(a.effectif_boursiers_admis),
               toInteger(a.effectif_admis_meme_academie),
               toInteger(a.effectif_admis_meme_etablissement_bts_cpge),
               toInteger(a.effectif_admis_proposition_ouverture_phase_principale),
               toInteger(a.effectif_neo_bacheliers_sans_info_mention_bac_admis),
               toInteger(a.effectif_admis_phase_complementaire),
               toInteger(a.effectif_neo_bacheliers_mention_tres_bien_bac_admis),
               toInteger(a.effectif_admis_meme_academie_paris_creteil_versailles),
               toInteger(a.effectif_admis_proposition_avant_baccalaureat),
               toInteger(a.effectif_generaux_mention_bac_admis),
               toInteger(a.effectif_technologiques_admis)
 

        """
        try:
            # Récupère le driver Neo4j
            db = Neo4JDriver.get_driver()
            print(f"Connexion à Neo4j établie : {db}")

            with db.session() as session:
                # Log des paramètres envoyés à la requête
                print(f"Exécution de la requête avec etablissementID1={etablissementID1} etablissementID2={etablissementID2} et anneeactuelle={anneeactuelle}")
                results = session.run(query, etablissementID1=etablissementID1, etablissementID2=etablissementID2,anneeactuelle=anneeactuelle)
                records = [record.data() for record in results]

                # Log du résultat obtenu
                print(f"Résultats de la requête : {records}")

                # Vérifie que chaque résultat est un dictionnaire
                if not all(isinstance(r, dict) for r in records):
                    raise ValueError("Les données retournées ne sont pas valides (doivent être des dictionnaires).")

                return records

        except ValueError as ve:
            print(f"Erreur de données : {ve}")
            return []
        except Exception as e:
            import traceback
            print(f"Erreur dans get_comp_etablissements: {e}")
            print(traceback.format_exc())
            return []
        






























    @staticmethod
    def get_comp_plus_etablissements(etablissementIDs: List[int], anneeactuelle: str) -> List[Dict[str, Any]]:
        """
        Retourne les informations sur les établissements en fonction des IDs des établissements 
        et de l'année de session.
        """
        query = """
        MATCH (e:Etablissement)-[:HAS_CANDIDAT]->(c:Candidat)-[:HAS_BACHELIER]->(b:Bachelier)
        MATCH (s:Session)-[:HAS_ETABLISSEMENT]->(e:Etablissement)
        MATCH (e:Etablissement)-[:HAS_ADMISSION]->(a:Admission)
        MATCH (e:Etablissement)-[:OFFERS]->(f:Filiere)
        MATCH (e:Etablissement)-[:HAS_TAUX_ACCES]->(cl:ClassementRang)
        MATCH (c)-[:HAS_COMPLEMENT_PHASE]->(cp:ComplementPhase)
        MATCH (a)-[:HAS_TERMINALE]->(t:Terminale) 
        MATCH (e)-[:HAS_CLASSEMENT]->(cla:Classement)
        MATCH (a)-[:HAS_PROPORTION]->(p:Proportion) 

        WHERE ID(e) IN $etablissementIDs AND s.annee = $anneeactuelle

        RETURN e.etablissement AS NomEtablissement,
            e.academie_etablissement AS academie, 
            e.region_etablissement AS region, 
            e.etablissement AS etablissement, 
            e.statut_etablissement_filiere AS statut,
            e.commune_etablissement AS commune,
            e.coordonnees_gps_formation AS localisation,
            f.filiere_formation AS filiere_formation,
            f.filiere_formation_detaillee AS filiere_formation_detaillee,
            f.filiere_formation_tres_detaillee AS filiere_formation_tres_detaillee,
            f.lien_parcoursup AS lien_parcoursup,
            f.selectivite AS selectivite,
            toInteger(f.capacite_etablissement_formation) AS capacite_etablissement_formation,

             

            
            toInteger(cl.taux_acces) AS taux_acces,
            toInteger(cl.rang_dernier_appele_groupe_3) AS rang_dernier_appele_groupe_3,
            toInteger(cl.rang_dernier_appele_groupe_2) AS rang_dernier_appele_groupe_2,
            toInteger(cl.rang_dernier_appele_groupe_1) AS rang_dernier_appele_groupe_1,
            toInteger(cl.part_terminales_generales_position_recevoir_proposition_phase_principale) AS part_terminales_generales_position_recevoir_proposition_phase_principale,
            toInteger(cl.part_terminales_technologiques_position_recevoir_proposition_phase_principale) AS part_terminales_technologiques_position_recevoir_proposition_phase_principale,
            toInteger(cl.part_terminales_professionnelles_position_recevoir_proposition_phase_principale) AS part_terminales_professionnelles_position_recevoir_proposition_phase_principale,
            toInteger(c.effectif_total_candidats_formation) AS effectif_total_candidats_formation,
            toInteger(c.effectif_total_candidats_phase_principale) AS effectif_total_candidats_phase_principale,
            toInteger(c.effectif_candidates_formation) AS effectif_candidates_formation,

            
            toInteger(p.proportion_neo_bacheliers_meme_etablissement_bts_cpge) AS proportion_neo_bacheliers_meme_etablissement_bts_cpge,
            toInteger(p.proportion_technologiques_admis_mention) AS proportion_technologiques_admis_mention,
            toInteger(p.proportion_neo_bacheliers_meme_academie) AS proportion_neo_bacheliers_meme_academie,
            toInteger(p.proportion_neo_bacheliers_admis) AS proportion_neo_bacheliers_admis,
            toInteger(p.proportion_neo_bacheliers_sans_mention_bac_admis) AS proportion_neo_bacheliers_sans_mention_bac_admis,
            toInteger(p.proportion_professionnels_admis_mention) AS proportion_professionnels_admis_mention,
            toInteger(p.proportion_neo_bacheliers_boursiers) AS proportion_neo_bacheliers_boursiers, 


            
            toInteger(t.effectif_candidats_terminal_technologique_proposition_admission) AS effectif_candidats_terminal_technologique_proposition_admission,
            toInteger(t.effectif_boursiers_terminal_generale_professionnelle_proposition_admission) AS effectif_boursiers_terminal_generale_professionnelle_proposition_admission,
            toInteger(t.effectif_boursiers_terminal_generale_proposition_admission) AS effectif_boursiers_terminal_generale_proposition_admission,
            toInteger(t.effectif_candidats_terminal_professionnelle_proposition_admission) AS effectif_candidats_terminal_professionnelle_proposition_admission,
            toInteger(t.effectif_boursiers_terminal_technologique_proposition_admission) AS effectif_boursiers_terminal_technologique_proposition_admission,

            toInteger(b.effectif_neo_bacheliers_generaux_phase_principale) AS effectif_neo_bacheliers_generaux_phase_principale,
            toInteger(b.effectif_neo_bacheliers_technologiques_phase_principale) AS effectif_neo_bacheliers_technologiques_phase_principale,
            toInteger(b.effectif_neo_bacheliers_professionnels_phase_principale) AS effectif_neo_bacheliers_professionnels_phase_principale,
            toInteger(b.effectif_boursiers_professionnels_phase_principale) AS effectif_boursiers_professionnels_phase_principale,
            toInteger(b.effectif_autres_candidats_phase_principale) AS effectif_autres_candidats_phase_principale,
            toInteger(b.effectif_boursiers_generaux_phase_principale) AS effectif_boursiers_generaux_phase_principale,
            toInteger(b.effectif_boursiers_technologiques_phase_principale) AS effectif_boursiers_technologiques_phase_principale,


            


            toInteger(cp.effectif_neo_bacheliers_technologiques_phase_complementaire) AS effectif_neo_bacheliers_technologiques_phase_complementaire,
            toInteger(cp.effectif_neo_bacheliers_generaux_phase_complementaire) AS effectif_neo_bacheliers_generaux_phase_complementaire,
            toInteger(cp.effectif_total_candidats_phase_complementaire) AS effectif_total_candidats_phase_complementaire,

            
            
             

            toInteger(a.effectif_admis_proposition_avant_fin_procedure_principale) AS effectif_admis_proposition_avant_fin_procedure_principale,
            toInteger(a.effectif_neo_bacheliers_mention_bien_bac_admis) AS effectif_neo_bacheliers_mention_bien_bac_admis,
            toInteger(a.effectif_candidates_admises) AS effectif_candidates_admises,
            toInteger(a.effectif_neo_bacheliers_mention_assez_bien_bac_admis) AS effectif_neo_bacheliers_mention_assez_bien_bac_admis,
            toInteger(a.effectif_admis_phase_principale) AS effectif_admis_phase_principale,
            toInteger(a.effectif_total_candidats_proposition_admission) AS effectif_total_candidats_proposition_admission,
            toInteger(a.effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis) AS effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis,
            toInteger(a.effectif_neo_bacheliers_sans_mention_bac_admis) AS effectif_neo_bacheliers_sans_mention_bac_admis,
            toInteger(a.effectif_generaux_admis) AS effectif_generaux_admis,
            toInteger(a.effectif_admises_meme_etablissement_bts_cpge) AS effectif_admises_meme_etablissement_bts_cpge,
            toInteger(a.effectif_total_candidats_admis) AS effectif_total_candidats_admis,
            toInteger(a.effectif_technologiques_mention_bac_admis) AS effectif_technologiques_mention_bac_admis,
            toInteger(a.effectif_neo_bacheliers_admis) AS effectif_neo_bacheliers_admis,
            toInteger(a.effectif_professionnels_mention_bac_admis) AS effectif_professionnels_mention_bac_admis,
            toInteger(a.effectif_professionnels_admis) AS effectif_professionnels_admis,
            toInteger(a.effectif_autres_admis) AS effectif_autres_admis,
            toInteger(a.effectif_boursiers_admis) AS effectif_boursiers_admis,
            toInteger(a.effectif_admis_meme_academie) AS effectif_admis_meme_academie,
            toInteger(a.effectif_admis_meme_etablissement_bts_cpge) AS effectif_admis_meme_etablissement_bts_cpge,
            toInteger(a.effectif_admis_proposition_ouverture_phase_principale) AS effectif_admis_proposition_ouverture_phase_principale,
            toInteger(a.effectif_admis_phase_complementaire)    AS effectif_admis_phase_complementaire,
            toInteger(a.effectif_neo_bacheliers_mention_tres_bien_bac_admis) AS effectif_neo_bacheliers_mention_tres_bien_bac_admis,
            toInteger(a.effectif_admis_meme_academie_paris_creteil_versailles) AS effectif_admis_meme_academie_paris_creteil_versailles,
            toInteger(a.effectif_admis_proposition_avant_baccalaureat) AS effectif_admis_proposition_avant_baccalaureat,
            toInteger(a.effectif_generaux_mention_bac_admis) AS effectif_generaux_mention_bac_admis,
            toInteger(a.effectif_technologiques_admis) AS effectif_technologiques_admis


            
        """
        try:
              # Récupère le driver Neo4j
           db = Neo4JDriver.get_driver()
           print(f"Connexion à Neo4j établie : {db}")

           with db.session() as session:
                  # Log des paramètres envoyés à la requête
                print(f"Exécution de la requête avec etablissementIDs={etablissementIDs} et anneeactuelle={anneeactuelle}")
                results = session.run(query, etablissementIDs=etablissementIDs, anneeactuelle=anneeactuelle)
                records = [record.data() for record in results]

                # Log du résultat obtenu
                print(f"Résultats de la requête : {records}")

                # Vérifie que chaque résultat est un dictionnaire
                if not all(isinstance(r, dict) for r in records):
                    raise ValueError("Les données retournées ne sont pas valides (doivent être des dictionnaires).")

                return records

        except ValueError as ve:
            print(f"Erreur de données : {ve}")
            return []
        except Exception as e:
            import traceback
            print(f"Erreur dans get_comp_etablissements: {e}")
            print(traceback.format_exc())
            return []




   






   














  

    @staticmethod
    def get_comp_universite(nomuniversites: List[str], anneesActuelles: List[str]) -> List[Dict[str, Any]]:
        query = """
        UNWIND $anneesActuelles AS annee_cible
        MATCH (e:Etablissement)
        WHERE ANY(nom IN $nomuniversites WHERE e.etablissement CONTAINS nom)
        OPTIONAL MATCH (s:Session {annee: annee_cible})-[:HAS_ETABLISSEMENT]->(e)
        
        // Relations avec filtrage par année
        OPTIONAL MATCH (e)-[r_offers:OFFERS]->(f:Filiere)
        WHERE r_offers.annee = annee_cible OR r_offers.annee IS NULL
        
        OPTIONAL MATCH (e)-[r_taux:HAS_TAUX_ACCES]->(cl:ClassementRang)
        WHERE r_taux.annee = annee_cible OR r_taux.annee IS NULL
        
        OPTIONAL MATCH (e)-[r_cand:HAS_CANDIDAT]->(c:Candidat)
        WHERE r_cand.annee = annee_cible OR r_cand.annee IS NULL
        
        OPTIONAL MATCH (c)-[r_bach:HAS_BACHELIER]->(b:Bachelier)
        WHERE r_bach.annee = annee_cible OR r_bach.annee IS NULL
        
        OPTIONAL MATCH (e)-[r_adm:HAS_ADMISSION]->(a:Admission)
        WHERE r_adm.annee = annee_cible OR r_adm.annee IS NULL
        
        OPTIONAL MATCH (e)-[r_prop:HAS_PROPORTION]->(p:Proportion)
        WHERE r_prop.annee = annee_cible OR r_prop.annee IS NULL
        
        OPTIONAL MATCH (e)-[r_term:HAS_TERMINAL]->(t:Terminal)
        WHERE r_term.annee = annee_cible OR r_term.annee IS NULL
        
        OPTIONAL MATCH (e)-[r_comp:HAS_COMPLEMENTAIRE]->(cp:Complementaire)
        WHERE r_comp.annee = annee_cible OR r_comp.annee IS NULL
        
        WITH 
            split(e.etablissement, " - ")[0] AS universite_principale,
            annee_cible AS annee,
            COUNT(DISTINCT f) AS nombre_filieres,
            COALESCE(SUM(toInteger(f.capacite_etablissement_formation)), 0) AS capacite_etablissement_formation,
            COALESCE(ROUND(AVG(toInteger(cl.taux_acces)), 2), 0) AS taux_acces,
            COALESCE(MAX(toInteger(cl.rang_dernier_appele_groupe_3)), 0) AS rang_dernier_appele_groupe_3,
            COALESCE(MAX(toInteger(cl.rang_dernier_appele_groupe_2)), 0) AS rang_dernier_appele_groupe_2,
            COALESCE(MAX(toInteger(cl.rang_dernier_appele_groupe_1)), 0) AS rang_dernier_appele_groupe_1,
            COALESCE(AVG(toInteger(cl.part_terminales_generales_position_recevoir_proposition_phase_principale)), 0) AS part_terminales_generales,
            COALESCE(AVG(toInteger(cl.part_terminales_technologiques_position_recevoir_proposition_phase_principale)), 0) AS part_terminales_technologiques,
            COALESCE(AVG(toInteger(cl.part_terminales_professionnelles_position_recevoir_proposition_phase_principale)), 0) AS part_terminales_professionnelles,
            COALESCE(SUM(toInteger(c.effectif_total_candidats_formation)), 0) AS effectif_total_candidats_formation,
            COALESCE(SUM(toInteger(c.effectif_total_candidats_phase_principale)), 0) AS effectif_total_candidats_phase_principale,
            COALESCE(SUM(toInteger(c.effectif_candidates_formation)), 0) AS effectif_candidates_formation,
            COALESCE(AVG(toInteger(p.proportion_neo_bacheliers_meme_etablissement_bts_cpge)), 0) AS proportion_neo_bacheliers_meme_etablissement,
            COALESCE(AVG(toInteger(p.proportion_technologiques_admis_mention)), 0) AS proportion_technologiques_admis_mention,
            COALESCE(AVG(toInteger(p.proportion_neo_bacheliers_meme_academie)), 0) AS proportion_neo_bacheliers_meme_academie,
            COALESCE(AVG(toInteger(p.proportion_neo_bacheliers_admis)), 0) AS proportion_neo_bacheliers_admis,
            COALESCE(AVG(toInteger(p.proportion_neo_bacheliers_sans_mention_bac_admis)), 0) AS proportion_neo_bacheliers_sans_mention,
            COALESCE(AVG(toInteger(p.proportion_professionnels_admis_mention)), 0) AS proportion_professionnels_admis_mention,
            COALESCE(AVG(toInteger(p.proportion_neo_bacheliers_boursiers)), 0) AS proportion_neo_bacheliers_boursiers,
            COALESCE(SUM(toInteger(t.effectif_candidats_terminal_technologique_proposition_admission)), 0) AS effectif_terminal_technologique,
            COALESCE(SUM(toInteger(t.effectif_boursiers_terminal_generale_professionnelle_proposition_admission)), 0) AS effectif_boursiers_terminal_generale_pro,
            COALESCE(SUM(toInteger(t.effectif_boursiers_terminal_generale_proposition_admission)), 0) AS effectif_boursiers_terminal_generale,
            COALESCE(SUM(toInteger(t.effectif_candidats_terminal_professionnelle_proposition_admission)), 0) AS effectif_terminal_professionnelle,
            COALESCE(SUM(toInteger(t.effectif_boursiers_terminal_technologique_proposition_admission)), 0) AS effectif_boursiers_terminal_technologique,
            COALESCE(SUM(toInteger(b.effectif_neo_bacheliers_generaux_phase_principale)), 0) AS effectif_neo_bacheliers_generaux,
            COALESCE(SUM(toInteger(b.effectif_neo_bacheliers_technologiques_phase_principale)), 0) AS effectif_neo_bacheliers_technologiques,
            COALESCE(SUM(toInteger(b.effectif_neo_bacheliers_professionnels_phase_principale)), 0) AS effectif_neo_bacheliers_professionnels,
            COALESCE(SUM(toInteger(b.effectif_boursiers_professionnels_phase_principale)), 0) AS effectif_boursiers_professionnels,
            COALESCE(SUM(toInteger(b.effectif_autres_candidats_phase_principale)), 0) AS effectif_autres_candidats,
            COALESCE(SUM(toInteger(b.effectif_boursiers_generaux_phase_principale)), 0) AS effectif_boursiers_generaux,
            COALESCE(SUM(toInteger(b.effectif_boursiers_technologiques_phase_principale)), 0) AS effectif_boursiers_technologiques,
            COALESCE(SUM(toInteger(cp.effectif_neo_bacheliers_technologiques_phase_complementaire)), 0) AS effectif_neo_bacheliers_technologiques_complementaire,
            COALESCE(SUM(toInteger(cp.effectif_neo_bacheliers_generaux_phase_complementaire)), 0) AS effectif_neo_bacheliers_generaux_complementaire,
            COALESCE(SUM(toInteger(cp.effectif_total_candidats_phase_complementaire)), 0) AS effectif_total_candidats_complementaire,
            COALESCE(SUM(toInteger(a.effectif_admis_proposition_avant_fin_procedure_principale)), 0) AS effectif_admis_avant_fin_procedure,
            COALESCE(SUM(toInteger(a.effectif_neo_bacheliers_mention_bien_bac_admis)), 0) AS effectif_neo_bacheliers_mention_bien,
            COALESCE(SUM(toInteger(a.effectif_candidates_admises)), 0) AS effectif_candidates_admises,
            COALESCE(SUM(toInteger(a.effectif_neo_bacheliers_mention_assez_bien_bac_admis)), 0) AS effectif_neo_bacheliers_mention_assez_bien,
            COALESCE(SUM(toInteger(a.effectif_admis_phase_principale)), 0) AS effectif_admis_phase_principale,
            COALESCE(SUM(toInteger(a.effectif_total_candidats_proposition_admission)), 0) AS effectif_total_proposition_admission,
            COALESCE(SUM(toInteger(a.effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis)), 0) AS effectif_neo_bacheliers_mention_tres_bien,
            COALESCE(SUM(toInteger(a.effectif_neo_bacheliers_sans_mention_bac_admis)), 0) AS effectif_neo_bacheliers_sans_mention,
            COALESCE(SUM(toInteger(a.effectif_generaux_admis)), 0) AS effectif_generaux_admis,
            COALESCE(SUM(toInteger(a.effectif_admises_meme_etablissement_bts_cpge)), 0) AS effectif_admises_meme_etablissement,
            COALESCE(SUM(toInteger(a.effectif_total_candidats_admis)), 0) AS effectif_total_admis,
            COALESCE(SUM(toInteger(a.effectif_technologiques_mention_bac_admis)), 0) AS effectif_technologiques_mention_admis,
            COALESCE(SUM(toInteger(a.effectif_neo_bacheliers_admis)), 0) AS effectif_neo_bacheliers_admis,
            COALESCE(SUM(toInteger(a.effectif_professionnels_mention_bac_admis)), 0) AS effectif_professionnels_mention_admis,
            COALESCE(SUM(toInteger(a.effectif_professionnels_admis)), 0) AS effectif_professionnels_admis,
            COALESCE(SUM(toInteger(a.effectif_autres_admis)), 0) AS effectif_autres_admis,
            COALESCE(SUM(toInteger(a.effectif_boursiers_admis)), 0) AS effectif_boursiers_admis,
            COALESCE(SUM(toInteger(a.effectif_admis_meme_academie)), 0) AS effectif_admis_meme_academie,
            COALESCE(SUM(toInteger(a.effectif_admis_meme_etablissement_bts_cpge)), 0) AS effectif_admis_meme_etablissement,
            COALESCE(SUM(toInteger(a.effectif_admis_proposition_ouverture_phase_principale)), 0) AS effectif_admis_ouverture_phase_principale,
            COALESCE(SUM(toInteger(a.effectif_admis_phase_complementaire)), 0) AS effectif_admis_phase_complementaire,
            COALESCE(SUM(toInteger(a.effectif_neo_bacheliers_mention_tres_bien_bac_admis)), 0) AS effectif_neo_bacheliers_mention_tres_bien_bac,
            COALESCE(SUM(toInteger(a.effectif_admis_meme_academie_paris_creteil_versailles)), 0) AS effectif_admis_meme_academie_paris,
            COALESCE(SUM(toInteger(a.effectif_admis_proposition_avant_baccalaureat)), 0) AS effectif_admis_avant_bac,
            COALESCE(SUM(toInteger(a.effectif_generaux_mention_bac_admis)), 0) AS effectif_generaux_mention_admis,
            COALESCE(SUM(toInteger(a.effectif_technologiques_admis)), 0) AS effectif_technologiques_admis
            
        RETURN 
            universite_principale AS etablissement,
            nombre_filieres,
            annee,
            capacite_etablissement_formation,
            taux_acces,
            rang_dernier_appele_groupe_3,
            rang_dernier_appele_groupe_2,
            rang_dernier_appele_groupe_1,
            part_terminales_generales,
            part_terminales_technologiques,
            part_terminales_professionnelles,
            effectif_total_candidats_formation,
            effectif_total_candidats_phase_principale,
            effectif_candidates_formation,
            proportion_neo_bacheliers_meme_etablissement,
            proportion_technologiques_admis_mention,
            proportion_neo_bacheliers_meme_academie,
            proportion_neo_bacheliers_admis,
            proportion_neo_bacheliers_sans_mention,
            proportion_professionnels_admis_mention,
            proportion_neo_bacheliers_boursiers,
            effectif_terminal_technologique,
            effectif_boursiers_terminal_generale_pro,
            effectif_boursiers_terminal_generale,
            effectif_terminal_professionnelle,
            effectif_boursiers_terminal_technologique,
            effectif_neo_bacheliers_generaux,
            effectif_neo_bacheliers_technologiques,
            effectif_neo_bacheliers_professionnels,
            effectif_boursiers_professionnels,
            effectif_autres_candidats,
            effectif_boursiers_generaux,
            effectif_boursiers_technologiques,
            effectif_neo_bacheliers_technologiques_complementaire,
            effectif_neo_bacheliers_generaux_complementaire,
            effectif_total_candidats_complementaire,
            effectif_admis_avant_fin_procedure,
            effectif_neo_bacheliers_mention_bien,
            effectif_candidates_admises,
            effectif_neo_bacheliers_mention_assez_bien,
            effectif_admis_phase_principale,
            effectif_total_proposition_admission,
            effectif_neo_bacheliers_mention_tres_bien,
            effectif_neo_bacheliers_sans_mention,
            effectif_generaux_admis,
            effectif_admises_meme_etablissement,
            effectif_total_admis,
            effectif_technologiques_mention_admis,
            effectif_neo_bacheliers_admis,
            effectif_professionnels_mention_admis,
            effectif_professionnels_admis,
            effectif_autres_admis,
            effectif_boursiers_admis,
            effectif_admis_meme_academie,
            effectif_admis_meme_etablissement,
            effectif_admis_ouverture_phase_principale,
            effectif_admis_phase_complementaire,
            effectif_neo_bacheliers_mention_tres_bien_bac,
            effectif_admis_meme_academie_paris,
            effectif_admis_avant_bac,
            effectif_generaux_mention_admis,
            effectif_technologiques_admis
        ORDER BY etablissement, annee
        """
        
        try:
            db = Neo4JDriver.get_driver()
            with db.session() as session:
                # Test debug
                test_query = """
                MATCH (e:Etablissement)
                WHERE ANY(nom IN $nomuniversites WHERE e.etablissement CONTAINS nom)
                MATCH (s:Session {annee: "2020"})-[:HAS_ETABLISSEMENT]->(e)
                OPTIONAL MATCH (e)-[r:OFFERS]->(f:Filiere)
                RETURN 
                    e.etablissement AS nom, 
                    count(f) AS nb_filieres,
                    sum(COALESCE(toInteger(f.capacite_etablissement_formation), 0)) AS capacite_totale
                ORDER BY nb_filieres DESC
                LIMIT 5
                """
                
                test_results = session.run(test_query, {"nomuniversites": nomuniversites})
                print("=== DEBUG 2020 ===")
                for record in test_results:
                    print(f"{record['nom']} - {record['nb_filieres']} filières - Capacité: {record['capacite_totale']}")
                
                # Exécution principale
                results = session.run(query, {
                    "nomuniversites": nomuniversites,
                    "anneesActuelles": anneesActuelles
                })
                
                records = []
                for record in results:
                    data = record.data()
                    # Conversion des None en 0 pour tous les champs numériques
                    for key in data:
                        if isinstance(data[key], (int, float)) or any(k in key for k in ['effectif', 'proportion', 'taux', 'capacite', 'rang']):
                            data[key] = data[key] if data[key] is not None else 0
                    records.append(data)
                
                return records

        except Exception as e:
            print(f"Erreur dans get_comp_universite: {str(e)}")
            traceback.print_exc()
            return []     