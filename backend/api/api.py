from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pymongo
import json
from werkzeug.utils import secure_filename
import config
import os
import traceback

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = pymongo.MongoClient(f"mongodb+srv://mongo-user:user@cluster0.r05dlnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client[config.database_name]
collection = db[config.collection_name]

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
        part = {
            'date': request.form.get('date'),
            'partName': request.form.get('partName'),
            'moi': request.form.get('moi'),
            'perPartPrice': request.form.get('perPartPrice'),
            'quantity': request.form.get('quantity'),
            'invoiceNumber': request.form.get('invoiceNumber'),
        }

        if 'invoiceFile' in request.files:
            invoice_file = request.files['invoiceFile']
            invoice_filename = secure_filename(invoice_file.filename)
            invoice_file.save(os.path.join(UPLOAD_FOLDER, invoice_filename))
            part['invoiceFile'] = invoice_filename

        if 'imageFile' in request.files:
            image_file = request.files['imageFile']
            image_filename = secure_filename(image_file.filename)
            image_file.save(os.path.join(UPLOAD_FOLDER, image_filename))
            part['imageFile'] = image_filename

        collection.insert_one(part)
        return jsonify({'message': 'Inventory added successfully'}), 200
    except Exception as e:
        error_message = str(e)
        error_traceback = traceback.format_exc()
        print(f"Error: {error_message}")
        print(f"Traceback: {error_traceback}")
        return jsonify({'error': error_message}), 500

@app.route('/updateInventory/<id>', methods=['PUT'])
def updateInventory(id):
    try:
        part = request.get_json()
        collection.update_one({'_id': pymongo.ObjectId(id)}, {'$set': part})
        return jsonify({'message': 'Inventory updated successfully'}), 200
    except Exception as e:
        error_message = str(e)
        error_traceback = traceback.format_exc()
        print(f"Error: {error_message}")
        print(f"Traceback: {error_traceback}")
        return jsonify({'error': error_message}), 500

@app.route('/deleteInventory/<id>', methods=['DELETE'])
def deleteInventory(id):
    try:
        collection.delete_one({'_id': pymongo.ObjectId(id)})
        return jsonify({'message': 'Inventory deleted successfully'}), 200
    except Exception as e:
        error_message = str(e)
        error_traceback = traceback.format_exc()
        print(f"Error: {error_message}")
        print(f"Traceback: {error_traceback}")
        return jsonify({'error': error_message}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(debug=True)
