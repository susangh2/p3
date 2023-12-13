from sanic import Sanic
from sanic.response import json
import tensorflow as tf
import numpy as np
import pathlib

batch_size = 32
img_height = 180
img_width = 180

dataset_dir = "../keepfit/finailed-test-data/"
# dataset_dir = "../keepfit/small-training-img-dataset/"
data_dir = pathlib.Path(dataset_dir).with_suffix('')
data_dir

test_ds = tf.keras.utils.image_dataset_from_directory(
  data_dir,
  validation_split=0.2,
  subset="training",
  seed=123,
  image_size=(img_height, img_width),
  batch_size=batch_size)

class_names = test_ds.class_names

print(class_names)

app = Sanic("model")

model = tf.saved_model.load('./model')

@app.post("/ai/predict")
def callModel(request):
    print('call model, body:', request.json['file_path']) 
    # C:\Users\Susan\Documents\badproject\keepfit\public\mealphotos\162307d8-2494-460d-b6ee-843209e5e907.jpeg
    
    img = tf.keras.utils.load_img(
        request.json['file_path'],
        target_size=(img_height, img_width)
    ) 
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0) # Create a batch

    predictions = model(img_array, training=False)
    probs = tf.nn.softmax(predictions)

    class_indexes = tf.argmax(probs, axis = 1).numpy()
    results = []

    for i, class_idx in enumerate(class_indexes):
        name = class_names[class_idx]
        p = np.max(probs[i].numpy())
        results.append({
            "name": name,
            "probability": float(p)
        })

    return json({ "results": results })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, single_process=True)