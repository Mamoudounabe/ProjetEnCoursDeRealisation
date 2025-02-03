import os
from dotenv import load_dotenv
from tools import *
from tqdm import tqdm

load_dotenv()

# Récupération des variables d'environnement
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
NEO4J_DATABASE = os.getenv("NEO4J_DATABASE")

if __name__ == "__main__":
    print("environnements variables...",NEO4J_URI,NEO4J_USER,NEO4J_PASSWORD,NEO4J_DATABASE)
    print("Début de chargement des données dans Neo4j...")
    loader = Neo4jLoader(NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD, NEO4J_DATABASE)

    loader.create_node("Session", {"annee": "2020"})
    loader.create_node("Session", {"annee": "2021"})
    loader.create_node("Session", {"annee": "2022"})
    loader.create_node("Session", {"annee": "2023"})

    # Pour tous les fichiers csv dans le dossier data
    csv_files = [file for file in os.listdir("data") if file.endswith(".csv")]
    
    with tqdm(total=len(csv_files)) as pbar:
        pbar.set_description("Traitement des fichiers CSV")
        for csv_file in csv_files:
            year = csv_file.split('.')[0]  # Extraire l'année du nom du fichier
            file_path = f"data/{csv_file}"  # Chemin d'accès au fichier
            loader.load_csv(file_path, year)
            pbar.update(1)
        pbar.set_description("Fin du traitement des fichiers CSV")

    loader.close()
    print("Fin du chargement des données dans Neo4j.")

    print("Fin de l'ETL.")