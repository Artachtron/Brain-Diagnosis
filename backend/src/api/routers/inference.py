from api.service.diagnosis import Classifier
from fastapi import APIRouter, File, Form, UploadFile

router = APIRouter()


@router.post("/diagnose", name="diagnose")
async def diagnose(files: list[UploadFile], disease: str = Form(...)):
    disease = disease.lower()
    model = None

    match disease.lower():
        case "tumor":
            model = Classifier.TUMOR
        case "alzheimer":
            model = Classifier.ALZHEIMER
        case "stroke":
            model = Classifier.STROKE
        case _:
            raise ValueError(f"Invalid disease: {disease}")

    for f in files:
        img = await f.read()
        result = model.classify(img)
    return {"disease": disease} | result
