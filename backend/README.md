# Lancer l'API

**1. Créer un environnement virtuel**

```
python -m venv env
env\Scripts\activate
```

**2. Installer les dépendances**

```
pip install -r requirements.txt
```

**3. Démarrer le serveur FastAPI**

```
python main.py
```

Le serveur sera disponible sur [http://localhost:8000/docs](http://localhost:8000/docs)

# Avant de commencer

Le tutoriel est divisé en trois parties. La première partie explique les interfaces nécessaires dans le front pour un fonctionnement optimal de l'API. La deuxième partie explique les endpoints de l'API : la définition, comment l'utiliser et les possibles résultats attendues.

## Pourquoi des interfaces ? A quoi ça sert ?
### Les interfaces qu'est-ce que c'est ?

Une **interface** est une structure qui définit la forme qu’un objet doit avoir dans un langage typé comme TypeScript. Elle n’implémente aucune logique : elle se contente de décrire les propriétés et leurs types, comme un contrat. Par exemple, une interface `NodeType` peut spécifier qu’un objet doit avoir un identifiant (`id_node_type`), un nom (`name_node_type`), et une liste de propriétés (`properties_node_type`).

### Meilleure lisibilité

Elles permettent :
- De comprendre rapidement ce que représente une donnée (ex. : un `NodeType` ou une `RelationType`).
- D’identifier les propriétés et types associés sans chercher dans tout le code.
- De centraliser la documentation des données directement dans le code, évitant les incompréhensions.

### Validation des données

En Angular, l’utilisation d’interfaces permet de bénéficier du typage fort de TypeScript. Cela :
- Empêche les erreurs en s’assurant que seules les données conformes à l’interface sont utilisées.
- Facilite la détection des bugs au moment de la compilation, plutôt qu’à l’exécution.
- Garantit que les données envoyées ou reçues respectent la structure prévue.

Exemple : Si une API renvoie des données mal structurées, le compilateur de TypeScript alertera immédiatement.

### Cohérence entre front et back

Les interfaces permettent de définir des structures qui reflètent les modèles du backend (par ex., un `NodeType` dans FastAPI correspond directement à l’interface `NodeType` en Angular). Cette correspondance assure :
- Une synchronisation des données entre le frontend et le backend.
- Une facilité de mise à jour si les structures évoluent, en modifiant uniquement l’interface concernée.

## Si vous avez besoin de modifier l'API : Guide Pratique
### 1. Structure Générale de l’API

L’API suit une architecture bien définie où chaque composant a un rôle spécifique :
- **Controller** : Gère les endpoints (routes) de l’API.
- **Manager** : Contient la logique métier (business logic) et interagit avec les modèles et les services.
- **Model** : Définit les structures de données (objets) utilisées dans l’API.
- **Service** : Interagit directement avec les ressources externes (comme la base de données Neo4j).

---

### 2. Ajouter ou Modifier une Route
#### Étape 1 : Ajouter un Tag

Chaque route de l’API est associée à un tag. Les tags servent à organiser les endpoints dans la documentation Swagger (pour en savoir plus sur Swagger : https://swagger.io).

- **Pourquoi les tags ?** : Ils permettent de regrouper les routes similaires et d’améliorer la lisibilité dans Swagger.
- **Comment les ajouter ?** : Les tags sont définis au niveau du décorateur de route dans le controller, par exemple :

```python
@router.get("/node-types", response_model=List[NodeType], tags=["Node Types"])
```

#### Étape 2 : Enregistrer une Route

Pour qu’une route soit accessible, elle doit être enregistrée dans le routeur principal.
- **Comment faire ?** : Ajoutez votre route dans le fichier où le routeur principal est défini, dans le cas de l'API actuel dans `routes.py` à la racine du dossier `app`.

```python
def register_routes(app):  
"""  
Enregistre toutes les routes API avec l'application FastAPI.    :param app: L'instance de l'application FastAPI où les routes seront enregistrées.    :return: None    
"""
app.include_router(element_router, prefix="/api")
app.include_router(relation_router, prefix="/api")
# Ajouter la nouvelle route à la suite
```

- **Pourquoi ?** : Cela permet à l’API de savoir quelles routes sont disponibles et où les trouver.    

---

### 3. Rôles des Composants de l’API
#### Controller

- **Rôle :** Le controller gère les endpoints (routes) de l’API. Il sert d’interface entre les requêtes HTTP et la logique métier.
- **Exemple :**
```python
from fastapi import APIRouter
from app.managers.node_manager import NodeTypeManager
    
router = APIRouter()
    
@router.get("/node-types", tags=["Node Types"])
def get_all_node_types():
    return NodeTypeManager.get_all_node_types()
```

- **Que faire ?** :
    - Ajouter ou modifier un endpoint : Définir une nouvelle route avec un décorateur comme `@router.get`, `@router.post`, etc. (les différents décorateurs sont expliqués ici : https://fastapi.tiangolo.com/tutorial/first-steps/#path)
    - Appeler les méthodes appropriées dans le manager.

#### Manager

- **Rôle :** Le manager contient la logique métier. Il décide quelles opérations effectuer et comment interagir avec les modèles ou les services.
- **Exemple :**
```python
class NodeTypeManager:
	@staticmethod
	def get_all_node_types():
		db = Neo4JDriver.get_driver()
		query = "MATCH (n) RETURN DISTINCT labels(n)"
		with db.session() as session:
			results = session.run(query)
			return [NodeType(name_node_type=label[0]) for label in results]
```

- **Que faire ?** :
    - Ajouter une méthode pour la logique métier associée à votre endpoint.
    - Si nécessaire, appeler un service ou manipuler les données avant de les renvoyer au controller.

#### Model

- **Rôle :** Les modèles définissent les structures de données utilisées dans l’API. Ils assurent une validation stricte des données et servent d’interface claire entre le backend et le frontend.
- **Exemple :**
```python
from pydantic import BaseModel

class NodeType(BaseModel):
	id_node_type: str
	name_node_type: str
	properties_node_type: List[PropertyNode]
```

- **Que faire ?** :
    - Ajouter ou modifier un modèle si la structure des données évolue.
    - S’assurer que le frontend connaît les modifications pour rester cohérent.

#### Service

- **Rôle :** Les services interagissent directement avec des ressources externes, comme une base de données ou une API tierce.
- **Exemple :**

```python
class Neo4JDriver:
	@staticmethod
	def get_driver():
		if not cls._driver:  
		    cls._driver = cls.create_driver()  
		return cls._driver
```

- **Que faire ?** :
    - Ajouter ou modifier les méthodes nécessaires pour récupérer ou manipuler les données dans la base de données.
    - Attention, sécuriser les requêtes et à gérer les erreurs de connexion.

---

### 4. Exemple : Ajouter un Endpoint
#### Contexte

Nous souhaitons ajouter un endpoint pour récupérer les nœuds liés à un type de relation. (La fonctionnalité est déjà implémentée, ceci n'est qu'un exemple d'étape à réaliser pour modifier l'API au mieux, la logique métier a donc été simplifié et modifié à cet effet.)

#### Étapes

1. **Définir le modèle (si nécessaire)** : Si la réponse nécessite une nouvelle structure de données, ajoutez un modèle dans `models.py` :

```python
class RelatedNode(BaseModel):
	id: int
	name: str
	relation_type: str
```

2. **Ajouter une méthode dans le Manager** : Ajoutez la logique métier dans le fichier du manager concerné :

```python
class NodeTypeManager:
	@staticmethod
	def get_related_nodes(node_id: int):
		db = Neo4JDriver.get_driver()
		query = f"""
		MATCH (n)-[r]->(m)
		WHERE id(n) = $node_id
		RETURN id(m) AS id, labels(m)[0] AS name, type(r) AS relation_type
		"""
		with db.session() as session:
			results = session.run(query, {"node_id": node_id})
			return [
				RelatedNode(id=record["id"], name=record["name"], relation_type=record["relation_type"])
				for record in results
			]
```

3. **Ajouter un endpoint dans le Controller** : Déclarez une route dans le controller :

```python
@router.get("/nodes/{node_id}/related", response_model=List[RelatedNode], tags=["Node Types"])
def get_related_nodes(node_id: int):
return NodeTypeManager.get_related_nodes(node_id)
```

4. **Enregistrer la route** : Ajoutez le fichier du controller au routeur principal si ce n’est pas déjà fait.

# Interfaces pour le Front Angular

Voici la liste des interfaces nécessaires dans le front pour la cohérence back/front.

## 1. Interfaces pour les Nœuds

### PropertyNode

Représente une propriété d’un type de nœud.

```typescript
export interface PropertyNode {
  id_property: string; // Identifiant unique de la propriété
  name_property: string; // Nom de la propriété
  type_property: string; // Type de la propriété (par ex. 'str', 'int', etc.)
}
```

### NodeType

Représente un type de nœud dans la base de données.

```typescript
export interface NodeType {
  id_node_type: string; // Identifiant unique du type de nœud
  name_node_type: string; // Nom du type de nœud
  properties_node_type: PropertyNode[]; // Liste des propriétés associées au type de nœud
}
```

### PropertyOfElement

Représente une propriété d’un élément individuel.

```typescript
export interface PropertyOfElement {
  id_property: string; // Identifiant unique de la propriété
  name_property: string; // Nom de la propriété
  value_property: string | number | null; // Valeur de la propriété (str, int, ou null)
}
```

### ElementOfNode

Représente un élément individuel d’un type de nœud.

```typescript
export interface ElementOfNode {
  id_element: string; // Identifiant unique de l'élément
  id_neo4j: number; // ID interne Neo4j de l'élément
  properties_element: PropertyOfElement[]; // Liste des propriétés de cet élément
}
```

---

## 2. Interfaces pour les Relations

### PropertyRelation

Représente une propriété d’un type de relation.

```typescript
export interface PropertyRelation {
  id_property: string; // Identifiant unique de la propriété
  name_property: string; // Nom de la propriété
  type_property: string; // Type de la propriété (par ex. 'str', 'int', etc.)
}
```

### RelationType

Représente un type de relation dans la base de données.

```typescript
export interface RelationType {
  relation_type: string; // Nom du type de relation
  properties_relation_type: PropertyRelation[]; // Liste des propriétés associées à ce type de relation
}
```

### RelationTypeWithNode

Représente un type de relation avec les nœuds source et cible.

```typescript
export interface RelationTypeWithNode {
  id_relation_type: string; // Identifiant unique de la relation
  source_node: string; // Nom du nœud source
  target_node: string; // Nom du nœud cible
  relation: RelationType; // Détails du type de relation
}
```

### ElementOfRelation

Représente un élément individuel d’une relation.

```typescript
export interface ElementOfRelation {
  id_element: string; // Identifiant unique de la relation
  id_neo4j: number; // ID interne Neo4j de la relation
  source_node: ElementOfNode; // Nœud source de la relation
  target_node: ElementOfNode; // Nœud cible de la relation
  properties_element: PropertyOfElement[]; // Liste des propriétés associées à cette relation
}
```

---

## Organisation des Interfaces

Il est possible de regrouper toutes ces interfaces dans un fichier unique pour plus de clarté, par exemple `models.ts`  :

```typescript
// models.ts

// Interfaces pour les Nœuds
export interface PropertyNode {
  id_property: string;
  name_property: string;
  type_property: string;
}

export interface NodeType {
  id_node_type: string;
  name_node_type: string;
  properties_node_type: PropertyNode[];
}

export interface PropertyOfElement {
  id_property: string;
  name_property: string;
  value_property: string | number | null;
}

export interface ElementOfNode {
  id_element: string;
  id_neo4j: number;
  properties_element: PropertyOfElement[];
}

// Interfaces pour les Relations
export interface PropertyRelation {
  id_property: string;
  name_property: string;
  type_property: string;
}

export interface RelationType {
  relation_type: string;
  properties_relation_type: PropertyRelation[];
}

export interface RelationTypeWithNode {
  id_relation_type: string;
  source_node: string;
  target_node: string;
  relation: RelationType;
}

export interface ElementOfRelation {
  id_element: string;
  id_neo4j: number;
  source_node: ElementOfNode;
  target_node: ElementOfNode;
  properties_element: PropertyOfElement[];
}
```

Pour mieux structure vous pouvez aussi diviser par type de modèle et donc faire deux fichiers `node_models` et `relation_models`
# Les endpoints
## Endpoint 1 : Liste des types de nœuds
### Description

Cet endpoint récupère tous les types de nœuds présents dans la base de données Neo4j, ainsi que leurs propriétés associées.

- **URL** : `/node-types`
- **Méthode HTTP** : `GET`
- **Tags** : Node Types

### Exemple de Service Angular

```typescript
export class NodeTypeService {
  private apiUrl = 'http://localhost:8000/api/node-types';

  constructor(private http: HttpClient) {}

  getNodeTypes(): Observable<NodeType[]> {
    return this.http.get<NodeType[]>(this.apiUrl);
  }
}
```

### Exemple de Résultat Attendu

```json
[
  {
    "id_node_type": "1",
    "name_node_type": "Etablissement",
    "properties_node_type": [
      {
        "id_property": "1",
        "name_property": "statut_etablissement_filiere",
        "type_property": "str"
      },
      {
        "id_property": "2",
        "name_property": "code_uai_etablissement",
        "type_property": "str"
      }
    ]
  },
  {
    "id_node_type": "2",
    "name_node_type": "Filiere",
    "properties_node_type": [
      {
        "id_property": "1",
        "name_property": "filiere_formation",
        "type_property": "str"
      }
    ]
  }
]
```

---

## Endpoint 2 : Éléments d’un type de nœud
### Description

Cet endpoint récupère tous les éléments pour un type de nœud spécifique.

- **URL** : `/node-types/{name_node_type}/elements`
- **Méthode HTTP** : `GET`
- **Tags** : Node Types

### Exemple de Service Angular

```typescript
export class NodeTypeService {
  private apiUrl = 'http://localhost:8000/api/node-types';

  constructor(private http: HttpClient) {}

  getElementsByNodeType(nameNodeType: string): Observable<ElementOfNode[]> {
    return this.http.get<ElementOfNode[]>(`${this.apiUrl}/${nameNodeType}/elements`);
  }
}
```

### Exemple de Résultat Attendu

```json
[
  {
    "id_element": "1",
    "id_neo4j": 205976,
    "properties_element": [
      {
        "id_property": "1",
        "name_property": "statut_etablissement_filiere",
        "value_property": "public"
      },
      {
        "id_property": "2",
        "name_property": "code_uai_etablissement",
        "value_property": "1234567A"
      }
    ]
  }
]
```

---

## Endpoint 3 : Éléments filtrés par propriété
### Description

Cet endpoint récupère les éléments d’un type de nœud spécifique, filtrés par une propriété et une valeur.

- **URL** : `/node-types/{name_node_type}/elements/filter`
- **Méthode HTTP** : `GET`
- **Tags** : Node Types

### Exemple de Service Angular

```typescript
export class NodeTypeService {
  private apiUrl = 'http://localhost:8000/api/node-types';

  constructor(private http: HttpClient) {}

  getElementsByNodeTypeAndProperty(nameNodeType: string, propertyName: string, propertyValue: string): Observable<ElementOfNode[]> {
    return this.http.get<ElementOfNode[]>(`${this.apiUrl}/${nameNodeType}/elements/filter`, {
      params: { property_name: propertyName, property_value: propertyValue }
    });
  }
}
```

### Exemple de Résultat Attendu

```json
[
  {
    "id_element": "2",
    "id_neo4j": 205977,
    "properties_element": [
      {
        "id_property": "1",
        "name_property": "statut_etablissement_filiere",
        "value_property": "public"
      }
    ]
  }
]
```

---

## Endpoint 4 : Détails d’un nœud par ID interne
### Description

Cet endpoint récupère les détails d’un nœud en utilisant son identifiant interne Neo4j.

- **URL** : `/node-types/{id_intern_neo4j}/element/node`
- **Méthode HTTP** : `GET`
- **Tags** : Node Types

### Exemple de Service Angular

```typescript
export class NodeTypeService {
  private apiUrl = 'http://localhost:8000/api/node-types';

  constructor(private http: HttpClient) {}

  getElementById(idInternNeo4j: number): Observable<ElementOfNode> {
    return this.http.get<ElementOfNode>(`${this.apiUrl}/${idInternNeo4j}/element/node`);
  }
}
```

### Exemple de Résultat Attendu

```json
{
  "id_element": "1",
  "id_neo4j": 205976,
  "properties_element": [
    {
      "id_property": "1",
      "name_property": "statut_etablissement_filiere",
      "value_property": "public"
    },
    {
      "id_property": "2",
      "name_property": "code_uai_etablissement",
      "value_property": "1234567A"
    }
  ]
}
```

---

## Endpoint 5 : Liste des relations
### Description

Cet endpoint récupère tous les types de relations présents dans la base de données Neo4j, avec leurs propriétés associées.

- **URL** : `/relation-types`
- **Méthode HTTP** : `GET`
- **Tags** : Relation Types

### Exemple de Service Angular

```typescript
export class RelationTypeService {
  private apiUrl = 'http://localhost:8000/api/relation-types';

  constructor(private http: HttpClient) {}

  getRelationTypes(): Observable<RelationType[]> {
    return this.http.get<RelationType[]>(this.apiUrl);
  }
}
```

### Exemple de Résultat Attendu

```json
[
  {
    "relation_type": "HAS_ETABLISSEMENT",
    "properties_relation_type": [
      {
        "id_property": "1",
        "name_property": "statut_etablissement_filiere",
        "type_property": "str"
      }
    ]
  }
]
```

---

## Endpoint 6 : Détails des relations avec leurs nœuds
### Description

Cet endpoint fournit des détails sur les relations, y compris les nœuds source et cible.

- **URL** : `/relation-types-details`
- **Méthode HTTP** : `GET`
- **Tags** : Relation Types

### Exemple de Service Angular

```typescript
export class RelationTypeService {
  private apiUrl = 'http://localhost:8000/api/relation-types-details';

  constructor(private http: HttpClient) {}

  getRelationDetails(): Observable<RelationTypeWithNode[]> {
    return this.http.get<RelationTypeWithNode[]>(this.apiUrl);
  }
}
```

### Exemple de Résultat Attendu

```json
[
  {
    "id_relation_type": "1",
    "source_node": "Etablissement",
    "target_node": "Filiere",
    "relation": {
      "relation_type": "OFFERS",
      "properties_relation_type": []
    }
  }
]
```

---

## Endpoint 7 : Éléments d’un type de relation
### Description

Cet endpoint récupère tous les éléments d’un type de relation spécifique.

- **URL** : `/relation-types/{name_relation_type}/elements`
- **Méthode HTTP** : `GET`
- **Tags** : Relation Types

### Exemple de Service Angular

```typescript
export class RelationTypeService {
  private apiUrl = 'http://localhost:8000/api/relation-types';

  constructor(private http: HttpClient) {}

  getElementsByRelationType(nameRelationType: string): Observable<ElementOfRelation[]> {
    return this.http.get<ElementOfRelation[]>(`${this.apiUrl}/${nameRelationType}/elements`);
  }
}
```

### Exemple de Résultat Attendu

```json
[
  {
    "id_element": "1",
    "id_neo4j": 12345,
    "source_node": {
      "id_element": "1",
      "id_neo4j": 205976,
      "properties_element": []
    },
    "target_node": {
      "id_element": "2",
      "id_neo4j": 205977,
      "properties_element": []
    },
    "properties_element": []
  }
]
```