from app.managers.etablissement_manager import EtablissementManager


class EtablissementService:
    def get_etablissement_by_effectif(self, id: int, annee: str):
        return EtablissementManager.get_etablissement_by_effectif(id, annee)

    def get_etablissement_by_filiere(self, type_filiere: str):
        return EtablissementManager.get_etablissement_by_filiere(type_filiere)

    def get_etablissement_by_region(self, region_name: str):
        return EtablissementManager.get_etablissement_by_region(region_name)

    def get_etablissement_by_popularity_capacity(self):
        return EtablissementManager.get_etablissement_by_popularity_capacity()

    def get_etablissement_by_popularity_candidates(self):
        return EtablissementManager.get_etablissement_by_popularity_candidates()

    def get_filiere_etablissement_admission(self, query: str, page: int, page_size: int):
        return EtablissementManager.get_filiere_etablissement_admission(query=query, page=page, page_size=page_size)

    def get_filiere_by_details(self, filiere_id: int, annee: str):
        return EtablissementManager.get_filiere_by_details(filiere_id, annee)

    def get_comp_etablissements(self, id1: int, id2: int, annee: str):
        return EtablissementManager.get_comp_etablissements(id1, id2, annee)

    def get_comp_plus_etablissements(self, ids: list[int], annee: str):
        return EtablissementManager.get_comp_plus_etablissements(ids, annee)

    
