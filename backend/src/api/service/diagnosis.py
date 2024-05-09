import io
from dataclasses import dataclass
from typing import Any

import numpy as np
from config.utils import PATH
from PIL import Image
from tensorflow.keras.applications import vgg16, vgg19
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image


@dataclass
class Model:
    filename: str
    preprocessor: callable
    input_shape: tuple[int, int]
    _classes: list[str]
    classifier: Any = None

    def __post_init__(self) -> None:
        print(f"Loading model {self.filename}...")
        self.classifier = self.load()
        print(f"Model {self.filename} loaded successfully.")

    @property
    def classes(self) -> list[str]:
        return sorted(self._classes)
    
    @property
    def binary(self) -> bool:
        return len(self.classes) == 2

    def load(self):
        return load_model(PATH.models / self.filename, compile=False)

    def preprocess(self, image_bytes):
        img = Image.open(io.BytesIO(image_bytes))
        img = img.resize(self.input_shape)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        processed_img = self.preprocessor(img_array)
        return processed_img

    def predict(self, image):
        prediction = self.classifier.predict(image)
        if self.binary:
            label = self.classes[0] if prediction < 0.5 else self.classes[1]
            value = prediction[0][0]
        else:
            label = self.classes[prediction.argmax()]
            value = prediction[0][prediction.argmax()]
        return label, value

    def classify(self, image_bytes):
        image = self.preprocess(image_bytes)
        prediction = self.predict(image)
        return prediction


class Classifier:
    ALZHEIMER = Model(
        filename="alzheimer_vgg19_unfrozen.h5",
        preprocessor=vgg19.preprocess_input,
        input_shape=(208, 176),
        _classes=[
            "NonDemented",
            "VeryMildDemented",
            "MildDemented",
            "ModerateDemented",
        ],
    )
    STROKE = Model(
        filename="stroke_vgg19_unfrozen.h5",
        preprocessor=vgg19.preprocess_input,
        input_shape=(224, 224),
        _classes=["Yes", "No"],
    )

    TUMOR = Model(
        filename="brain_tumor_vgg16_unfrozen.h5",
        preprocessor=vgg16.preprocess_input,
        input_shape=(224, 224),
        _classes=["Yes", "No"],
    )


if __name__ == "__main__":
    classifier = Classifier.ALZHEIMER
    image_file: str = PATH.images / "test.jpg"
    with open(image_file, "rb") as f:
        image_bytes = f.read()
    # img = Image.open(image_file)
    # input_shape = (224, 224)
    # img = img.resize(input_shape)
    # img_array = image.img_to_array(img)
    # img_array = np.expand_dims(img_array, axis=0)
    # if img_array.shape[3] == 1:
    #     img_array = np.repeat(img_array, 3, axis=3)

    image = classifier.preprocess(image_bytes)
    prediction = classifier.predict(image)
    print(prediction)
