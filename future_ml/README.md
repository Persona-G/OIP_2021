# Object Detection Model and Codes

**This section contains the codes and notebooks for object detection we tried throughout this project.**

The notebook and data for each YOLO version that we have tried are sorted into the different folders as stated below. Each folder also contains its own README to further elaborate the items that contain within it.

- YOLOv3

  The YOLOv3 was the first object detection that we tried to train. This proved unsuccessful as the weights produced could not detect any objects in the images that it was presented with. The reason why we decided to go with YOLOv3 as we figured that this would be the safest option when trying to run with the Intel NCS2 stick.

- YOLOv4

  After being unsuccessful with the Intel NCS2, the team decided to run the model using the Raspberry PI's CPU. The team experimented with YOLOv4 and found that the weights produced were too big.

- YOLOv4 - Tiny

  Using YOLOv4-Tiny produced a smaller weight and an even smaller model after it was converted to TFLite.

- YOLOv4-to-TFLite Converter (Google Colab)

  This folder contains the library to convert the weights and the notebook that does the conversion on Google Colab.
  
- YOLOv4-to-TFLite Converter (Raspberry PI)

  This folder contains the library to run the detection with the converted model on the Raspberry PI.
  
  

