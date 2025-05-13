import retrieve as rtv
import preprocessor as pre
import queryexp as qexp
import userInp as user
# class UserConfig:
#     def __init__(self):
#         self.weighting = 'ltc'             # TF: logarithmic, DF: IDF, normalization: cosine
#         self.use_stopwords = True
#         self.use_stemming = True
#         self.lang = 'english'
#         self.use_expansion = True






def main():
    # Step 1: Get user input (query, weighting scheme, options)
    user_config = user.UserInp()  # from user_config.py

    # Step 2: Load & preprocess documents
    docs_raw = load_docs()
    docs_tokens = {
        doc_id: pre.preprocess_txt(text, user_config.stopwords, user_config.use_stemming, user_config.stemmer)
        for doc_id, text in docs_raw.items()
    }

    # Step 3: Build inverted index
    index = rtv.build_inverted_index(docs_tokens)

    # Step 4: Query expansion (if enabled)
    raw_query = get_query_input()
    expanded_query = qexp.expand_query_gan(raw_query) if user_config.use_expansion else raw_query

    # Step 5: Preprocess expanded query
    query_tokens = pre.preprocess_txt(expanded_query, user_config.stopwords, user_config.use_stemming, user_config.stemmer)

    # Step 6: Weighting documents
    tfidf_matrix = rtv.weight_doc_list(docs_tokens, index, user_config.weighting)

    # Step 7: Vectorize & weight query
    query_vector = rtv.vectorize_query(query_tokens, docs_tokens, index, user_config.weighting)

    # Step 8: Rank documents
    ranked = rtv.rank_docs(query_vector, tfidf_matrix)

    # Step 9: Display results
    display_results(ranked)

# def userConfig () : 
#     pass

def load_docs() : 
    pass

def get_query_input():
    pass

def display_results () : 
    pass
