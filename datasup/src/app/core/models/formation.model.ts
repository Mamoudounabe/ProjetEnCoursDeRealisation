export class Formation {
    id: string;
    session: string;
    statut: string;
    code_uai_formation: string;

    etablissement: string;
    code_departement_etablissement: string;
    departement: string;
    region_etablissement: string;
    commune_etablissement?: string;
   
    coordonnees_gps: string;

    academie_etablissement: string;

    selectivite: string;

    filiere?: string; // filiere_detaile
    filiere_formation?: string;
    filiere_formation_detaillee?: string;
    filiere_formation_tres_agregee?: string;
    filiere_formation_tres_detailee?: string; // attention avec un seul L
    lien_parcoursup?: string;

    nb_places_formation?: string;
    nb_candidats_formation?: string; 
    nb_candidates_formation?: string;

    nb_candidats_p1?: string;
    nb_candidats_neo_bac_generaux_p1?: string;
    nb_candidats_neo_bac_techno_p1?: string;
    nb_candidats_neo_bac_pro_p1?: string;

    nb_candidats_boursiers_bac_generaux_p1?: string;
    nb_candidats_boursiers_bac_techno_p1?: string;
    nb_candidats_boursiers_bac_pro_p1?: string;

    nb_autres_candidats_p1?: string;
    
    nb_candidats_p2?: string;
    nb_candidats_neo_bac_generaux_p2?: string;
    nb_candidats_neo_bac_techno_p2?: string;
    nb_candidats_neo_bac_pro_p2?: string;

    nb_candidats_boursiers_bac_generaux_p2?: string;
    nb_candidats_boursiers_bac_techno_p2?: string;
    nb_candidats_boursiers_bac_pro_p2?: string;

    nb_autres_candidats_p2?: string;

    nb_total_candidats_proposition_admission?: string;  
    nb_total_candidats_admis?: string;
    nb_total_candidates_admises?: string;

    nb_total_admis_p1?: string;
    nb_total_admis_p2?: string;

    nb_total_proposition_admission_ouverture?: string; // proposition d'admission dès l'ouverture de parcoursup

    nb_total_proposition_admission_avant_bac?: string;

    nb_total_proposition_admission_avant_fin_p1?: string;

    nb_total_boursiers_admis?: string;
    
    nb_total_neo_bac_admis?: string;
    nb_bac_g_admis?: string;
    nb_bac_techno_admis?: string;
    nb_bac_pro_admis?: string;
    nb_autres_admis?: string;

    nb_neo_bac_admis_mention_inconnue?: string;
    nb_neo_bac_admis_sans_mention?: string;
    nb_neo_bac_admis_mention_assez_bien?: string;
    nb_neo_bac_admis_mention_bien?: string;
    nb_neo_bac_admis_mention_tres_bien?: string;

    nb_admis_meme_academie?: string;

    proportion_admis_proposition_ouverture_p1?: string;
    proportion_admis_avant_bac?: string;
    proportion_admis_avan_fin_p1?: string;
    proportion_admis_fille?: string;
    proportion_neo_bac_meme_academie?: string;
    proportion_neo_bac_boursiers?: string;

    proportion_admis_bac_g_avec_mention?: string;
    proportion_admis_bac_techno_avec_mention?: string;
    proportion_admis_bac_pro_avec_mention?: string;

    constructor(
        id: string,
        session: string,
        statut: string,
        code_uai_formation: string,
        etablissement: string,
        code_departement_etablissement: string,
        departement: string,
        region_etablissement: string,
        coordonnees_gps: string,
        academie_etablissement: string,
        selectivite: string,
        filiere?: string,
        filiere_formation?: string,
        filiere_formation_detaillee?: string,
        filiere_formation_tres_agregee?: string,
        filiere_formation_tres_detailee?: string,
        lien_parcoursup?: string,
        nb_places_formation?: string,
        nb_candidats_formation?: string,
        nb_candidates_formation?: string,
        nb_candidats_p1?: string,
        nb_candidats_neo_bac_generaux_p1?: string,
        nb_candidats_neo_bac_techno_p1?: string,
        nb_candidats_neo_bac_pro_p1?: string,
        nb_candidats_boursiers_bac_generaux_p1?: string,
        nb_candidats_boursiers_bac_techno_p1?: string,
        nb_candidats_boursiers_bac_pro_p1?: string,
        nb_autres_candidats_p1?: string,
        nb_candidats_p2?: string,
        nb_candidats_neo_bac_generaux_p2?: string,
        nb_candidats_neo_bac_techno_p2?: string,
        nb_candidats_neo_bac_pro_p2?: string,
        nb_candidats_boursiers_bac_generaux_p2?: string,
        nb_candidats_boursiers_bac_techno_p2?: string,
        nb_candidats_boursiers_bac_pro_p2?: string,
        nb_autres_candidats_p2?: string,
        nb_total_candidats_proposition_admission?: string,
        nb_total_candidats_admis?: string,
        nb_total_candidates_admises?: string,
        nb_total_admis_p1?: string,
        nb_total_admis_p2?: string,
        nb_total_proposition_admission_ouverture?: string,
        nb_total_proposition_admission_avant_bac?: string,
        nb_total_proposition_admission_avant_fin_p1?: string,
        nb_total_boursiers_admis?: string,
        nb_total_neo_bac_admis?: string,
        nb_bac_g_admis?: string,
        nb_bac_techno_admis?: string,
        nb_bac_pro_admis?: string,
        nb_autres_admis?: string,
        nb_neo_bac_admis_mention_inconnue?: string,
        nb_neo_bac_admis_sans_mention?: string,
        nb_neo_bac_admis_mention_assez_bien?: string,
        nb_neo_bac_admis_mention_bien?: string,
        nb_neo_bac_admis_mention_tres_bien?: string,
        nb_admis_meme_academie?: string,
        proportion_admis_proposition_ouverture_p1?: string,
        proportion_admis_avant_bac?: string,
        proportion_admis_avan_fin_p1?: string,
        proportion_admis_fille?: string,
        proportion_neo_bac_meme_academie?: string,
        proportion_neo_bac_boursiers?: string,
        proportion_admis_bac_g_avec_mention?: string,
        proportion_admis_bac_techno_avec_mention?: string,
        proportion_admis_bac_pro_avec_mention?: string
    ) {
        this.id = id;
        this.session = session;
        this.statut = statut;
        this.code_uai_formation = code_uai_formation;
        this.etablissement = etablissement;
        this.code_departement_etablissement = code_departement_etablissement;
        this.departement = departement;
        this.region_etablissement = region_etablissement;
        this.coordonnees_gps = coordonnees_gps;
        this.academie_etablissement = academie_etablissement;
        this.selectivite = selectivite;

        this.filiere = filiere;
        this.filiere_formation = filiere_formation;
        this.filiere_formation_detaillee = filiere_formation_detaillee;
        this.filiere_formation_tres_agregee = filiere_formation_tres_agregee;
        this.filiere_formation_tres_detailee = filiere_formation_tres_detailee;
        this.lien_parcoursup = lien_parcoursup;
        this.nb_places_formation = nb_places_formation;
        this.nb_candidats_formation = nb_candidats_formation;
        this.nb_candidates_formation = nb_candidates_formation;
        this.nb_candidats_p1 = nb_candidats_p1;
        this.nb_candidats_neo_bac_generaux_p1 = nb_candidats_neo_bac_generaux_p1;
        this.nb_candidats_neo_bac_techno_p1 = nb_candidats_neo_bac_techno_p1;
        this.nb_candidats_neo_bac_pro_p1 = nb_candidats_neo_bac_pro_p1;
        this.nb_candidats_boursiers_bac_generaux_p1 = nb_candidats_boursiers_bac_generaux_p1;
        this.nb_candidats_boursiers_bac_techno_p1 = nb_candidats_boursiers_bac_techno_p1;
        this.nb_candidats_boursiers_bac_pro_p1 = nb_candidats_boursiers_bac_pro_p1;
        this.nb_autres_candidats_p1 = nb_autres_candidats_p1;
        this.nb_candidats_p2 = nb_candidats_p2;
        this.nb_candidats_neo_bac_generaux_p2 = nb_candidats_neo_bac_generaux_p2;
        this.nb_candidats_neo_bac_techno_p2 = nb_candidats_neo_bac_techno_p2;
        this.nb_candidats_neo_bac_pro_p2 = nb_candidats_neo_bac_pro_p2;
        this.nb_candidats_boursiers_bac_generaux_p2 = nb_candidats_boursiers_bac_generaux_p2;
        this.nb_candidats_boursiers_bac_techno_p2 = nb_candidats_boursiers_bac_techno_p2;
        this.nb_candidats_boursiers_bac_pro_p2 = nb_candidats_boursiers_bac_pro_p2;
        this.nb_autres_candidats_p2 = nb_autres_candidats_p2;
        this.nb_total_candidats_proposition_admission = nb_total_candidats_proposition_admission;
        this.nb_total_candidats_admis = nb_total_candidats_admis;
        this.nb_total_candidates_admises = nb_total_candidates_admises;
        this.nb_total_admis_p1 = nb_total_admis_p1;
        this.nb_total_admis_p2 = nb_total_admis_p2;
        this.nb_total_proposition_admission_ouverture = nb_total_proposition_admission_ouverture;
        this.nb_total_proposition_admission_avant_bac = nb_total_proposition_admission_avant_bac;
        this.nb_total_proposition_admission_avant_fin_p1 = nb_total_proposition_admission_avant_fin_p1;
        this.nb_total_boursiers_admis = nb_total_boursiers_admis;
        this.nb_total_neo_bac_admis = nb_total_neo_bac_admis;
        this.nb_bac_g_admis = nb_bac_g_admis;
        this.nb_bac_techno_admis = nb_bac_techno_admis;
        this.nb_bac_pro_admis = nb_bac_pro_admis;
        this.nb_autres_admis = nb_autres_admis;
        this.nb_neo_bac_admis_mention_inconnue = nb_neo_bac_admis_mention_inconnue;
        this.nb_neo_bac_admis_sans_mention = nb_neo_bac_admis_sans_mention;
        this.nb_neo_bac_admis_mention_assez_bien = nb_neo_bac_admis_mention_assez_bien;
        this.nb_neo_bac_admis_mention_bien = nb_neo_bac_admis_mention_bien;
        this.nb_neo_bac_admis_mention_tres_bien = nb_neo_bac_admis_mention_tres_bien;
        this.nb_admis_meme_academie = nb_admis_meme_academie;
        this.proportion_admis_proposition_ouverture_p1 = proportion_admis_proposition_ouverture_p1;
        this.proportion_admis_avant_bac = proportion_admis_avant_bac;
        this.proportion_admis_avan_fin_p1 = proportion_admis_avan_fin_p1;
        this.proportion_admis_fille = proportion_admis_fille;
        this.proportion_neo_bac_meme_academie = proportion_neo_bac_meme_academie;
        this.proportion_neo_bac_boursiers = proportion_neo_bac_boursiers;
        this.proportion_admis_bac_g_avec_mention = proportion_admis_bac_g_avec_mention;
        this.proportion_admis_bac_techno_avec_mention = proportion_admis_bac_techno_avec_mention;
        this.proportion_admis_bac_pro_avec_mention = proportion_admis_bac_pro_avec_mention;
    }


    
}
