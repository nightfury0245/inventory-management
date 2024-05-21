from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
import json
import config 

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = pymongo.MongoClient(f"mongodb+srv://mongo-user:user@cluster0.r05dlnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client[config.database_name]
collection = db[config.collection_name]

@app.route("/", methods=['GET'])
def helloworld():
    return "Hello World!"

@app.route("/getInventory", methods=['GET'])
def getInventory():
    documents = collection.find()
    documents_array = json.dumps([json.loads(json.dumps(doc, default=str)) for doc in documents])
    return documents_array

@app.route("/addInventory", methods=['POST'])
def addInventory():
    data = request.json
    try:
        collection.insert_one(data)
        return jsonify({'message': 'Inventory added successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/deleteInventory/<int:id>", methods=['DELETE'])
def deleteInventory(id):
    try:
        collection.delete_one({'id': id})
        return jsonify({'message': 'Inventory deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/updateInventory/<int:id>", methods=['POST'])
def updateInventory(id):
    data = request.json
    try:
        collection.update_one({'id': id}, {'$set': data})
        return jsonify({'message': 'Inventory updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
