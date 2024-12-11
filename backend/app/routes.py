from .controllers.element_controller import router as element_router
from .controllers.relation_controller import router as relation_router


def register_routes(app):
    """
    Enregistre toutes les routes API avec l'application FastAPI.
    :param app: L'instance de l'application FastAPI où les routes seront enregistrées.
    :return: None
    """
    app.include_router(element_router, prefix="/api")
    app.include_router(relation_router, prefix="/api")
