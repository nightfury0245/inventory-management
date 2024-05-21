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
inventory_collection = db[config.inventory_poc_collection_name]
neworder_collection = db[config.neworder_poc_collection_name]

@app.route("/", methods=['GET'])
def helloworld():
    return "Hello World!"

@app.route("/getInventory", methods=['GET'])
def getInventory():
    # write a python script to connect to mongoDB and retrieve the inventory data
    # Frontend expects the following format:
    # id, Part Name, MFD, Unit of Measurement, available quantity, price per unit, part image, invoice image
    return_list = []
    # Retrieve all documents from the inventory_collection
    documents = inventory_collection.find()
    documents_array = json.dumps([json.loads(json.dumps(doc, default=str)) for doc in documents])

    # for document in documents_array:
    #     json_doc = json.loads(document)
    #     temp = {}
        # compute total quantity available

    return documents_array

@app.route("/placeOrder", methods=["GET", "POST"])
def placeOrder():
    # Parse the request data
    body = request.get_json()
    ordername = body['ordername']
    orderItems = body['orderitems']

    # Create the order document to insert
    order_document = {
        'ordername': ordername,
        'orderitems': orderItems
    }

    # MongoDB query to insert order into the database
    try:
        status = neworder_collection.insert_one(order_document)
        if status.acknowledged:
            return jsonify({"message": "Order placed successfully"}), 201
        else:
            return jsonify({"message": "Error placing order"}), 500
    except Exception as e:
        return jsonify({"message": str(e)}), 500

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
