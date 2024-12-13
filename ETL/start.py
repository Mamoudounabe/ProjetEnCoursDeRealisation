from tools import *

if __name__ == "__main__":
    print("Début de l'ETL...")
    check_data()
    print("Fin du téléchargement des données.")
    print("Conversion des fichiers CSV en utf-8...")
    convert_csv_encoding()
    print("Fin de la conversion.")
    print("Modification des entêtes des fichiers CSV...")
    modify_headers()
    print("Fin de la modification des entêtes.")