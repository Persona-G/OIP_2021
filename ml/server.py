import sys
from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler
import tensorflow as tf
import cv2
import imageio
from tensorflow.python.keras.saving.save import load_model

server_add = "192.168.113.66"

def load():
    global loaded_model
    print("loading")
    loaded_model = tf.keras.models.load_model('model/mySyringe.h5')  # load tensorflow model
    print("Model Loaded Successfully")
    return "done"

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
        return "dirty"
    elif predict == 1:
        print("Clean")
        return "clean"
    else:
        print("Wet")
        return "wet"
    
def ml():
    # Read the image 
    img = imageio.imread("sample/image.jpg") 
    height, width, x = img.shape

    # Cut the image in half 
    width_cutoff = width // 2 
    s1 = img[:, :width_cutoff] 
    s2 = img[:, width_cutoff:]

    # Save each half 
    imageio.imsave("sample/img1.png", s1) 
    imageio.imsave("sample/img2.png", s2)

    # prepare the image1
    imgpath = 'sample/img1.png'

    # prediction
    result1 = prediction(loaded_model, imgpath)

    # prepare the image2
    imgpath = 'sample/img2.png'

    # prediction
    result2 = prediction(loaded_model, imgpath)
    
    result = [result1, result2]
    
    return result

def server_receive_file(arg):
    with open("sample/image.jpg", "wb") as handle:
        handle.write(arg.data)
        return True


class RequestHandler(SimpleXMLRPCRequestHandler):
    def __init__(self, request, client_address, server):
        # print(client_address[0]) # do what you need to do with client_address here
        SimpleXMLRPCRequestHandler.__init__(self, request, client_address, server)

with SimpleXMLRPCServer((server_add, 5000), requestHandler=RequestHandler) as server:
    server.register_function(load, "load")
    server.register_function(ml, "ml")
    server.register_function(server_receive_file, "server_receive_file")
    print('Serving initiating...')

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nKeyboard interrupt received, exiting.")
        sys.exit(0)