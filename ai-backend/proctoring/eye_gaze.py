import cv2
import time
import mediapipe.python.solutions.face_mesh as mp_face_mesh
import numpy as np


class EyeGazeDetector:

    def __init__(self, max_seconds=3):
        self.max_seconds = max_seconds
        self.look_start_time = None
        self.already_reported = False

    def detect(self, frame, results):
        if not results or not results.multi_face_landmarks:
            self.look_start_time = None
            return {"suspicious": False}

        landmarks = results.multi_face_landmarks[0].landmark
        h, w, _ = frame.shape

        # Left iris center (landmark 473) and right iris center (477) are available with refine_landmarks
        # Left eye outer corner: 33, inner corner: 133
        # Right eye outer corner: 362, inner corner: 263
        try:
            left_iris_x = landmarks[473].x * w
            left_eye_left_x = landmarks[33].x * w
            left_eye_right_x = landmarks[133].x * w

            right_iris_x = landmarks[477].x * w
            right_eye_left_x = landmarks[362].x * w
            right_eye_right_x = landmarks[263].x * w

            left_ratio = (left_iris_x - left_eye_left_x) / max(left_eye_right_x - left_eye_left_x, 1)
            right_ratio = (right_iris_x - right_eye_left_x) / max(right_eye_right_x - right_eye_left_x, 1)
            avg_ratio = (left_ratio + right_ratio) / 2

            # Looking far left or right
            if avg_ratio > 0.75 or avg_ratio < 0.25:
                if self.look_start_time is None:
                    self.look_start_time = time.time()
                elapsed = time.time() - self.look_start_time
                if elapsed > self.max_seconds and not self.already_reported:
                    self.already_reported = True
                    return {
                        "suspicious": True,
                        "reason": "Looking away from screen",
                        "points": 7
                    }
            else:
                self.look_start_time = None
                self.already_reported = False
        except Exception:
            pass

        return {"suspicious": False}
