# Imports
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical
import pandas as pd
import numpy as np
import pickle
import cv2

def dataset(df): 
	# empty list to store the image
	temp = []

	# loop through the data frame
	for imagePath in df.image_path:
		# load the image and convert it to RGB
		img = cv2.imread(imagePath)
		img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

		# resize the image
		img = cv2.resize(img, (224, 224))
		temp.append(img.astype("float"))

	# stack the arrays in the temporary variable and get the labels
	data = np.stack(temp)
	labels = np.array(df.label_id)

	# encode the labels and convert them in one-hot encoded form
	labels = le.transform(labels)
	labels = to_categorical(labels)
	
	# return a tuple of the data and labels
	return (data, labels)

if __name__ == "__main__":
    
    print("Loading Datasets")
    
    # Read classes.csv
    classDF = pd.read_csv('dataset/classes.csv', names=['image_path', 'label', 'label_id'])
    
    print(classDF)
    
    # filter values
    classDFShort = \
        classDF[(classDF['label'] == "dirty")
            | (classDF['label'] == "clean")
            | (classDF['label'] == "wet")]
    
    encodings = classDFShort["label_id"].unique()
    le = LabelEncoder().fit(encodings)
    
    trainDFShort = classDF[classDF.label_id.isin(encodings)]
    
    # build the training and testing datasets
    print("Building Dataset")
    (trainX, trainY) = dataset(trainDFShort)
    
    # split the dataset
    print("Splitting Dataset")
    (trainX, testX, trainY, testY) = train_test_split(trainX, trainY, test_size=0.2, stratify=trainY, random_state=42)

    splits = (
        ("dataset/trainX.cpickle", trainX),
        ("dataset/trainY.cpickle", trainY),
        ("dataset/testX.cpickle", testX),
        ("dataset/testY.cpickle", testY)
    )

    # loop over the data splits
    print("Serializing Dataset Splits")
    for (fileName, split) in splits:
        f = open(fileName, "wb")
        f.write(pickle.dumps(split))
        f.close()