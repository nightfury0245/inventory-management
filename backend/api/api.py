from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pymongo
from bson import ObjectId
import json
from werkzeug.utils import secure_filename
import config
import os
import traceback
import spacy
import tabula
import pandas as pd
import re

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = pymongo.MongoClient(f"mongodb+srv://mongo-user:user@cluster0.r05dlnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client[config.database_name]
inventory_collection = db[config.inventory_poc_collection_name]
neworder_collection = db[config.neworder_poc_collection_name]

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def clean_table(table):
    table = table.dropna(how='all')
    
    table = table.applymap(lambda x: x.replace('\t', '').strip() if isinstance(x, str) else x)
    
    return table

def remove_special_characters(text):
    return re.sub(r'[^A-Za-z0-9 ]+', '', text)

def row_to_single_string(row):
    row = row.dropna()
    combined_string = ' '.join(row.astype(str)).replace('\n', '')
    cleaned_string = remove_special_characters(combined_string)
    return cleaned_string

def extract_and_process_tables_from_pdf(pdf_path):
    tables = tabula.read_pdf(pdf_path, pages='all', multiple_tables=True)
    
    cleaned_tables = [clean_table(table) for table in tables]
    combined_table = pd.concat(cleaned_tables, ignore_index=True)
    
    combined_table_as_strings = combined_table.apply(row_to_single_string, axis=1).tolist()
    
    return combined_table_as_strings

def load_model(model_path):
    model = spacy.load(model_path)
    return model

def classify_sentence_for_validity(nlp, sentence):
    doc = nlp(sentence)
    return doc.cats

def classify_sentence(nlp, sentence):
    doc = nlp(sentence)
    entities = {ent.label_: ent.text for ent in doc.ents}
    return (sentence, entities)

def extract_classify_and_print_valid_sentences(pdf_path, model_path, entity_model_path):
    processed_sentences = extract_and_process_tables_from_pdf(pdf_path)
    validity_nlp = load_model(model_path)
    entity_nlp = load_model(entity_model_path)
    valid_sentences = []
    for sentence in processed_sentences:
        classification = classify_sentence_for_validity(validity_nlp, sentence)
        if classification.get("VALID", 0.5) >= 0.5:
            valid_sentence, entities = classify_sentence(entity_nlp, sentence)
            valid_sentences.append({"sentence": valid_sentence, "entities": entities})
    valid_sentences_json = json.dumps({"valid_sentences": valid_sentences}, indent=4)
    
    return valid_sentences_json

@app.route("/", methods=['GET'])
def helloworld():
    return "Hello World!"

@app.route("/getInventory", methods=['GET'])
def getInventory():
    try:
        documents = inventory_collection.find()
        documents_array = json.dumps([json.loads(json.dumps(doc, default=str)) for doc in documents])
        return documents_array
    except Exception as e:
        error_message = str(e)
        error_traceback = traceback.format_exc()
        print(f"Error: {error_message}")
        print(f"Traceback: {error_traceback}")
        return jsonify({'error': error_message}), 500

@app.route("/getOrders", methods=['GET'])
def getOrders():
    try:
        orders = neworder_collection.find()
        orders_array = json.dumps([json.loads(json.dumps(order, default=str)) for order in orders])
        return orders_array
    except Exception as e:
        error_message = str(e)
        error_traceback = traceback.format_exc()
        print(f"Error: {error_message}")
        print(f"Traceback: {error_traceback}")
        return jsonify({'error': error_message}), 500

from bson.errors import InvalidId
    
@app.route("/updateOrder/<order_id>", methods=['PUT'])
def updateOrder(order_id):
    try:
        # Validate the ObjectId
        try:
            object_id = ObjectId(order_id)
        except InvalidId:
            return jsonify({'error': f'Invalid ObjectId: {order_id}'}), 400

        order_update = request.get_json()
        # Ensure no '_id' field in the order update object
        if '_id' in order_update:
            del order_update['_id']

        neworder_collection.update_one(
            {'_id': object_id},
            {'$set': order_update}
        )
        return jsonify({'message': 'Order updated successfully'}), 200
    except Exception as e:
        error_message = str(e)
        error_traceback = traceback.format_exc()
        print(f"Error: {error_message}")
        print(f"Traceback: {error_traceback}")
        return jsonify({'error': error_message}), 500

@app.route("/placeOrder", methods=["POST"])
def placeOrder():
    try:
        body = request.form.to_dict()
        ordername = body['ordername']
        orderitems = json.loads(body['orderitems'])

        order_document = {
            'ordername': ordername,
            'orderitems': orderitems,
            'status': 'ongoing'  # Default status when placing a new order
        }

        if 'orderImage' in request.files:
            order_image = request.files['orderImage']
            image_filename = secure_filename(order_image.filename)
            order_image.save(os.path.join(UPLOAD_FOLDER, image_filename))
            order_document['orderImage'] = image_filename

        status = neworder_collection.insert_one(order_document)
        if status.acknowledged:
            return jsonify({"message": "Order placed successfully"}), 200
        else:
            return jsonify({"message": "Error placing order"}), 500
    except Exception as e:
        error_message = str(e)
        error_traceback = traceback.format_exc()
        print(f"Error: {error_message}")
        print(f"Traceback: {error_traceback}")
        return jsonify({'error': error_message}), 500

@app.route("/addInventory", methods=['POST'])
def addInventory():
    try:
        partName = request.form.get('partName')
        quantity = int(request.form.get('quantity'))
        inventory_entry = {
            'quantity': quantity,
            'date': request.form.get('date'),
            'invoiceNumber': request.form.get('invoiceNumber'),
            'perPartPrice': request.form.get('perPartPrice'),
        }
        if 'invoiceFile' in request.files:
            invoice_file = request.files['invoiceFile']
            invoice_filename = secure_filename(invoice_file.filename)
            invoice_file.save(os.path.join(UPLOAD_FOLDER, invoice_filename))
            inventory_entry['invoiceFile'] = invoice_filename
        if 'imageFile' in request.files:
            image_file = request.files['imageFile']
            image_filename = secure_filename(image_file.filename)
            image_file.save(os.path.join(UPLOAD_FOLDER, image_filename))
            inventory_entry['imageFile'] = image_filename

        existing_part = inventory_collection.find_one({"partName": partName})

        if existing_part:
            # Update the existing document
            inventory_collection.update_one(
                {"_id": existing_part["_id"]},
                {
                    "$inc": {"totalQuantity": quantity, "freeQuantity": quantity},
                    "$push": {"inventoryEntries": inventory_entry}
                }
            )
        else:
            # Create a new document
            part = {
                'partName': partName,
                'moi': request.form.get('moi'),
                'totalQuantity': quantity,
                'freeQuantity': quantity,
                'inventoryEntries': [inventory_entry]
            }
            inventory_collection.insert_one(part)
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
        if '_id' in part:
            del part['_id']
        if 'inventoryEntries' in part:
            # Ensure new entries are correctly added to the inventoryEntries array
            for entry in part['inventoryEntries']:
                inventory_collection.update_one(
                    {'_id': ObjectId(id)},
                    {'$push': {'inventoryEntries': entry}}
                )
            del part['inventoryEntries']
        
        # Update other fields
        inventory_collection.update_one({'_id': ObjectId(id)}, {'$set': part})
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
        inventory_collection.delete_one({'_id': ObjectId(id)})
        return jsonify({'message': 'Inventory deleted successfully'}), 200
    except Exception as e:
        error_message = str(e)
        error_traceback = traceback.format_exc()
        print(f"Error: {error_message}")
        print(f"Traceback: {error_traceback}")
        return jsonify({'error': error_message}), 500

@app.route('/updateOrderItem/<order_id>/<item_id>', methods=['PUT'])
def updateOrderItem(order_id, item_id):
    try:
        item_update = request.get_json()
        # Ensure no '_id' field in the item update object
        if '_id' in item_update:
            del item_update['_id']
        
        # Update the specific item in the order
        neworder_collection.update_one(
            {'_id': ObjectId(order_id), 'orderitems._id': ObjectId(item_id)},
            {'$set': {'orderitems.$': item_update}}
        )
        return jsonify({'message': 'Order item updated successfully'}), 200
    except Exception as e:
        error_message = str(e)
        error_traceback = traceback.format_exc()
        print(f"Error: {error_message}")
        print(f"Traceback: {error_traceback}")
        return jsonify({'error': error_message}), 500

@app.route('/deleteOrderItem/<order_id>/<item_id>', methods=['DELETE'])
def deleteOrderItem(order_id, item_id):
    try:
        # Remove the specific item from the order
        neworder_collection.update_one(
            {'_id': ObjectId(order_id)},
            {'$pull': {'orderitems': {'_id': ObjectId(item_id)}}}
        )
        return jsonify({'message': 'Order item deleted successfully'}), 200
    except Exception as e:
        error_message = str(e)
        error_traceback = traceback.format_exc()
        print(f"Error: {error_message}")
        print(f"Traceback: {error_traceback}")
        return jsonify({'error': error_message}), 500


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/process_invoice', methods=['POST'])
def process_invoice():
    try:
        if 'invoice' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        invoice_file = request.files['invoice']
        filename = secure_filename(invoice_file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        invoice_file.save(filepath)

        # Path to your trained spaCy models
        validity_model_path = './textcat_model'
        entity_model_path = './model'

        # Extract and classify sentences from the uploaded PDF
        result = extract_classify_and_print_valid_sentences(filepath, validity_model_path, entity_model_path)
        result_dict = json.loads(result)  # Ensure it's a dictionary
        return jsonify(result_dict), 200
    except Exception as e:
        error_message = str(e)
        error_traceback = traceback.format_exc()
        print(f"Error: {error_message}")
        print(f"Traceback: {error_traceback}")
        return jsonify({'error': error_message}), 500


if __name__ == '__main__':
    app.run(debug=True, host = "0.0.0.0", port = 5000)
