import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.src.search.schemas import SearchRequest

from core.models import IRSystem

def load_generator_model():
    pass

def generate_expansion(query: SearchRequest):
    model = IRSystem(query.useStemming, query.useStopwordElim, query.tfMode, query.useIDF, query.useNormalize, query.numberExpansionWords) # 10s

    result = model.retrieve(query.queries[0]) 
    expanded = model.getExpansion()
    tf, idf = model.getWeights() 
    vocab = model.getVocab()

    return [(result, expanded, tf, idf, vocab)] 

def return_inverted(document_id):
    model = IRSystem(False, False, 'natural', True, False, 0)
    result = model.retrieve_invert(document_id)
    
    return result
