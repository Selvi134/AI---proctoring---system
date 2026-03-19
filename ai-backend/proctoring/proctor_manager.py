import cv2
import mediapipe.python.solutions.face_mesh as mp_face_mesh

from .head_pose import HeadPoseDetector
from .trust_manager import TrustManager
from .multiple_face import MultipleFaceDetector
from .eye_gaze import EyeGazeDetector
from .face_absence import FaceAbsenceDetector
from .object_detector import ObjectDetector


class ProctoringManager:
    def __init__(self):
        print("DEBUG: Initializing ProctoringManager...")

        self.head_detector = HeadPoseDetector()
        self.eye_detector = EyeGazeDetector()
        self.absence_detector = FaceAbsenceDetector(max_seconds=4)
        self.multi_face_detector = MultipleFaceDetector()
        self.object_detector = ObjectDetector()
        self.trust_system = TrustManager()

        self.face_mesh = mp_face_mesh.FaceMesh(
            refine_landmarks=True,
            max_num_faces=3,
            min_detection_confidence=0.6,
            min_tracking_confidence=0.6
        )

        self.frame_count = 0
        print("DEBUG: ProctoringManager initialized successfully.")

    def analyze_frame(self, frame):
        self.frame_count += 1

        # Resize frame
        frame = cv2.resize(frame, (640, 480))
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(frame_rgb)

        reasons = []
        suspicious_detected = False

        # 1. Multiple Face
        face_result = self.multi_face_detector.detect(frame, results)
        if face_result["suspicious"]:
            suspicious_detected = True
            reasons.append(face_result["reason"])
            self.trust_system.add_event(face_result["reason"], face_result["points"])

        # 2. Face Absence
        absence_result = self.absence_detector.detect(results)
        if absence_result["suspicious"]:
            suspicious_detected = True
            reasons.append(absence_result["reason"])
            self.trust_system.add_event(absence_result["reason"], absence_result["points"])

        # 3. Head Pose & Eye Gaze
        if results and results.multi_face_landmarks:

            head_result = self.head_detector.detect(frame, results)
            if head_result["suspicious"]:
                suspicious_detected = True
                reasons.append(head_result["reason"])
                self.trust_system.add_event(head_result["reason"], head_result["points"])

            eye_result = self.eye_detector.detect(frame, results)
            if eye_result["suspicious"]:
                suspicious_detected = True
                reasons.append(eye_result["reason"])
                self.trust_system.add_event(eye_result["reason"], eye_result["points"])

        # 4. Object Detection (ALWAYS)
        obj_result = self.object_detector.detect(frame)
        if obj_result["suspicious"]:
            suspicious_detected = True
            reasons.append(obj_result["reason"])
            self.trust_system.add_event(obj_result["reason"], obj_result["points"])

        # FINAL RETURN
        return {
            "suspicious": suspicious_detected,
            "reasons": reasons,
            "trust_score": self.trust_system.get_trust_percentage()
        }