import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from core.models import IRSystem

def load_generator_model():
    pass

def generate_expansion(query):
    model = IRSystem(False, False, 'natural', True, False, 0)
    result = model.retrieve(query)
    
    return [result]

def return_inverted(document_id):
    model = IRSystem(False, False, 'natural', True, False, 0)
    result = model.retrieve_invert(document_id)
    
    return result