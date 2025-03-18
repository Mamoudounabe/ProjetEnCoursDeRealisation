#!/bin/bash

# Attendre que Neo4j soit prêt
echo "Attente du démarrage de Neo4j..."
until nc -z -v -w30 neo4j 7687; do
  echo "En attente de Neo4j..."
  sleep 10
done

echo "Neo4j est prêt, démarrage de l'ETL..."
python main.py


