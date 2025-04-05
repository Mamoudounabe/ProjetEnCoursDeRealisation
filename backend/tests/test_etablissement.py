from unittest.mock import patch
from fastapi.testclient import TestClient

with patch("app.managers.element_type_manager.NodeTypeManager.get_all_node_type", return_value=[]), \
     patch("app.managers.relation_type_manager.RelationTypeManager.get_all_relation_type", return_value=[]), \
     patch("app.managers.relation_type_manager.RelationTypeManager.relation_details", return_value=[]):

    from main import app
    from app.services.etablissement_service import EtablissementService

    class FakeEtablissementService:
        def get_etablissement_by_popularity_capacity(self):
            return [
                {"id": 1, "nom": "IUT Nice", "capacite": 150},
                {"id": 2, "nom": "IUT Lyon", "capacite": 120}
            ]

        def get_etablissement_by_region(self, region_name: str):
            return [{"id": 1, "nom": "Université Nord", "region": region_name}]

        def get_etablissement_by_effectif(self, id: int, annee: str):
            return [{"id": id, "candidats": 100, "bacheliers": 80}]

        def get_etablissement_by_filiere(self, type_filiere: str):
            return [{"id": 1, "nom": "Université Test", "filiere": type_filiere}]

        def get_etablissement_by_popularity_candidates(self):
            return [
                {"id": 1, "nom": "IUT Paris", "candidats": 300},
                {"id": 2, "nom": "IUT Toulouse", "candidats": 250},
            ]

        def get_filiere_etablissement_admission(self, query: str, page: int, page_size: int):
            return [{"filiere": "Informatique", "etablissement": "IUT Lille", "admis": 85}]


    app.dependency_overrides[EtablissementService] = lambda: FakeEtablissementService()

    client = TestClient(app)




def test_get_etablissement_by_effectif():
    response = client.get("/api/Etablissement/Candidat/Bachelier/1?anneeactuelle=2023")
    assert response.status_code == 200
    assert response.json() == [{"id": 1, "candidats": 100, "bacheliers": 80}]


def test_get_etablissement_by_filiere():
    response = client.get("/api/etablissements/filiere?type_filiere=Informatique")
    assert response.status_code == 200
    assert response.json() == [{"id": 1, "nom": "Université Test", "filiere": "Informatique"}]


def test_get_etablissement_by_region():
    response = client.get("/api/etablissements/region?region_name=Nord")
    assert response.status_code == 200
    assert response.json() == [{"id": 1, "nom": "Université Nord", "region": "Nord"}]


def test_get_by_popularity_capacity():
    response = client.get("/api/etablissements/popularite/capacite")
    assert response.status_code == 200
    assert response.json() == [
        {"id": 1, "nom": "IUT Nice", "capacite": 150},
        {"id": 2, "nom": "IUT Lyon", "capacite": 120}
    ]


def test_get_by_popularity_candidates():
    response = client.get("/api/etablissements/popularite/candidats")
    assert response.status_code == 200
    assert response.json() == [
        {"id": 1, "nom": "IUT Paris", "candidats": 300},
        {"id": 2, "nom": "IUT Toulouse", "candidats": 250}
    ]


def test_get_filiere_admission():
    response = client.get("/api/filiere/etablissement/admission?query=info&page=1&page_size=8")
    assert response.status_code == 200
    assert response.json() == [{"filiere": "Informatique", "etablissement": "IUT Lille", "admis": 85}]
