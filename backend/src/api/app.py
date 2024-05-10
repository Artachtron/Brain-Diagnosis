from api.routers import inference
from fastapi import FastAPI
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://localhost",
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_credentials=True,
        allow_origins=origins,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
]

app = FastAPI(middleware=middleware)

app.include_router(inference.router, prefix="/inference", tags=["inference"])


@app.get("/routes", name="routes")
def get_routes():
    exlude_routes = [
        "openapi",
        "swagger_ui_html",
        "swagger_ui_redirect",
        "redoc_html",
        "routes",
    ]

    routes = {}
    for route in app.routes:
        if route.name not in exlude_routes:
            routes[route.name] = route.path

    return routes
