from glob import glob
import pandas as pd

directory = []
labels = []
labels_id = []

if __name__ == "__main__":
    dirty = r"dataset\dirty"
    clean = r"dataset\clean"
    wet = r"dataset\wet"
    
    dirty_images = glob(dirty + '/*')
    clean_images = glob(clean + '/*')
    wet_images = glob(wet + '/*')
    
    for i in dirty_images:
        directory.append(i)
        labels.append("dirty")
        labels_id.append(0)
        
    for x in clean_images:
        directory.append(x)
        labels.append("clean")
        labels_id.append(1)
        
    for y in wet_images:
        directory.append(y)
        labels.append("wet")
        labels_id.append(2)
        
    

    data = {'image_path':  directory, 'label': labels, 'label_id': labels_id}
    df = pd.DataFrame(data, columns = ['image_path', 'label', 'label_id'])
    print (df)
    
    df.to_csv(r'dataset\classes.csv', header=None, index=None, sep=',', mode='w')