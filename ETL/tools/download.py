import requests
import os
from tqdm import tqdm

def download(url, name):
    """
    Télécharge un fichier depuis une URL et l'enregistre dans le dossier data.

    Args:
        url (str): URL du fichier à télécharger.
        name (str): Nom du fichier à enregistrer.

    Returns:
        None
    """
    response = requests.get(url, allow_redirects=True)
    content = response.content
    # Enregistrement du fichier
    with open(f"ETL/data/{name}.csv", "wb") as file:
        file.write(content)

def download_2020():
    """
    Télécharge les données de Parcoursup 2020 si elles ne sont pas déjà présentes.
    """
    if not os.path.exists(f"./ETL/data/2020.csv"):
        download("https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-parcoursup_2020/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B", "2020")

def download_2021():
    """
    Télécharge les données de Parcoursup 2021 si elles ne sont pas déjà présentes.
    """
    if not os.path.exists(f"./ETL/data/2021.csv"):
        download("https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-parcoursup_2021/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B", "2021")

def download_2022():
    """
    Télécharge les données de Parcoursup 2022 si elles ne sont pas déjà présentes.
    """
    if not os.path.exists(f"./ETL/data/2022.csv"):
        download("https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-parcoursup_2022/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B", "2022")

def download_2023():
    """
    Télécharge les données de Parcoursup 2023 si elles ne sont pas déjà présentes.
    """
    if not os.path.exists(f"./ETL/data/2023.csv"):
        download("https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-parcoursup/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B", "2023")

def check_data():
    """
    Permet de vérifier si les données de Parcoursup sont déjà présentes. Si ce n'est pas le cas, elles sont téléchargées.
    """

    # Liste des tâches à effectuer
    tasks = [
        (download_2020, "./ETL/data"),
        (download_2021, "./ETL/data"),
        (download_2022, "./ETL/data"),
        (download_2023, "./ETL/data")
    ]

    # Barre de progression pour suivre l'avancement du téléchargement
    with tqdm(total=len(tasks)) as pbar:
        pbar.set_description("Téléchargement des données")
        for task, path in tasks:
            # Vérifier si le dossier existe, sinon le créer
            if not os.path.exists(path):
                os.makedirs(path)
            task()
            pbar.update(1)
        pbar.set_description("Fin du téléchargement des données")