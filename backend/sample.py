import pymongo

# MongoDB connection parameters
database_name = "Inventory_Management"
collection_name = "InventoryDataPOC"

# Array of documents to insert
data_array = [
  {
    "id": 812,
    "Part Name": "Clamp",
    "MFD": "2025-07-04",
    "Unit of Measurement": "set",
    "available quantity": 72,
    "price per unit": "87.24",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 540,
    "Part Name": "Valve",
    "MFD": "2026-05-22",
    "Unit of Measurement": "set",
    "available quantity": 65,
    "price per unit": "33.17",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 463,
    "Part Name": "Axle",
    "MFD": "2024-02-23",
    "Unit of Measurement": "set",
    "available quantity": 94,
    "price per unit": "17.12",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 267,
    "Part Name": "Bearing",
    "MFD": "2028-03-04",
    "Unit of Measurement": "pc",
    "available quantity": 98,
    "price per unit": "34.98",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 134,
    "Part Name": "Shaft",
    "MFD": "2025-12-16",
    "Unit of Measurement": "set",
    "available quantity": 89,
    "price per unit": "50.32",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 895,
    "Part Name": "Coupling",
    "MFD": "2024-06-17",
    "Unit of Measurement": "set",
    "available quantity": 10,
    "price per unit": "77.12",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 944,
    "Part Name": "Nut",
    "MFD": "2028-04-06",
    "Unit of Measurement": "set",
    "available quantity": 85,
    "price per unit": "10.94",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 537,
    "Part Name": "Gear",
    "MFD": "2027-08-25",
    "Unit of Measurement": "pc",
    "available quantity": 9,
    "price per unit": "29.75",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 360,
    "Part Name": "Bushing",
    "MFD": "2026-06-04",
    "Unit of Measurement": "set",
    "available quantity": 6,
    "price per unit": "97.86",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 43,
    "Part Name": "Piston",
    "MFD": "2027-07-19",
    "Unit of Measurement": "pc",
    "available quantity": 91,
    "price per unit": "47.10",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 654,
    "Part Name": "Pulley",
    "MFD": "2023-06-25",
    "Unit of Measurement": "set",
    "available quantity": 46,
    "price per unit": "90.88",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 117,
    "Part Name": "Spring",
    "MFD": "2026-05-27",
    "Unit of Measurement": "set",
    "available quantity": 55,
    "price per unit": "57.89",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 199,
    "Part Name": "Shaft",
    "MFD": "2028-02-21",
    "Unit of Measurement": "pc",
    "available quantity": 79,
    "price per unit": "77.68",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 836,
    "Part Name": "Shaft",
    "MFD": "2023-07-07",
    "Unit of Measurement": "pc",
    "available quantity": 31,
    "price per unit": "27.60",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 411,
    "Part Name": "Screw",
    "MFD": "2027-11-24",
    "Unit of Measurement": "pc",
    "available quantity": 94,
    "price per unit": "85.61",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 644,
    "Part Name": "Gear",
    "MFD": "2025-04-04",
    "Unit of Measurement": "pc",
    "available quantity": 68,
    "price per unit": "60.43",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 783,
    "Part Name": "Bearing",
    "MFD": "2027-06-21",
    "Unit of Measurement": "set",
    "available quantity": 26,
    "price per unit": "27.82",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 459,
    "Part Name": "Gear",
    "MFD": "2028-03-17",
    "Unit of Measurement": "pc",
    "available quantity": 45,
    "price per unit": "95.61",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 714,
    "Part Name": "Valve",
    "MFD": "2028-01-14",
    "Unit of Measurement": "pc",
    "available quantity": 27,
    "price per unit": "85.70",
    "part image": "null",
    "invoice image": "null"
  },
  {
    "id": 259,
    "Part Name": "Bolt",
    "MFD": "2026-01-22",
    "Unit of Measurement": "set",
    "available quantity": 24,
    "price per unit": "52.12",
    "part image": "null",
    "invoice image": "null"
  }
]

# MongoDB connection
client = pymongo.MongoClient(f"mongodb+srv://mongo-user:user@cluster0.r05dlnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client[database_name]
collection = db[collection_name]

# Insert each document into the collection
for doc in data_array:
    collection.insert_one(doc)

print("Documents inserted successfully.")
