import time
import mediapipe.python.solutions.face_mesh as mp_face_mesh
import cv2


class FaceAbsenceDetector:

    def __init__(self, max_seconds=4):
        self.max_seconds = max_seconds
        self.start_time = None
        self.already_reported = False

    def detect(self, results):
        # No face detected
        if not results.multi_face_landmarks:
            if self.start_time is None:
                self.start_time = time.time()
            elapsed = time.time() - self.start_time
            if elapsed > self.max_seconds and not self.already_reported:
                self.already_reported = True
                return {
                    "suspicious": True,
                    "reason": f"Left camera for {int(elapsed)} seconds",
                    "points": 8
                }
        else:
            # Face came back → reset
            self.start_time = None
            self.already_reported = False

        return {"suspicious": False}
