class Retrieve : 

    def build_inverted_index(terms, docList) :
        """Build term → doc_id list map."""
        pass

    def count_tf(term, docs, tfType):
        """
        Compute TF weight based on scheme:
        - n: natural
        - l: log
        - a: augmented
        - b: boolean
        """
        pass

    def count_df(term, invertedIdx, dfType ):
        """
        Compute IDF: 
        - n: none
        - t: log(N/df)
        """
        pass

    def count_norm(termsWeight, normType) :
        """
        Normalize vector:
        - n: no normalization
        - c: cosine normalization
        """
        pass


    def rankDocs(docsSimsList) : 
        #docsSimsList : [ ( docId, similarQD(queryToken, docID) ), (), ()]
        pass

    def similarQD(tokenQuery, docID) : 
        pass