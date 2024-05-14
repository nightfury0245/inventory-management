from flask import Flask, jsonify
from flask_cors import CORS
import pymongo
import json
import config 

app = Flask(__name__)
CORS(app)


@app.route("/", methods=['GET'])
def helloworld():
    return "Hello World!"

@app.route("/getInventory", methods=['GET', 'POST'])
def getInventory():
    # write a python script to connect to mongoDB and retrieve the inventory data
    # return jsonify([
    #     {"id": 1, "partName": 'Part A', "date": '2023-05-14', "unitOfMeasurement":'kg', "perPartPrice" : 10.5 },
    #     {"id": 2, "partName": 'Part B', "date": '2023-05-15', "unitOfMeasurement":'kg', "perPartPrice" : 12.0 }
    # ])
    client = pymongo.MongoClient(f"mongodb+srv://mongo-user:user@cluster0.r05dlnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client[config.database_name]
    collection = db[config.collection_name]

    # Retrieve all documents from the collection
    documents = collection.find()

    # Convert documents to JSON objects and store them in an array
    documents_array = json.dumps([json.loads(json.dumps(doc, default=str)) for doc in documents])
    return documents_array

if __name__ == '__main__':
    app.run(debug=True)