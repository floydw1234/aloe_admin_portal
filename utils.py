import copy
import boto3
import random
import os
import shutil


def get_args_dict(argv):
    args = {}
    arguments =  copy.deepcopy(argv)
    arguments.pop(0)
    while len(arguments)>1:
        key = arguments.pop(0)
        value = arguments.pop(0)
        args[key] = value
    return args

def pick_random_file(directory):
    # Get a list of all files in the directory
    files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]
    # Pick a random file from the list
    random_file = random.choice(files)
    # Return the full path of the random file
    return os.path.join(directory, random_file)

def write_file_to_s3(file_path, destination):
    s3 = boto3.resource('s3')    
    s3.Bucket('shorts-maker-link-utah').upload_file(file_path, destination)


def clean_folder(folder):
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))
