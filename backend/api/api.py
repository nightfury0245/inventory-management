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
    # Frontend expects the following format:
    # id, Part Name, MFD, Unit of Measurement, available quantity, price per unit, part image, invoice image
    #
    client = pymongo.MongoClient(f"mongodb+srv://mongo-user:user@cluster0.r05dlnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client[config.database_name]
    collection = db[config.inventory_poc_collection_name]
    return_list = []
    # Retrieve all documents from the collection
    documents = collection.find()
    
    # Convert documents to JSON objects and store them in an array
    documents_array = json.dumps([json.loads(json.dumps(doc, default=str)) for doc in documents])

    for document in documents_array:
        json_doc = json.loads(document)
        temp = {}
        # compute total quantity available

    return documents_array

@app.route("/placeOrder")
def placeOrder():
    # basically for POC we get order name and a json object like : [ {partname, quantity, partperpiece }]

    return "error palcing order"

if __name__ == '__main__':
    app.run(debug=True)