import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from core.models import IRSystem

def load_generator_model():
    pass

def generate_expansion(query):
    model = IRSystem(False, False, 'natural', True, False, query.numberExpansionWords) # 10s

    result = model.retrieve(query.queries[0]) # 8s
    expanded = model.getExpansion() # 6s if all, abysmall else

    return [(result, expanded)]

def return_inverted(document_id):
    model = IRSystem(False, False, 'natural', True, False, 0)
    result = model.retrieve_invert(document_id)
    
    return result
