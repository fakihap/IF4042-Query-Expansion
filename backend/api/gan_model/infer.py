import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.src.search.schemas import SearchRequest, SearchInvertRequest

from core.models import IRSystem

model = IRSystem()

def load_generator_model():
    pass

def generate_expansion(query: SearchRequest):
    model.setEnvironment(query.useStemming, query.useStopwordElim, query.tfMode, query.useIDF, query.useNormalize, query.numberExpansionWords) 
    result = model.retrieve(query.query) 
    expanded = model.getExpansion()
    tf, idf = model.getWeights() 
    vocab = model.getVocab()

    return [(result, expanded, tf, idf, vocab)] 

def return_inverted(query: SearchInvertRequest):
    print("STARTING INVERTED SEARCH")
    model.setEnvironment(query.useStemming, query.useStopwordElim, query.tfMode, query.useIDF, query.useNormalize, 0) 
    result = model.retrieve_invert(query.document_id)
    
    return result
