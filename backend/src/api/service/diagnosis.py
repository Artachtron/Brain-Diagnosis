import io
from dataclasses import dataclass, field
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
    label_format: dict[str, str] = field(default_factory=dict)
    classifier: Any = None

    def __post_init__(self) -> None:
        print(f"Loading model {self.filename}...")
        self.classifier = self.load()
        print(f"Model {self.filename} loaded successfully.")

    @property
    def classes(self) -> list[str]:
        return sorted(self._classes)

    @property
    def is_binary(self) -> bool:
        return len(self.classes) == 2

    def gravity(self, label: str) -> int:
        if self.is_binary:
            return 0 if label == self.classes[0] else 10

        if label == self._classes[-1]:
            return 10

        return self._classes.index(label)

    def load(self):
        return load_model(PATH.models / self.filename, compile=False)

    def preprocess(self, image_bytes):
        img = Image.open(io.BytesIO(image_bytes))
        img = img.resize(self.input_shape)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        if img_array.shape[3] == 1:
            img_array = np.repeat(img_array, 3, axis=3)
        processed_img = self.preprocessor(img_array)
        return processed_img

    def predict(self, image) -> dict[str, float | str]:
        prediction = self.classifier.predict(image)
        if self.is_binary:
            label = self.classes[0] if prediction < 0.5 else self.classes[1]
            value = 1 - prediction[0][0] if prediction < 0.5 else prediction[0][0]
        else:
            label = self.classes[prediction.argmax()]
            value = prediction[0][prediction.argmax()]

        return label, value

    def classify(self, image_bytes) -> dict[str, float | str]:
        image = self.preprocess(image_bytes)
        prediction = self.predict(image)
        return self.format_prediction(prediction)

    def format_prediction(
        self, prediction: dict[str, float | str]
    ) -> dict[str, float | str]:
        return {
            "label": self.label_format.get(prediction[0], prediction[0]),
            "confidence": float(prediction[1]),
            "gravity": self.gravity(prediction[0]),
        }


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
        label_format={
            "NonDemented": "None",
            "VeryMildDemented": "Very Mild",
            "MildDemented": "Mild",
            "ModerateDemented": "Moderate",
        },
    )
    STROKE = Model(
        filename="stroke_vgg19_unfrozen.h5",
        preprocessor=vgg19.preprocess_input,
        input_shape=(224, 224),
        _classes=["Yes", "No"],
        label_format={"Yes": "Brain Stroke", "No": "No Brain Stroke"},
    )

    TUMOR = Model(
        filename="brain_tumor_vgg16_unfrozen.h5",
        preprocessor=vgg16.preprocess_input,
        input_shape=(224, 224),
        _classes=["Yes", "No"],
        label_format={"Yes": "Brain Tumor", "No": "No Brain Tumor"},
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
