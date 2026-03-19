import sys
import os

def check_mediapipe():
    print(f"Python version: {sys.version}")
    try:
        import mediapipe as mp
        print(f"Mediapipe version: {mp.__version__}")
        print("Mediapipe path:", mp.__file__)
        
        # Check solutions access
        if hasattr(mp, 'solutions'):
            print("SUCCESS: mediapipe.solutions found.")
            if hasattr(mp.solutions, 'face_mesh'):
                print("SUCCESS: mediapipe.solutions.face_mesh found.")
            else:
                print("FAILURE: face_mesh not found in solutions.")
        else:
            print("FAILURE: mediapipe.solutions NOT found.")
            print("Available attributes in mediapipe:", dir(mp))
            
            # Try alternative import
            try:
                from mediapipe.python.solutions import face_mesh
                print("SUCCESS: Alternative import worked (mediapipe.python.solutions.face_mesh)")
            except Exception as e:
                print(f"FAILURE: Alternative import also failed: {e}")

    except ImportError:
        print("FAILURE: Mediapipe is NOT installed in this environment.")
        print("Please run: pip install mediapipe")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    check_mediapipe()
