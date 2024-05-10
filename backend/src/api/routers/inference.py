from api.service.diagnosis import Classifier
from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import io


class DiagnoseResponse(BaseModel):
    disease: str
    label: str
    confidence: float
    gravity: int


router = APIRouter()


@router.post("/diagnose", name="diagnose", response_model=DiagnoseResponse)
async def diagnose(files: list[UploadFile] = File(...), disease: str = Form(...)):
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


@router.get("/stream", name="stream")
async def test():
    def data_generator():
        for i in range(100):
            yield f"data: {i}\n\n"

    return StreamingResponse(
        io.StringIO("".join(data_generator())), media_type="text/event-stream"
    )
