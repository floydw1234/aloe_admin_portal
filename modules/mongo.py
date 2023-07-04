import pymongo

client = pymongo.MongoClient('localhost', 27017)

def get_all_docs(collection):
    cursor = collection.find({})
    output = []
    for document in cursor:
        output.append(document)
    cursor.close()
    return output

def insert_doc(collection, input_doc):
    post_id = collection.insert_one(input_doc).inserted_id
    return post_id

def doc_exists(collection, id):
    res = collection.find_one({"_id": id})
    if res:
        return True
    else:
        return False


