import cv2
import mediapipe.python.solutions.face_mesh as mp_face_mesh
import time


class HeadPoseDetector:

    def __init__(self):
        self.look_start_time = None
        self.last_alert_time = 0
        self.cooldown = 2  # seconds between alerts

        self.face_mesh = mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def detect(self, frame, results=None):

        # Use existing results if passed (optimization)
        if results is None:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.face_mesh.process(rgb)

        # No face detected
        if not results or not results.multi_face_landmarks:
            self.look_start_time = None
            return {"suspicious": False}

        face_landmarks = results.multi_face_landmarks[0]

        # Nose Y position
        nose_y = face_landmarks.landmark[4].y

        current_time = time.time()

        # 🔽 Looking Down
        if nose_y > 0.65:

            if self.look_start_time is None:
                self.look_start_time = current_time

            elapsed = current_time - self.look_start_time

            # Trigger only if continuous for 2 seconds
            if elapsed > 2:
                if current_time - self.last_alert_time > self.cooldown:
                    self.last_alert_time = current_time

                    return {
                        "suspicious": True,
                        "reason": "Looking down continuously",
                        "points": 5
                    }

        # 🔼 Looking Up
        elif nose_y < 0.35:

            if self.look_start_time is None:
                self.look_start_time = current_time

            elapsed = current_time - self.look_start_time

            if elapsed > 2:
                if current_time - self.last_alert_time > self.cooldown:
                    self.last_alert_time = current_time

                    return {
                        "suspicious": True,
                        "reason": "Looking up continuously",
                        "points": 5
                    }

        else:
            # Reset if normal position
            self.look_start_time = None

        return {"suspicious": False}