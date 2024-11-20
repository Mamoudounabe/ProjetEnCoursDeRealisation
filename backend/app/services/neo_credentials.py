from app.config import Config


class NeoCredentials:
    """
    Cette classe permet de gérer les identifiants de la base de données Neo4j.

    Attributs :
        url (str) : L'URL de la base de données Neo4j.
        username (str) : Le nom d'utilisateur de la base de données Neo4j.
        password (str) : Le mot de passe de la base de données Neo4j.
        database (str) : Le nom de la base de données Neo4j.
    """

    url = Config.NEO4J_URI
    username = Config.NEO4J_USERNAME
    password = Config.NEO4J_PASSWORD
    database = Config.NEO4J_DATABASE

    @classmethod
    def get_url(cls):
        """
        Récupère l'URL de la base de données.

        Returns:
            str: L'url.
        """
        return cls.url

    @classmethod
    def get_username(cls):
        """
        Récupère le pseudonyme de l'utilisateur de la base de données.

        Returns:
            str: Le pseudonyme de l'utilisateur.
        """
        return cls.username

    @classmethod
    def get_password(cls):
        """
        Récupère le mot de passe de la base de données.

        Returns:
            str: Le mot de passe.
        """
        return cls.password
