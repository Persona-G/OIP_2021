import tensorflow as tf
import cv2
from scipy import misc
import imageio

# Load the tensorflow model
def loadmodel():
    loaded_model = tf.keras.models.load_model('model/mySyringe.h5')  # load tensorflow model
    
    return loaded_model


# prepare the input image into what the model desire
def prepare(filepath):
    IMAGE_SIZE = 224  # set the image size to 224
    img_array = cv2.imread(filepath)  # read the image in
    print(img_array.shape)
    new_array = cv2.resize(img_array, (IMAGE_SIZE, IMAGE_SIZE))  # resize the image
    new_image = new_array.reshape(-1, IMAGE_SIZE, IMAGE_SIZE, 3)  # reshape the image to what the model desire
    return new_image


# predicting the input image
def prediction(model,imgpath):
    test = model.predict([prepare(imgpath)])
    print("Predicting")
    print(test)
    predict = test.argmax()  # predict the categories
    if predict == 0:
        print("Dirty")
    elif predict == 1:
        print("Clean")
    else:
        print("Wet")


## MAIN PROGRAM START HERE

# call the load model function
loaded_model = loadmodel()
print("Loaded Successfully")

# Read the image 
img = imageio.imread("sample/sample1.jpg") 
height, width, x = img.shape

# Cut the image in half 
width_cutoff = width // 2 
s1 = img[:, :width_cutoff] 
s2 = img[:, width_cutoff:]

# Save each half 
imageio.imsave("sample/img3.png", s1) 
imageio.imsave("sample/img4.png", s2)

# prepare the image1
imgpath = r'sample\img3.png'

# prediction
prediction(loaded_model, imgpath)

# prepare the image2
imgpath = r'sample\img4.png'

# prediction
prediction(loaded_model, imgpath)

