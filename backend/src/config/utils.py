from pathlib import Path


class PathManager:
    backend = Path(__file__).parents[2]
    resources = backend / "resources"
    models = resources / "models"
    images = resources / "images"
    src = backend / "src"
    config = src / "config"

    def get_models(self):
        return list(self.models.iterdir())


PATH = PathManager()
