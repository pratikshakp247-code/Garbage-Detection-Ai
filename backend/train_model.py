import os
import torch
from ultralytics import YOLO

def main():
    # Setup paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_yaml_path = os.path.join(base_dir, "garbage_dataset", "data.yaml")
    
    if not os.path.exists(data_yaml_path):
        print(f"Error: data.yaml not found at {data_yaml_path}. Please make sure you have placed the Garbage Dataset here.")
        return

    # Check CUDA GPU acceleration
    device = 0 if torch.cuda.is_available() else "cpu"
    print(f"Starting YOLOv8 training on device: {device}...")
    
    # Start training from pretrained yolov8s.pt model for better accuracy
    # (yolov8s.pt is the small model, providing better accuracy than nano)
    model = YOLO("yolov8s.pt")
    
    # Train the model
    results = model.train(
        data=data_yaml_path,
        epochs=100,            # Increased to 100 epochs for better accuracy
        imgsz=640,             # Image size
        batch=2,               # Keep at 2 if VRAM is low. Increase if you have more memory.
        workers=0,             # Set workers to 0 to prevent WinError 1455 on Windows
        val=True,              # Enabled validation to measure if we hit 90-95% accuracy
        patience=30,           # Early stopping if accuracy doesn't improve for 30 epochs
        optimizer='AdamW',     # Force AdamW optimizer
        device=device,         # Use GPU (0) or CPU
        name="garbage_model"
    )
    
    print("\nTraining completed successfully!")
    print("The best weights are saved at: runs/detect/garbage_model/weights/best.pt")

if __name__ == "__main__":
    main()
