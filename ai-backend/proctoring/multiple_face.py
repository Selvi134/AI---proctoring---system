import cv2
import mediapipe.python.solutions.face_mesh as mp_face_mesh
import time


class MultipleFaceDetector:

    def __init__(self, max_seconds=2):
        self.face_mesh = mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=5,
            min_detection_confidence=0.5
        )
        self.max_seconds = max_seconds
        self.start_time = None
        self.already_reported = False

    def detect(self, frame=None, results=None):
        if results is None and frame is not None:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.face_mesh.process(rgb)

        if results and results.multi_face_landmarks and len(results.multi_face_landmarks) > 1:
            if self.start_time is None:
                self.start_time = time.time()
            elapsed = time.time() - self.start_time
            if elapsed > self.max_seconds and not self.already_reported:
                self.already_reported = True
                return {
                    "suspicious": True,
                    "reason": f"Multiple faces detected ({len(results.multi_face_landmarks)})",
                    "points": 15
                }
        else:
            self.start_time = None
            self.already_reported = False

        return {"suspicious": False}
