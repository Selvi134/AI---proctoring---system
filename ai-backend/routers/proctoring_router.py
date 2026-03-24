from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, schemas, crud
import base64
import cv2
import numpy as np
from proctoring.proctor_manager import ProctoringManager

router = APIRouter()

# Global dictionary to store proctoring sessions per student
# In a real app, this should be in Redis or a proper state management system
proctor_sessions = {}

@router.post("/proctor/analyze")
async def analyze_proctor_frame(data: dict):
    student_id = data.get("student_id")
    frame_b64 = data.get("image")

    if not student_id or not frame_b64:
        print(f"DEBUG: Missing data. student_id: {bool(student_id)}, image: {bool(frame_b64)}")
        raise HTTPException(status_code=400, detail="Missing student_id or image data")

    print(f"DEBUG: Received frame for student {student_id}")

    # Initialize session if not exists
    if student_id not in proctor_sessions:
        print(f"DEBUG: Starting new session for {student_id}")
        proctor_sessions[student_id] = ProctoringManager()

    # Decode base64 image
    try:
        if "," in frame_b64:
            frame_b64 = frame_b64.split(",")[1]
        
        nparr = np.frombuffer(base64.b64decode(frame_b64), np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            print("DEBUG: Failed to decode image from base64")
            raise ValueError("Failed to decode image")

        # Analyze frame
        result = proctor_sessions[student_id].analyze_frame(frame)
        print(f"DEBUG: Result for {student_id}: suspicious={result['suspicious']}, reasons={result['reasons']}")
        return result

    except Exception as e:
        print(f"DEBUG: Proctoring Error: {e}")
        return {"suspicious": False, "reasons": [], "trust_score": 100}

@router.post("/proctor/event")
async def report_proctor_event(data: dict):
    student_id = data.get("student_id")
    event_type = data.get("event")

    if not student_id or not event_type:
        raise HTTPException(status_code=400, detail="Missing student_id or event")

    if student_id not in proctor_sessions:
        # If session doesn't exist, we can't report an event to it
        # In a real app, this might happen if the camera isn't started yet
        proctor_sessions[student_id] = ProctoringManager()

    result = proctor_sessions[student_id].report_event(event_type)
    return result

@router.delete("/proctor/session/{student_id}")
async def end_proctor_session(student_id: str):
    if student_id in proctor_sessions:
        del proctor_sessions[student_id]
    return {"status": "session ended"}
