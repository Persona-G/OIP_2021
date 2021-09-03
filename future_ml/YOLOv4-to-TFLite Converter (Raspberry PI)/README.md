# YOLOv4-to-TFLite Converter (Raspberry PI)

Below are the list of files that are contained in this folder along with their description:

- tensorflow-yolov4-tflite.zip

  Contains the library along with scripts that does the detection on Raspberry PI. The ZIP file also contains a "requirements.txt", a list of Python libraries that are needed to run the detector.

  In the ZIP file also contains some images for testing the converter and the TFLite models that were already converted from the YOLOv4-Tiny model. To run the converter, ensure that a Python environment running a Python 3.7.3 version contains the libraries listed in the "requirements.txt" file. To run the converter:

  ```bash
  $ python detect.py --weights ./checkpoints/yolov4-tiny-416-fp16.tflite --size 416 --model yolov4 --tiny --image Webcam_Pic.jpg --framework tflite
  ```

  

