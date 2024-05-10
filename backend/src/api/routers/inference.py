from api.service.diagnosis import Classifier
from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import io
import json
from typing import AsyncGenerator


class DiagnoseResponse(BaseModel):
    disease: str
    label: str
    confidence: float
    gravity: int


router = APIRouter()


@router.post("/diagnose", name="diagnose")
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

    images = [await f.read() for f in files]

    async def stream_results() -> AsyncGenerator[str, None]:
        for idx, img in enumerate(images):
            result = model.classify(img)
            result["disease"] = disease
            result["filename"] = files[idx].filename
            yield json.dumps(result) + "\n"

    return StreamingResponse(stream_results(), media_type="text/event-stream")

router.post("/diagnose_one", name="diagnose_one")
async def diagnose_one(file: UploadFile = File(...), disease: str = Form(...)):
    disease = disease.lower()
    model = None

    match disease:
        case "tumor":
            model = Classifier.TUMOR
        case "alzheimer":
            model = Classifier.ALZHEIMER
        case "stroke":
            model = Classifier.STROKE
        case _:
            raise ValueError(f"Invalid disease: {disease}")

    image = await file.read()
    result = model.classify(image)
    result["disease"] = disease
    result["filename"] = file.filename

    return result


@router.get("/stream", name="stream")
async def test():
    def data_generator():
        for i in range(100):
            yield f"data: {i}\n\n"

    return StreamingResponse(
        io.StringIO("".join(data_generator())), media_type="text/event-stream"
    )
