class Neo4jLoader:
    """
    Classe pour charger les données dans Neo4j.
    """

    def __init__(self, uri, user, password, database):
        self.driver = GraphDatabase.driver(uri, auth=(user, password), database=database)

    def close(self):
        self.driver.close()

    def create_node(self, node_label, node_properties):
        query = f"""
        CREATE (n:{node_label} $properties)
        """
        with self.driver.session() as session:
            session.run(query, properties=node_properties)
            print(f"Noeud {node_label} avec les propriétés {node_properties} créé avec succès.")

    def load_csv(self, file_path, year):
        query = """
        LOAD CSV WITH HEADERS FROM $file AS r FIELDTERMINATOR ';'
CALL {
  WITH r
  WITH r, 
       CASE WHEN toLower(r.etablissement) STARTS WITH 'université' THEN 'université' ELSE 'autre' END AS type
  MATCH (s:Session {annee: $year})
  CREATE (e:Etablissement {
    statut_etablissement_filiere: r.statut_etablissement_filiere,
    code_uai_etablissement: r.code_uai_etablissement,
    etablissement: r.etablissement,
    type: type,
    code_departement_etablissement: r.code_departement_etablissement,
    departement_etablissement: r.departement_etablissement,
    region_etablissement: r.region_etablissement,
    academie_etablissement: r.academie_etablissement,
    commune_etablissement: r.commune_etablissement,
    coordonnees_gps_formation: r.coordonnees_gps_de_la_formation,
    etablissement_id_paysage: r.etablissement_id_paysage,
    composante_id_paysage: r.composante_id_paysage
  })
  

            (f:Filiere {
                filiere_formation: r.filiere_formation,
                selectivite: r.selectivite,
                filiere_formation_tres_agregee: r.filiere_formation_tres_agregee,
                filiere_formation_detaillee: r.filiere_formation_detaillee,
                filiere_formation_1: r.filiere_formation_1,
                filiere_formation_taille_bis: r.filiere_formation_taille_bis,
                filiere_formation_tres_detaillee: r.filiere_formation_tres_detaillee,
                concours_communs_banque_epreuves: r.concours_communs_et_banque_d_epreuves,
                capacite_etablissement_formation: r.capacite_de_l_etablissement_par_formation,
                cod_aff_form: r.cod_aff_form,
                lien_parcoursup: r.lien_de_la_formation_sur_la_plateforme_parcoursup
            }),
            (c:Candidat {
                effectif_total_candidats_formation: r.effectif_total_des_candidats_pour_une_formation,
                effectif_candidates_formation: r.dont_effectif_des_candidates_pour_une_formation,
                effectif_total_candidats_phase_principale: r.effectif_total_des_candidats_en_phase_principale,
                effectif_candidats_internat_phase_principale: r.dont_effectif_des_candidats_ayant_postule_en_internat
            }),
            (b:Bachelier {
                effectif_neo_bacheliers_generaux_phase_principale: r.effectif_des_candidats_neo_bacheliers_generaux_en_phase_principale,
                effectif_boursiers_generaux_phase_principale: r.dont_effectif_des_candidats_boursiers_neo_bacheliers_generaux_en_phase_principale,
                effectif_neo_bacheliers_technologiques_phase_principale: r.effectif_des_candidats_neo_bacheliers_technologiques_en_phase_principale,
                effectif_boursiers_technologiques_phase_principale: r.dont_effectif_des_candidats_boursiers_neo_bacheliers_technologiques_en_phase_principale,
                effectif_neo_bacheliers_professionnels_phase_principale: r.effectif_des_candidats_neo_bacheliers_professionnels_en_phase_principale,
                effectif_boursiers_professionnels_phase_principale: r.dont_effectif_des_candidats_boursiers_neo_bacheliers_professionnels_en_phase_principale,
                effectif_autres_candidats_phase_principale: r.effectif_des_autres_candidats_en_phase_principale
            }),
            (complement:ComplementPhase {
                effectif_total_candidats_phase_complementaire: r.effectif_total_des_candidats_en_phase_complementaire,
                effectif_neo_bacheliers_generaux_phase_complementaire: r.effectif_des_candidats_neo_bacheliers_generaux_en_phase_complementaire,
                effectif_neo_bacheliers_technologiques_phase_complementaire: r.effectif_des_candidats_neo_bacheliers_technologique_en_phase_complementaire,
                effectif_neo_bacheliers_professionnels_phase_complementaire: r.effectif_des_candidats_neo_bacheliers_professionnels_en_phase_complementaire,
                effectif_autres_candidats_phase_complementaire: r.effectifs_des_autres_candidats_en_phase_complementaire
            }),
            (classement:Classement {
                effectif_total_candidats_classes_phase_principale: r.effectif_total_des_candidats_classes_par_l_etablissement_en_phase_principale,
                effectif_candidats_classes_phase_complementaire: r.effectif_des_candidats_classes_par_l_etablissement_en_phase_complementaire,
                effectif_candidats_classes_internat_cpge: r.effectif_des_candidats_classes_par_l_etablissement_en_internat_cpge,
                effectif_candidats_classes_hors_internat_cpge: r.effectif_des_candidats_classes_par_l_etablissement_hors_internat_cpge,
                effectif_neo_bacheliers_generaux_classes: r.effectif_des_candidats_neo_bacheliers_generaux_classes_par_l_etablissement,
                effectif_boursiers_generaux_classes: r.dont_effectif_des_candidats_boursiers_neo_bacheliers_generaux_classes_par_l_etablissement,
                effectif_neo_bacheliers_technologiques_classes: r.effectif_des_candidats_neo_bacheliers_technologiques_classes_par_l_etablissement,
                effectif_boursiers_technologiques_classes: r.dont_effectif_des_candidats_boursiers_neo_bacheliers_technologiques_classes_par_l_etablissement,
                effectif_neo_bacheliers_professionnels_classes: r.effectif_des_candidats_neo_bacheliers_professionnels_classes_par_l_etablissement,
                effectif_boursiers_professionnels_classes: r.dont_effectif_des_candidats_boursiers_neo_bacheliers_professionnels_classes_par_l_etablissement,
                effectif_autres_candidats_classes: r.effectif_des_autres_candidats_classes_par_l_etablissement
            }),
            (admission:Admission {
                effectif_total_candidats_proposition_admission: r.effectif_total_des_candidats_ayant_recu_une_proposition_d_admission_de_la_part_de_l_etablissement,
                effectif_total_candidats_admis: r.effectif_total_des_candidats_ayant_accepte_la_proposition_de_l_etablissement_admis,
                effectif_candidates_admises: r.dont_effectif_des_candidates_admises,
                effectif_admis_phase_principale: r.effectif_des_admis_en_phase_principale,
                effectif_admis_phase_complementaire: r.effectif_des_admis_en_phase_complementaire,
                effectif_admis_proposition_ouverture_phase_principale: r.dont_effectif_des_admis_ayant_recu_leur_proposition_d_admission_a_l_ouverture_de_la_procedure_principale,
                effectif_admis_proposition_avant_baccalaureat: r.dont_effectif_des_admis_ayant_recu_leur_proposition_d_admission_avant_le_baccalaureat,
                effectif_admis_proposition_avant_fin_procedure_principale: r.dont_effectif_des_admis_ayant_recu_leur_proposition_d_admission_avant_la_fin_de_la_procedure_principale,
                effectif_admis_internat: r.dont_effectif_des_admis_en_internat,
                effectif_boursiers_admis: r.dont_effectif_des_admis_boursiers_neo_bacheliers,
                effectif_neo_bacheliers_admis: r.effectif_des_admis_neo_bacheliers,
                effectif_generaux_admis: r.effectif_des_admis_neo_bacheliers_generaux,
                effectif_technologiques_admis: r.effectif_des_admis_neo_bacheliers_technologiques,
                effectif_professionnels_admis: r.effectif_des_admis_neo_bacheliers_professionnels,
                effectif_autres_admis: r.effectif_des_autres_candidats_admis,
                effectif_neo_bacheliers_sans_info_mention_bac_admis: r.dont_effectif_des_admis_neo_bacheliers_sans_information_sur_la_mention_au_bac,
                effectif_neo_bacheliers_sans_mention_bac_admis: r.dont_effectif_des_admis_neo_bacheliers_sans_mention_au_bac,
                effectif_neo_bacheliers_mention_assez_bien_bac_admis: r.dont_effectif_des_admis_neo_bacheliers_avec_mention_as_sez_bien_au_bac,
                effectif_neo_bacheliers_mention_bien_bac_admis: r.dont_effectif_des_admis_neo_bacheliers_avec_mention_bien_au_bac,
                effectif_neo_bacheliers_mention_tres_bien_bac_admis: r.dont_effectif_des_admis_neo_bacheliers_avec_mention_tres_bien_au_bac,
                effectif_neo_bacheliers_mention_tres_bien_felicitation_bac_admis: r.dont_effectif_des_admis_neo_bacheliers_avec_mention_tres_bien_avec_felicitation_au_bac,
                effectif_generaux_mention_bac_admis: r.effectif_des_admis_neo_bacheliers_generaux_ayant_eu_une_mention_au_bac,
                effectif_technologiques_mention_bac_admis: r.effectif_des_admis_neo_bacheliers_technologiques_ayant_eu_une_mention_au_bac,
                effectif_professionnels_mention_bac_admis: r.effectif_des_admis_neo_bacheliers_professionnels_ayant_eu_une_mention_au_bac,
                effectif_admis_meme_etablissement_bts_cpge: r.dont_effectif_des_admis_issus_du_meme_etablissement_bts_cpge,
                effectif_admises_meme_etablissement_bts_cpge: r.dont_effectif_des_admises_issues_du_meme_etablissement_bts_cpge,
                effectif_admis_meme_academie: r.dont_effectif_des_admis_issus_de_la_meme_academie,
                effectif_admis_meme_academie_paris_creteil_versailles: r.dont_effectif_des_admis_issus_de_la_meme_academie_paris_creteil_versailles_reunies
            }),
            (proportion:Proportion {
                proportion_admis_proposition_ouverture_phase_principale: r.proportion_d_admis_ayant_recu_leur_proposition_d_admission_a_l_ouverture_de_la_procedure_principale,
                proportion_admis_proposition_avant_baccalaureat: r.proportion_d_admis_ayant_recu_leur_proposition_d_admission_avant_le_baccalaureat,
                proportion_admis_proposition_avant_fin_procedure_principale: r.proportion_d_admis_ayant_recu_leur_proposition_d_admission_avant_la_fin_de_la_procedure_principale,
                proportion_admis_filles: r.proportion_d_admis_dont_filles,
                proportion_neo_bacheliers_meme_academie: r.proportion_d_admis_neo_bacheliers_issus_de_la_meme_academie,
                proportion_neo_bacheliers_meme_academie_paris_creteil_versailles: r.proportion_d_admis_neo_bacheliers_issus_de_la_meme_academie_paris_creteil_versailles_reunies,
                proportion_neo_bacheliers_meme_etablissement_bts_cpge: r.proportion_d_admis_neo_bacheliers_issus_du_meme_etablissement_bts_cpge,
                proportion_neo_bacheliers_boursiers: r.proportion_d_admis_neo_bacheliers_boursiers,
                proportion_neo_bacheliers_admis: r.proportion_d_admis_neo_bacheliers,
                proportion_neo_bacheliers_sans_info_mention_bac_admis: r.proportion_d_admis_neo_bacheliers_sans_information_sur_la_mention_au_bac,
                proportion_neo_bacheliers_sans_mention_bac_admis: r.proportion_d_admis_neo_bacheliers_sans_mention_au_bac,
                proportion_neo_bacheliers_mention_assez_bien_bac_admis: r.proportion_d_admis_neo_bacheliers_avec_mention_as_sez_bien_au_bac,
                proportion_neo_bacheliers_mention_bien_bac_admis: r.proportion_d_admis_neo_bacheliers_avec_mention_bien_au_bac,
                proportion_neo_bacheliers_mention_tres_bien_bac_admis: r.proportion_d_admis_neo_bacheliers_avec_mention_tres_bien_au_bac,
                proportion_neo_bacheliers_mention_tres_bien_felicitation_bac_admis: r.proportion_d_admis_neo_bacheliers_avec_mention_tres_bien_avec_felicitation_au_bac,
                proportion_generaux_admis_mention: r.dont_proportion_d_admis_avec_mention_bg,
                proportion_technologiques_admis_mention: r.dont_proportion_d_admis_avec_mention_bt,
                proportion_professionnels_admis_mention: r.dont_proportion_d_admis_avec_mention_bp
            }),
            (terminale:Terminale {
                effectif_candidats_terminal_generale_proposition_admission: r.effectif_des_candidats_en_terminal_generale_ayant_recu_une_proposition_d_admission_de_la_part_de_l_etablissement,
                effectif_boursiers_terminal_generale_proposition_admission: r.dont_effectif_des_candidats_boursiers_en_terminal_generale_ayant_recu_une_proposition_d_admission_de_la_part_de_l_etablissement,
                effectif_candidats_terminal_technologique_proposition_admission: r.effectif_des_candidats_en_terminal_technologique_ayant_recu_une_proposition_d_admission_de_la_part_de_l_etablissement,
                effectif_boursiers_terminal_technologique_proposition_admission: r.dont_effectif_des_candidats_boursiers_en_terminal_technologique_ayant_recu_une_proposition_d_admission_de_la_part_de_l_etablissement,
                effectif_candidats_terminal_professionnelle_proposition_admission: r.effectif_des_candidats_en_terminal_professionnelle_ayant_recu_une_proposition_d_admission_de_la_part_de_l_etablissement,
                effectif_boursiers_terminal_generale_professionnelle_proposition_admission: r.dont_effectif_des_candidats_boursiers_en_terminal_generale_professionnelle_ayant_recu_une_proposition_d_admission_de_la_part_de_l_etablissement
            }),
            (classement_rang:ClassementRang {
                regroupement_1_classement: r.regroupement_1_effectue_par_les_formations_pour_les_classements,
                rang_dernier_appele_groupe_1: r.rang_du_dernier_appele_du_groupe_1,
                regroupement_2_classement: r.regroupement_2_effectue_par_les_formations_pour_les_classements,
                rang_dernier_appele_groupe_2: r.rang_du_dernier_appele_du_groupe_2,
                regroupement_3_classement: r.regroupement_3_effectue_par_les_formations_pour_les_classements,
                rang_dernier_appele_groupe_3: r.rang_du_dernier_appele_du_groupe_3,
                taux_acces: r.taux_d_acces_des_candidats_ayant_postule_a_la_formation_ratio_entre_le_dernier_appele_et_le_nombre_voeux_pp,
                part_terminales_generales_position_recevoir_proposition_phase_principale: r.dont_taux_d_acces_des_candidats_ayant_un_bac_general_ayant_postule_a_la_formation,
                part_terminales_technologiques_position_recevoir_proposition_phase_principale: r.dont_taux_d_acces_des_candidats_ayant_un_bac_technologique_ayant_postule_a_la_formation,
                part_terminales_professionnelles_position_recevoir_proposition_phase_principale: r.dont_taux_d_acces_des_candidats_ayant_un_bac_professionnel_ayant_postule_a_la_formation
            }),
            (metadata:Metadata {
                list_com: r.list_com,
                tri: r.tri
            })
        
            MERGE (s)-[:HAS_ETABLISSEMENT]->(e)
            MERGE (e)-[:OFFERS]->(f)
            MERGE (e)-[:HAS_CANDIDAT]->(c)
            MERGE (c)-[:HAS_BACHELIER]->(b)
            MERGE (c)-[:HAS_COMPLEMENT_PHASE]->(complement)
            MERGE (e)-[:HAS_CLASSEMENT]->(classement)
            MERGE (e)-[:HAS_ADMISSION]->(admission)
            MERGE (admission)-[:HAS_PROPORTION]->(proportion)
            MERGE (admission)-[:HAS_TERMINALE]->(terminale)
            MERGE (e)-[:HAS_TAUX_ACCES]->(classement_rang)} IN TRANSACTIONS OF 10 ROWS
        """
        with self.driver.session() as session:
            session.run(query, file=f"file:///{file_path}", year=year)
            print(f"Fichier {file_path} chargé avec succès.")