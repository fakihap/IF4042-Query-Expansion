from api.src.search.schemas import SearchRequest, SearchInvertRequest
from api.core.models import IRSystem

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
    # print("STARTING INVERTED SEARCH", query.useStemming, query.useStopwordElim, query.tfMode, query.useIDF, query.useNormalize)
    model.setEnvironment(query.useStemming, query.useStopwordElim, query.tfMode, query.useIDF, query.useNormalize, 0) 
    result = model.retrieve_invert(query.document_id)
    # result = {}
    
    return result


