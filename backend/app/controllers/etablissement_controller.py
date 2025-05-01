from typing import List
from fastapi import APIRouter, Query , HTTPException, Path
from fastapi.responses import JSONResponse
from typing import List, Dict, Any

from ..managers.etablissement_manager import EtablissementManager

router = APIRouter()

@router.get("/etablissements/filiere", response_model=List[dict], tags=["Etablissement"])
def get_etablissement_by_filiere(type_filiere: str = Query(..., description="Type de filière à rechercher")):
    """
    Endpoint pour récupérer les établissements offrant une filière spécifique.
    """
    return EtablissementManager.get_etablissement_by_filiere(type_filiere)


@router.get("/etablissements/region", response_model=List[dict], tags=["Etablissement"])
def get_etablissement_by_region(region_name: str = Query(..., description="Nom de la région à rechercher")):
    """
    Endpoint pour récupérer les établissements situés dans une région spécifique.
    """
    return EtablissementManager.get_etablissement_by_region(region_name)


@router.get("/etablissements/popularite/capacite", response_model=List[dict], tags=["Etablissement"])
def get_etablissement_by_popularity_capacity():
    """
    Endpoint pour récupérer les établissements par capacité décroissante.
    """
    return EtablissementManager.get_etablissement_by_popularity_capacity()


@router.get("/etablissements/popularite/candidats", response_model=List[dict], tags=["Etablissement"])
def get_etablissement_by_popularity_candidates():
    """
    Endpoint pour récupérer les établissements par nombre total de candidats décroissant.
    """
    return EtablissementManager.get_etablissement_by_popularity_candidates()





""" @router.get("/filiere/etablissement/admission", response_model=List[dict], tags=["Etablissement"])
def get_filiere_etablissement_admission(page: int = Query(1, ge=1), page_size: int = Query(8, le=100)):
  
    try:
        result = EtablissementManager.get_filiere_etablissement_admission(page, page_size)
        return JSONResponse(content=result, headers={"Content-Type": "application/json; charset=utf-8"})
    except Exception as e:
        print(f"Error in get_filiere_etablissement_admission: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


 """



@router.get("/filiere/etablissement/admission", response_model=List[dict], tags=["Etablissement"])
def get_filiere_etablissement_admission(query: str, page: int = Query(1, ge=1), page_size: int = Query(8, le=100)):
    """
    Endpoint pour récupérer les établissements par nombre total de candidats décroissant avec pagination.
    """
    try:
        result = EtablissementManager.get_filiere_etablissement_admission(query=query,page=page, page_size=page_size)
        return JSONResponse(content=result, headers={"Content-Type": "application/json; charset=utf-8"})
    except Exception as e:
        print(f"Error in get_filiere_etablissement_admission: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")







@router.get("/Etablissement/Candidat/Bachelier/{etablissementID:path}", response_model=List[Dict[str, Any]], tags=["Etablissement"])
def get_etablissement_by_effectif(
    etablissementID: int = Path(..., description="ID de l'établissement (élément ID sous forme de chaîne)"),
    anneeactuelle: str = Query(..., description="Année de la session")
):
    """
    Endpoint pour récupérer les informations d'un établissement par ID et année de session.
    Retourne les effectifs des candidats et des bacheliers.
    """
    try:
        # Appelle la méthode statique de la classe EtablissementManager
        result = EtablissementManager.get_etablissement_by_effectif(etablissementID, anneeactuelle)

        # Si aucun résultat n'est trouvé, lève une exception 404
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Aucun établissement trouvé pour l'ID {etablissementID} et l'année {anneeactuelle}."
            )

        # Retourne les résultats au format JSON
        return JSONResponse(content=result, headers={"Content-Type": "application/json; charset=utf-8"})
    
    except HTTPException as http_err:
        raise http_err  # Lève l'erreur HTTP directement

    except Exception as e:
        print(f"Erreur dans get_etablissement_by_effectif: {e}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")








