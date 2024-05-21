from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
import json
from werkzeug.utils import secure_filename
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
    try:
        parts = []
        index = 0

        while f'parts[{index}][partName]' in request.form:
            part = {
                'partName': request.form.get(f'parts[{index}][partName]'),
                'moi': request.form.get(f'parts[{index}][moi]'),
                'perPartPrice': request.form.get(f'parts[{index}][perPartPrice]'),
                'quantity': request.form.get(f'parts[{index}][quantity]'),
                'invoiceNumber': request.form.get(f'parts[{index}][invoiceNumber]')
            }
            image_file = request.files.get(f'parts[{index}][imageFile]')
            if image_file:
                filename = secure_filename(image_file.filename)
                image_file.save(f'./uploads/{filename}')
                part['imageFile'] = filename

            parts.append(part)
            index += 1

        inventory = {
            'date': request.form.get('date'),
            'invoiceFile': secure_filename(request.files['invoiceFile'].filename) if 'invoiceFile' in request.files else None,
            'parts': parts
        }

        if 'invoiceFile' in request.files:
            request.files['invoiceFile'].save(f"./uploads/{inventory['invoiceFile']}")

        collection.insert_one(inventory)
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

@app.route("/updateInventory/<int:id>", methods=['PUT'])
def updateInventory(id):
    try:
        parts = []
        index = 0

        while f'parts[{index}][partName]' in request.form:
            part = {
                'partName': request.form.get(f'parts[{index}][partName]'),
                'moi': request.form.get(f'parts[{index}][moi]'),
                'perPartPrice': request.form.get(f'parts[{index}][perPartPrice]'),
                'quantity': request.form.get(f'parts[{index}][quantity]'),
                'invoiceNumber': request.form.get(f'parts[{index}][invoiceNumber]')
            }
            image_file = request.files.get(f'parts[{index}][imageFile]')
            if image_file:
                filename = secure_filename(image_file.filename)
                image_file.save(f'./uploads/{filename}')
                part['imageFile'] = filename

            parts.append(part)
            index += 1

        inventory = {
            'date': request.form.get('date'),
            'invoiceFile': secure_filename(request.files['invoiceFile'].filename) if 'invoiceFile' in request.files else None,
            'parts': parts
        }

        if 'invoiceFile' in request.files:
            request.files['invoiceFile'].save(f"./uploads/{inventory['invoiceFile']}")

        collection.update_one({'id': id}, {'$set': inventory})
        return jsonify({'message': 'Inventory updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
