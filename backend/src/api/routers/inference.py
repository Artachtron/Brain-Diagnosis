from api.service.diagnosis import Classifier
from fastapi import APIRouter, File, Form, UploadFile

router = APIRouter()


@router.post("/results")
async def publish_results(file: UploadFile, disease: str = Form(...)):
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

    img = await file.read()
    result = model.classify(img)
    return {"disease": disease, "result": result}