@router.get("/filiere/Candidat/Bachelier/{filiereID:path}", response_model=List[Dict[str, Any]], tags=["Etablissement"])
def get_filiere_by_details(
    filiereID: int = Path(..., description="ID de l'établissement (élément ID sous forme de chaîne)"),
    anneeactuelle: str = Query(..., description="Année de la session")
):
    """
    Endpoint pour récupérer les informations d'un établissement par ID et année de session.
    Retourne les effectifs des candidats et des bacheliers.
    """
    try:
        # Appelle la méthode statique de la classe EtablissementManager
        result = EtablissementManager.get_filiere_by_details(filiereID, anneeactuelle)

        # Si aucun résultat n'est trouvé, lève une exception 404
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Aucun établissement trouvé pour l'ID {filiereID} et l'année {anneeactuelle}."
            )

        # Retourne les résultats au format JSON
        return JSONResponse(content=result, headers={"Content-Type": "application/json; charset=utf-8"})
    
    except HTTPException as http_err:
        raise http_err  # Lève l'erreur HTTP directement

    except Exception as e:
        print(f"Erreur dans get_filiere_by_details: {e}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")




""" @router.get("/etablissement/Candidat/Bachelier/{etablissementID1:path,tablissementID2:path}", response_model=List[Dict[str, Any]], tags=["Etablissement"])
def get_comp_etablissements(


    etablissementID1: int = Path(..., description="ID de l'établissement (élément ID sous forme de chaîne)"),
    etablissementID2: int = Path(..., description="ID de l'établissement (élément ID sous forme de chaîne)"),
    anneeactuelle: str = Query(..., description="Année de la session")
): """
    



@router.get("/etablissements/comparaison/{etablissementID1}/{etablissementID2}",response_model=List[Dict[str, Any]],tags=["Etablissement"])
def get_comp_etablissements(
    etablissementID1: int = Path(..., description="ID du premier établissement"),
    etablissementID2: int = Path(..., description="ID du second établissement"),
    anneeactuelle: str = Query(..., description="Année de la session")
):
    """
    Endpoint pour comparer deux établissements en fonction de leurs ID et de l'année actuelle.
    Retourne les effectifs et les statistiques des établissements.
    """
    try:
        # Appel de la méthode du service
        result = EtablissementManager.get_comp_etablissements(etablissementID1, etablissementID2, anneeactuelle)

        # Si aucun résultat n'est trouvé, lève une exception 404
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Aucun établissement trouvé pour les ID {etablissementID1} et {etablissementID2} en {anneeactuelle}."
            )

        # Retourne les résultats sous forme de JSON
        return JSONResponse(content=result, headers={"Content-Type": "application/json; charset=utf-8"})

    except HTTPException as http_err:
        raise http_err  # Relève l'erreur HTTP directement

    except Exception as e:
        print(f"Erreur dans comparer_etablissements: {e}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")










@router.get("/etablissements/comparaison", response_model=List[Dict[str, Any]], tags=["Etablissement"])
def get_comp_plus_etablissements(
    etablissementIDs: List[int] = Query(..., description="Liste des IDs des établissements à comparer"),
    anneeactuelle: str = Query(..., description="Année de la session")
):
    """
    Endpoint pour comparer plusieurs établissements en fonction de leurs IDs et de l'année actuelle.
    Retourne les effectifs et les statistiques des établissements.
    """
    try:
        # Appel de la méthode du service
        result = EtablissementManager.get_comp_plus_etablissements(etablissementIDs, anneeactuelle)

        # Si aucun résultat n'est trouvé, lève une exception 404
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Aucun établissement trouvé pour les IDs {etablissementIDs} en {anneeactuelle}."
            )

        # Retourne les résultats sous forme de JSON
        return JSONResponse(content=result, headers={"Content-Type": "application/json; charset=utf-8"})

    except HTTPException as http_err:
        raise http_err  # Relève l'erreur HTTP directement

    except Exception as e:
        print(f"Erreur dans comparer_etablissements: {e}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")





@router.get("/universite/comparaison", response_model=List[Dict[str, Any]], tags=["Etablissement"])
def get_comp_universite(
    nomuniversites: List[str] = Query(..., description="Liste des noms des établissements à comparer"),
    anneeactuelle: List[str] = Query(..., description="Année de la session")
):
    """
    Endpoint pour comparer plusieurs universités en fonction de leurs noms et de l'année actuelle.
    Retourne les effectifs et les statistiques des universités.
    """
    try:
        # Validation des entrées
        if not nomuniversites:
            raise HTTPException(status_code=400, detail="La liste des noms des universités ne peut pas être vide.")
        if not anneeactuelle:
            raise HTTPException(status_code=400, detail="La liste des années ne peut pas être vide.")
        
        # Appel de la méthode du service avec les noms des universités et l'année actuelle
        result = EtablissementManager.get_comp_universite(nomuniversites, anneeactuelle)

        # Si aucun résultat n'est trouvé, lève une exception 404
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Aucun établissement trouvé pour les universités {', '.join(nomuniversites)} en {', '.join(anneeactuelle)}."
            )

        # Retourne les résultats sous forme de JSON
        return result  # FastAPI s'occupe automatiquement de la conversion en JSON

    except HTTPException as http_err:
        raise http_err  # Relève l'erreur HTTP directement

    except Exception as e:
        # Log plus détaillé de l'erreur
        print(f"Erreur dans get_comp_universite: {e}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur. Veuillez réessayer plus tard.")





