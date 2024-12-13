from neo4j import GraphDatabase
from .neo_credentials import NeoCredentials


class Neo4JDriver:
    """
    Une classe singleton pour gérer l'instance de base de données Neo4j.

    Cette classe gère la création, la récupération et la fermeture de la base de données Neo4j.
    Elle garantit qu'une seule instance est active à tout moment.
    """
    _driver = None

    @classmethod
    def create_driver(cls):
        """
        Crée une nouvelle instance de Neo4j.

        Cette méthode utilise les informations d'identification stockées dans `NeoCredentials` pour établir une connexion
        à la base de données Neo4j et renvoie une nouvelle instance.

        Returns:
            neo4j.Driver : Une nouvelle instance de driver connectée à la base de données Neo4j.
        """
        return GraphDatabase.driver(
            NeoCredentials.get_url(),
            auth=(NeoCredentials.get_username(), NeoCredentials.get_password())
        )

    @classmethod
    def get_driver(cls):
        """
        Récupère l'instance de Neo4j existante.
        Si aucune instance de pilote existe, cette méthode en crée une en utilisant `create_driver`.

        Returns:
            neo4j.Driver : L'instance de pilote connectée à la base de données Neo4j.
        """
        if not cls._driver:
            cls._driver = cls.create_driver()
        return cls._driver
