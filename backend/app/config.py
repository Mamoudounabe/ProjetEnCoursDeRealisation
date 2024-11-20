class Config:
    """
    Cette classe contient l'URI, le nom d'utilisateur et le mot de passe requis pour se connecter à la base de données Neo4j.
    Ces valeurs sont utilisées par l'application pour initialiser une connexion à la base de données.

    Attributs :
        NEO4J_URI (str) : L'URI de la base de données Neo4j.
        NEO4J_USERNAME (str) : Le nom d'utilisateur pour l'authentification avec la base de données Neo4j.
        NEO4J_PASSWORD (str) : Le mot de passe pour s'authentifier avec la base de données Neo4j.
        NEO4J_DATABASE (str) : Le nom de la base de données Neo4J.
    """

    NEO4J_URI = "bolt://localhost:7687"
    NEO4J_USERNAME = "neo4j"
    NEO4J_PASSWORD = "test1234"
    NEO4J_DATABASE = "test"