@router.get("/universite/get_nbFilieresParRegion", response_model=List[Dict[str, Any]], tags=["Filiere"])
def get_nbFilieresParRegion(
    annee: str = Query(..., description="Année de la session"),
    region: str = Query(..., description="Nom de la région")
):
    """
    Endpoint pour récupérer le nombre de filières dans une région pour une année donnée, 
    réparties par établissements privés et publics.
    """
    try:
        result = EtablissementManager.get_nbFilieresParRegion(annee, region)
        if not result:
            raise HTTPException(status_code=404, detail="Aucun résultat trouvé pour les paramètres fournis.")
        return JSONResponse(content=result, headers={"Content-Type": "application/json; charset=utf-8"})
    except Exception as e:
        print(f"Erreur dans get_nbFilieresParRegion: {e}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")


@router.get("/universite/get_nbFilieresParType", response_model=List[Dict[str, Any]], tags=["Filiere"])
def get_nbFilieresParType(
    annee: str = Query(..., description="Année de la session"),
    region: str = Query(..., description="Nom de la région"),
    filiere_formation: str = Query(..., description="Type de filière à rechercher (par exemple, 'Licence')")
):
    """
    Endpoint pour récupérer le nombre de filières dont le type (f.filiere_formation) 
    contient une valeur spécifique pour une année et une région données.
    """
    try:
        result = EtablissementManager.get_nbFilieresParType(annee, region, filiere_formation)
        if not result:
            raise HTTPException(status_code=404, detail="Aucun résultat trouvé pour les paramètres fournis.")
        return JSONResponse(content=result, headers={"Content-Type": "application/json; charset=utf-8"})
    except Exception as e:
        print(f"Erreur dans get_nbFilieresParType: {e}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")


@router.get("/universite/get_nbFilieresParMatiere", response_model=List[Dict[str, Any]], tags=["Filiere"])
def get_nbFilieresParMatiere(
    annee: str = Query(..., description="Année de la session"),
    region: str = Query(..., description="Nom de la région"),
    filiere_formation_detaillee: str = Query(..., description="Matière précise à rechercher dans la filière (par exemple, 'Informatique')")
):
    """
    Endpoint pour récupérer le nombre de filières dont la formation détaillée (f.filiere_formation_detaillee) 
    contient une valeur spécifique pour une année et une région données.
    """
    try:
        result = EtablissementManager.get_nbFilieresParMatiere(annee, region, filiere_formation_detaillee)
        if not result:
            raise HTTPException(status_code=404, detail="Aucun résultat trouvé pour les paramètres fournis.")
        return JSONResponse(content=result, headers={"Content-Type": "application/json; charset=utf-8"})
    except Exception as e:
        print(f"Erreur dans get_nbFilieresParMatiere: {e}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")









@router.get("/universite/get_total_places_par_filiere", 
           response_model=List[Dict[str, Any]], 
           tags=["Filiere"])
def get_total_places_par_filiere(
    filieres: List[str] = Query(..., description="Liste des filières à inclure (ex: BTS,BUT,Licence)"),
    annees: List[str] = Query(..., description="Liste des années à inclure (ex: 2023,2022)")
):
    """
    Endpoint pour récupérer le total des places disponibles par filière très agrégée
    (BTS, BUT, Licence) pour les années spécifiées, trié par ordre décroissant du nombre total de places.
    """
    try:
        result = EtablissementManager.get_total_places_par_filiere(filieres, annees)
        if not result:
            raise HTTPException(
                status_code=404, 
                detail="Aucun résultat trouvé pour les paramètres fournis."
            )
        return JSONResponse(
            content=result, 
            headers={"Content-Type": "application/json; charset=utf-8"}
        )
    except Exception as e:
        print(f"Erreur dans get_total_places_par_filiere: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Erreur interne du serveur"
        )