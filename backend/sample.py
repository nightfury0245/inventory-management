import pymongo

# MongoDB connection parameters
database_name = "Inventory_Management"
collection_name = "InventoryData"

# Array of documents to insert
data_array = [
    {"id":1,"partName":"Part A","date":"2021-06-09","unitOfMeasurement":"pc","perPartPrice":74.82},
    {"id":2,"partName":"Part B","date":"2021-07-14","unitOfMeasurement":"kg","perPartPrice":92.07},
    {"id":3,"partName":"Part C","date":"2023-08-01","unitOfMeasurement":"kg","perPartPrice":73.07},
    {"id":4,"partName":"Part D","date":"2022-11-07","unitOfMeasurement":"kg","perPartPrice":52.69},
    {"id":5,"partName":"Part E","date":"2022-11-28","unitOfMeasurement":"pc","perPartPrice":5.95},
    {"id":6,"partName":"Part F","date":"2021-12-13","unitOfMeasurement":"pc","perPartPrice":29.96},
    {"id":7,"partName":"Part G","date":"2021-10-20","unitOfMeasurement":"kg","perPartPrice":33.57},
    {"id":8,"partName":"Part H","date":"2021-12-19","unitOfMeasurement":"kg","perPartPrice":64.01},
    {"id":9,"partName":"Part I","date":"2022-07-25","unitOfMeasurement":"pc","perPartPrice":91.19},
    {"id":10,"partName":"Part J","date":"2021-10-07","unitOfMeasurement":"kg","perPartPrice":41.6},
    {"id":11,"partName":"Part K","date":"2022-05-19","unitOfMeasurement":"pc","perPartPrice":99.3},
    {"id":12,"partName":"Part L","date":"2022-01-10","unitOfMeasurement":"kg","perPartPrice":10.36},
    {"id":13,"partName":"Part M","date":"2023-09-21","unitOfMeasurement":"kg","perPartPrice":78.08},
    {"id":14,"partName":"Part N","date":"2023-06-11","unitOfMeasurement":"pc","perPartPrice":54.05},
    {"id":15,"partName":"Part O","date":"2023-01-24","unitOfMeasurement":"pc","perPartPrice":60.85},
    {"id":16,"partName":"Part P","date":"2021-07-29","unitOfMeasurement":"kg","perPartPrice":64.77},
    {"id":17,"partName":"Part Q","date":"2023-05-02","unitOfMeasurement":"pc","perPartPrice":27.09},
    {"id":18,"partName":"Part R","date":"2022-06-29","unitOfMeasurement":"pc","perPartPrice":89.99},
    {"id":19,"partName":"Part S","date":"2022-02-16","unitOfMeasurement":"pc","perPartPrice":72.73},
    {"id":20,"partName":"Part T","date":"2021-10-02","unitOfMeasurement":"kg","perPartPrice":65.62}
]

# MongoDB connection
client = pymongo.MongoClient(f"mongodb+srv://mongo-user:user@cluster0.r05dlnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client[database_name]
collection = db[collection_name]

# Insert each document into the collection
for doc in data_array:
    collection.insert_one(doc)

print("Documents inserted successfully.")
