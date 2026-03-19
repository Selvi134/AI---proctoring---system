from ultralytics import YOLO
import time
import cv2


class ObjectDetector:

    def __init__(self):
        # Load lightweight model
        self.model = YOLO("yolov8n.pt")

        # Suspicious classes
        self.suspicious_objects = ["cell phone", "book"]

        # Timing logic
        self.detect_start_time = None
        self.cooldown_time = 1        # seconds between alerts
        self.last_alert_time = 0
        self.required_duration = 0.5    # continuous detection time

    def detect(self, frame):

        # Resize for speed (huge performance boost)
        small_frame = cv2.resize(frame, (640, 480))

        # Run YOLO with lower size for speed
        results = self.model(small_frame, verbose=False, imgsz=320)

        object_found = False
        detected_label = None

        for r in results:
            for box in r.boxes:

                confidence = float(box.conf[0])
                if confidence < 0.5:   # confidence threshold
                    continue

                cls_id = int(box.cls[0])
                label = self.model.names[cls_id]

                if label in self.suspicious_objects:
                    object_found = True
                    detected_label = label
                    break

            if object_found:
                break

        current_time = time.time()

        # ------------------------------
        # Continuous Detection Logic
        # ------------------------------
        if object_found:

            if self.detect_start_time is None:
                self.detect_start_time = current_time

            elapsed = current_time - self.detect_start_time

            # Trigger only if continuously visible
            if elapsed >= self.required_duration:

                # Cooldown protection
                if current_time - self.last_alert_time > self.cooldown_time:
                    self.last_alert_time = current_time

                    return {
                        "suspicious": True,
                        "reason": f"{detected_label} detected continuously",
                        "points": 10
                    }

        else:
            # Reset timer if object disappears
            self.detect_start_time = None

        return {"suspicious": False}
