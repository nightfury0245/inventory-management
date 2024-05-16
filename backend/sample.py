import pymongo

# MongoDB connection parameters
database_name = "Inventory_Management"
collection_name = "InventoryData"

# Array of documents to insert
data_array = [
    {
        "Item_id": 1,
        "Part Name": "rthNkKaPq",
        "Unit of measurement": "Set",
        "Quantity": [
            {
                "MFD": "2019-08-10",
                "available quantity": 130,
                "price per piece": 30,
                "Expiry Date": "2027-01-03",
                "Invoice ID": "hkCwXO"
            },
            {
                "MFD": "2021-07-14",
                "available quantity": 362,
                "price per piece": 30,
                "Expiry Date": "2026-07-07",
                "Invoice ID": "KIlAmZ"
            },
            {
                "MFD": "2018-10-17",
                "available quantity": 223,
                "price per piece": 30,
                "Expiry Date": "2026-04-27",
                "Invoice ID": "ogbjxD"
            },
            {
                "MFD": "2018-12-11",
                "available quantity": 123,
                "price per piece": 30,
                "Expiry Date": "2026-06-08",
                "Invoice ID": "VCjYPs"
            },
            {
                "MFD": "2019-10-07",
                "available quantity": 485,
                "price per piece": 30,
                "Expiry Date": "2027-01-08",
                "Invoice ID": "Dyrkzh"
            }
        ]
    },
    {
        "Item_id": 2,
        "Part Name": "ZZnKxz",
        "Unit of measurement": "Set",
        "Quantity": [
            {
                "MFD": "2021-04-25",
                "available quantity": 610,
                "price per piece": 30,
                "Expiry Date": "2026-07-02",
                "Invoice ID": "kHsPqY"
            },
            {
                "MFD": "2022-02-01",
                "available quantity": 762,
                "price per piece": 30,
                "Expiry Date": "2027-01-23",
                "Invoice ID": "vzFPLT"
            },
            {
                "MFD": "2019-07-19",
                "available quantity": 706,
                "price per piece": 30,
                "Expiry Date": "2026-07-22",
                "Invoice ID": "esUBZr"
            },
            {
                "MFD": "2021-08-23",
                "available quantity": 880,
                "price per piece": 30,
                "Expiry Date": "2026-09-13",
                "Invoice ID": "BfIOrj"
            },
            {
                "MFD": "2021-04-06",
                "available quantity": 258,
                "price per piece": 30,
                "Expiry Date": "2026-12-18",
                "Invoice ID": "KUtzJx"
            }
        ]
    },
    {
        "Item_id": 3,
        "Part Name": "EYkofKX",
        "Unit of measurement": "Set",
        "Quantity": [
            {
                "MFD": "2019-04-19",
                "available quantity": 816,
                "price per piece": 30,
                "Expiry Date": "2026-08-10",
                "Invoice ID": "XGxhGp"
            },
            {
                "MFD": "2019-01-14",
                "available quantity": 723,
                "price per piece": 30,
                "Expiry Date": "2026-11-24",
                "Invoice ID": "zQAtjf"
            },
            {
                "MFD": "2021-09-14",
                "available quantity": 248,
                "price per piece": 30,
                "Expiry Date": "2026-05-19",
                "Invoice ID": "SbDPxz"
            },
            {
                "MFD": "2019-03-28",
                "available quantity": 200,
                "price per piece": 30,
                "Expiry Date": "2026-03-20",
                "Invoice ID": "ahQnpy"
            },
            {
                "MFD": "2020-01-24",
                "available quantity": 438,
                "price per piece": 30,
                "Expiry Date": "2026-01-07",
                "Invoice ID": "NpAXkJ"
            }
        ]
    },
    {
        "Item_id": 4,
        "Part Name": "aMjngDvI",
        "Unit of measurement": "Pc",
        "Quantity": [
            {
                "MFD": "2019-06-12",
                "available quantity": 55,
                "price per piece": 30,
                "Expiry Date": "2027-04-12",
                "Invoice ID": "aPZywh"
            },
            {
                "MFD": "2020-07-09",
                "available quantity": 768,
                "price per piece": 30,
                "Expiry Date": "2026-03-11",
                "Invoice ID": "IgmpFt"
            },
            {
                "MFD": "2021-10-17",
                "available quantity": 512,
                "price per piece": 30,
                "Expiry Date": "2026-10-02",
                "Invoice ID": "EQkXVL"
            },
            {
                "MFD": "2020-06-29",
                "available quantity": 119,
                "price per piece": 30,
                "Expiry Date": "2026-05-01",
                "Invoice ID": "ONXCRz"
            },
            {
                "MFD": "2019-07-02",
                "available quantity": 877,
                "price per piece": 30,
                "Expiry Date": "2026-07-19",
                "Invoice ID": "CPhYlM"
            }
        ]
    },
    {
        "Item_id": 5,
        "Part Name": "YQcyKZUDgn",
        "Unit of measurement": "Pc",
        "Quantity": [
            {
                "MFD": "2021-03-25",
                "available quantity": 74,
                "price per piece": 30,
                "Expiry Date": "2026-12-09",
                "Invoice ID": "nmUaOX"
            },
            {
                "MFD": "2020-03-01",
                "available quantity": 612,
                "price per piece": 30,
                "Expiry Date": "2026-12-18",
                "Invoice ID": "vTgeBM"
            },
            {
                "MFD": "2019-03-20",
                "available quantity": 454,
                "price per piece": 30,
                "Expiry Date": "2026-09-22",
                "Invoice ID": "lRkmWn"
            },
            {
                "MFD": "2021-11-01",
                "available quantity": 188,
                "price per piece": 30,
                "Expiry Date": "2026-07-19",
                "Invoice ID": "SfdoKX"
            },
            {
                "MFD": "2020-08-02",
                "available quantity": 859,
                "price per piece": 30,
                "Expiry Date": "2026-06-14",
                "Invoice ID": "EwTLVc"
            }
        ]
    },
    {
        "Item_id": 6,
        "Part Name": "EukbQpZPcv",
        "Unit of measurement": "Pc",
        "Quantity": [
            {
                "MFD": "2021-02-06",
                "available quantity": 663,
                "price per piece": 30,
                "Expiry Date": "2026-11-09",
                "Invoice ID": "EkcFpZ"
            },
            {
                "MFD": "2020-06-04",
                "available quantity": 723,
                "price per piece": 30,
                "Expiry Date": "2026-07-22",
                "Invoice ID": "zDQIgr"
            },
            {
                "MFD": "2018-08-30",
                "available quantity": 571,
                "price per piece": 30,
                "Expiry Date": "2026-12-11",
                "Invoice ID": "sTbQuN"
            },
            {
                "MFD": "2020-07-25",
                "available quantity": 7,
                "price per piece": 30,
                "Expiry Date": "2026-10-28",
                "Invoice ID": "jKUvBI"
            },
            {
                "MFD": "2022-04-03",
                "available quantity": 554,
                "price per piece": 30,
                "Expiry Date": "2027-04-03",
                "Invoice ID": "AeXzGn"
            }
        ]
    },
    {
        "Item_id": 7,
        "Part Name": "hoxjeoXGb",
        "Unit of measurement": "Pc",
        "Quantity": [
            {
                "MFD": "2018-11-29",
                "available quantity": 433,
                "price per piece": 30,
                "Expiry Date": "2027-03-01",
                "Invoice ID": "FIxvdM"
            },
            {
                "MFD": "2021-07-08",
                "available quantity": 947,
                "price per piece": 30,
                "Expiry Date": "2026-06-20",
                "Invoice ID": "ohUjpf"
            },
            {
                "MFD": "2022-03-20",
                "available quantity": 152,
                "price per piece": 30,
                "Expiry Date": "2026-10-28",
                "Invoice ID": "KXpghc"
            },
            {
                "MFD": "2019-11-16",
                "available quantity": 975,
                "price per piece": 30,
                "Expiry Date": "2026-08-03",
                "Invoice ID": "PnmZBx"
            },
            {
                "MFD": "2021-01-27",
                "available quantity": 828,
                "price per piece": 30,
                "Expiry Date": "2027-03-04",
                "Invoice ID": "SzEieY"
            }
        ]
    },
    {
        "Item_id": 8,
        "Part Name": "cRUsbT",
        "Unit of measurement": "Set",
        "Quantity": [
            {
                "MFD": "2018-12-22",
                "available quantity": 97,
                "price per piece": 30,
                "Expiry Date": "2026-05-01",
                "Invoice ID": "MUNFcH"
            },
            {
                "MFD": "2021-06-23",
                "available quantity": 784,
                "price per piece": 30,
                "Expiry Date": "2027-04-16",
                "Invoice ID": "qCDYAr"
            },
            {
                "MFD": "2020-07-28",
                "available quantity": 755,
                "price per piece": 30,
                "Expiry Date": "2026-07-13",
                "Invoice ID": "JYhbgL"
            },
            {
                "MFD": "2018-12-07",
                "available quantity": 695,
                "price per piece": 30,
                "Expiry Date": "2026-12-30",
                "Invoice ID": "IhxfoV"
            },
            {
                "MFD": "2020-12-26",
                "available quantity": 365,
                "price per piece": 30,
                "Expiry Date": "2026-06-23",
                "Invoice ID": "pEmqUr"
            }
        ]
    },
    {
        "Item_id": 9,
        "Part Name": "ZjRGoVcq",
        "Unit of measurement": "Set",
        "Quantity": [
            {
                "MFD": "2020-05-01",
                "available quantity": 8,
                "price per piece": 30,
                "Expiry Date": "2026-05-14",
                "Invoice ID": "oJCyEd"
            },
            {
                "MFD": "2021-08-01",
                "available quantity": 805,
                "price per piece": 30,
                "Expiry Date": "2027-04-24",
                "Invoice ID": "sJgvKP"
            },
            {
                "MFD": "2020-07-14",
                "available quantity": 798,
                "price per piece": 30,
                "Expiry Date": "2026-06-10",
                "Invoice ID": "NRWoyL"
            },
            {
                "MFD": "2019-07-09",
                "available quantity": 63,
                "price per piece": 30,
                "Expiry Date": "2026-12-07",
                "Invoice ID": "wovBdZ"
            },
            {
                "MFD": "2021-10-07",
                "available quantity": 716,
                "price per piece": 30,
                "Expiry Date": "2026-07-10",
                "Invoice ID": "tYPdZk"
            }
        ]
    },
    {
        "Item_id": 10,
        "Part Name": "XRfhmG",
        "Unit of measurement": "Pc",
        "Quantity": [
            {
                "MFD": "2019-01-09",
                "available quantity": 333,
                "price per piece": 30,
                "Expiry Date": "2026-11-24",
                "Invoice ID": "KtuxZH"
            },
            {
                "MFD": "2022-01-05",
                "available quantity": 333,
                "price per piece": 30,
                "Expiry Date": "2026-10-09",
                "Invoice ID": "hFPXVq"
            },
            {
                "MFD": "2020-07-09",
                "available quantity": 333,
                "price per piece": 30,
                "Expiry Date": "2026-11-24",
                "Invoice ID": "RIyJbp"
            },
            {
                "MFD": "2021-10-19",
                "available quantity": 333,
                "price per piece": 30,
                "Expiry Date": "2026-11-24",
                "Invoice ID": "fJuxrK"
            },
            {
                "MFD": "2023-02-15",
                "available quantity": 333,
                "price per piece": 30,
                "Expiry Date": "2026-11-24",
                "Invoice ID": "pNzxYe"
            }
        ]
    },
    {
        "Item_id": 11,
        "Part Name": "LJmtvUdmx",
        "Unit of measurement": "Set",
        "Quantity": [
            {
                "MFD": "2020-09-10",
                "available quantity": 994,
                "price per piece": 30,
                "Expiry Date": "2026-10-05",
                "Invoice ID": "PzEDJt"
            },
            {
                "MFD": "2018-08-26",
                "available quantity": 733,
                "price per piece": 30,
                "Expiry Date": "2026-11-26",
                "Invoice ID": "SRkmus"
            },
            {
                "MFD": "2020-05-03",
                "available quantity": 620,
                "price per piece": 30,
                "Expiry Date": "2026-07-01",
                "Invoice ID": "BTWfXm"
            },
            {
                "MFD": "2020-02-08",
                "available quantity": 413,
                "price per piece": 30,
                "Expiry Date": "2026-06-05",
                "Invoice ID": "IPoqjL"
            },
            {
                "MFD": "2019-11-02",
                "available quantity": 787,
                "price per piece": 30,
                "Expiry Date": "2026-09-06",
                "Invoice ID": "Lcnqzr"
            }
        ]
    },
    {
        "Item_id": 12,
        "Part Name": "jIYGmS",
        "Unit of measurement": "Set",
        "Quantity": [
            {
                "MFD": "2021-05-06",
                "available quantity": 64,
                "price per piece": 30,
                "Expiry Date": "2026-10-13",
                "Invoice ID": "wKZjxF"
            },
            {
                "MFD": "2020-02-17",
                "available quantity": 222,
                "price per piece": 30,
                "Expiry Date": "2026-12-08",
                "Invoice ID": "uEZRdj"
            },
            {
                "MFD": "2020-01-26",
                "available quantity": 772,
                "price per piece": 30,
                "Expiry Date": "2026-05-10",
                "Invoice ID": "VjTCYO"
            },
            {
                "MFD": "2019-06-12",
                "available quantity": 537,
                "price per piece": 30,
                "Expiry Date": "2026-03-16",
                "Invoice ID": "aCtVgS"
            },
            {
                "MFD": "2019-03-18",
                "available quantity": 451,
                "price per piece": 30,
                "Expiry Date": "2026-03-05",
                "Invoice ID": "RtPuHW"
            }
        ]
    },
    {
        "Item_id": 13,
        "Part Name": "QgatWf",
        "Unit of measurement": "Pc",
        "Quantity": [
            {
                "MFD": "2019-11-03",
                "available quantity": 609,
                "price per piece": 30,
                "Expiry Date": "2026-11-01",
                "Invoice ID": "ZLGWBU"
            },
            {
                "MFD": "2021-04-21",
                "available quantity": 768,
                "price per piece": 30,
                "Expiry Date": "2026-04-28",
                "Invoice ID": "roKdCj"
            },
            {
                "MFD": "2019-10-17",
                "available quantity": 174,
                "price per piece": 30,
                "Expiry Date": "2026-08-13",
                "Invoice ID": "sYhtIA"
            },
            {
                "MFD": "2020-12-08",
                "available quantity": 564,
                "price per piece": 30,
                "Expiry Date": "2026-04-01",
                "Invoice ID": "MiwcaY"
            },
            {
                "MFD": "2018-10-01",
                "available quantity": 548,
                "price per piece": 30,
                "Expiry Date": "2026-06-07",
                "Invoice ID": "IRBJuk"
            }
        ]
    },
    {
        "Item_id": 14,
        "Part Name": "KwGJbIcZnP",
        "Unit of measurement": "Set",
        "Quantity": [
            {
                "MFD": "2020-09-19",
                "available quantity": 520,
                "price per piece": 30,
                "Expiry Date": "2026-08-19",
                "Invoice ID": "jSRyCq"
            },
            {
                "MFD": "2019-01-26",
                "available quantity": 497,
                "price per piece": 30,
                "Expiry Date": "2026-08-29",
                "Invoice ID": "OzwsyC"
            },
            {
                "MFD": "2018-10-28",
                "available quantity": 938,
                "price per piece": 30,
                "Expiry Date": "2026-06-02",
                "Invoice ID": "vKbLtF"
            },
            {
                "MFD": "2020-07-27",
                "available quantity": 123,
                "price per piece": 30,
                "Expiry Date": "2026-09-17",
                "Invoice ID": "oqRCYt"
            },
            {
                "MFD": "2020-06-06",
                "available quantity": 139,
                "price per piece": 30,
                "Expiry Date": "2026-03-25",
                "Invoice ID": "KdpRQW"
            }
        ]
    },
    {
        "Item_id": 15,
        "Part Name": "rgahjsfOxZ",
        "Unit of measurement": "Pc",
        "Quantity": [
            {
                "MFD": "2019-02-08",
                "available quantity": 349,
                "price per piece": 30,
                "Expiry Date": "2026-11-16",
                "Invoice ID": "ckoyQr"
            },
            {
                "MFD": "2022-01-23",
                "available quantity": 269,
                "price per piece": 30,
                "Expiry Date": "2026-09-14",
                "Invoice ID": "gMFAco"
            },
            {
                "MFD": "2021-10-04",
                "available quantity": 695,
                "price per piece": 30,
                "Expiry Date": "2026-05-03",
                "Invoice ID": "REuAYM"
            },
            {
                "MFD": "2019-04-09",
                "available quantity": 359,
                "price per piece": 30,
                "Expiry Date": "2026-09-29",
                "Invoice ID": "MvTcXl"
            },
            {
                "MFD": "2019-04-24",
                "available quantity": 459,
                "price per piece": 30,
                "Expiry Date": "2026-05-28",
                "Invoice ID": "LKEjUw"
            }
        ]
    },
    {
        "Item_id": 16,
        "Part Name": "cTglRz",
        "Unit of measurement": "Set",
        "Quantity": [
            {
                "MFD": "2018-12-21",
                "available quantity": 537,
                "price per piece": 30,
                "Expiry Date": "2026-08-08",
                "Invoice ID": "kwmPaG"
            },
            {
                "MFD": "2021-09-28",
                "available quantity": 358,
                "price per piece": 30,
                "Expiry Date": "2026-09-17",
                "Invoice ID": "wDGLTq"
            },
            {
                "MFD": "2020-08-21",
                "available quantity": 360,
                "price per piece": 30,
                "Expiry Date": "2026-04-10",
                "Invoice ID": "SJsfWy"
            },
            {
                "MFD": "2020-06-02",
                "available quantity": 706,
                "price per piece": 30,
                "Expiry Date": "2026-07-22",
                "Invoice ID": "NCVzUq"
            },
            {
                "MFD": "2018-08-27",
                "available quantity": 236,
                "price per piece": 30,
                "Expiry Date": "2026-04-12",
                "Invoice ID": "TDjFwl"
            }
        ]
    },
    {
        "Item_id": 17,
        "Part Name": "XNusJa",
        "Unit of measurement": "Pc",
        "Quantity": [
            {
                "MFD": "2020-12-07",
                "available quantity": 981,
                "price per piece": 30,
                "Expiry Date": "2026-12-15",
                "Invoice ID": "RvCEsd"
            },
            {
                "MFD": "2019-02-13",
                "available quantity": 421,
                "price per piece": 30,
                "Expiry Date": "2026-10-19",
                "Invoice ID": "iBncXK"
            },
            {
                "MFD": "2020-11-09",
                "available quantity": 51,
                "price per piece": 30,
                "Expiry Date": "2026-08-17",
                "Invoice ID": "qWsUAc"
            },
            {
                "MFD": "2022-04-16",
                "available quantity": 433,
                "price per piece": 30,
                "Expiry Date": "2026-12-05",
                "Invoice ID": "tnIzWr"
            },
            {
                "MFD": "2019-07-27",
                "available quantity": 94,
                "price per piece": 30,
                "Expiry Date": "2026-05-15",
                "Invoice ID": "GBPKUz"
            }
        ]
    },
    {
        "Item_id": 18,
        "Part Name": "dFkHWj",
        "Unit of measurement": "Set",
        "Quantity": [
            {
                "MFD": "2021-06-07",
                "available quantity": 414,
                "price per piece": 30,
                "Expiry Date": "2026-06-05",
                "Invoice ID": "fHksLv"
            },
            {
                "MFD": "2020-09-17",
                "available quantity": 187,
                "price per piece": 30,
                "Expiry Date": "2026-11-03",
                "Invoice ID": "cwBqzg"
            },
            {
                "MFD": "2020-05-03",
                "available quantity": 389,
                "price per piece": 30,
                "Expiry Date": "2026-12-11",
                "Invoice ID": "sCvWnj"
            },
            {
                "MFD": "2019-12-20",
                "available quantity": 18,
                "price per piece": 30,
                "Expiry Date": "2026-06-26",
                "Invoice ID": "eOPNyv"
            },
            {
                "MFD": "2018-11-07",
                "available quantity": 686,
                "price per piece": 30,
                "Expiry Date": "2026-10-17",
                "Invoice ID": "iURhwS"
            }
        ]
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
