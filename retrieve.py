from weightScheme import TfType, DfType, NormType 

class Retrieve : 

    def build_inverted_index(terms, docList) :
        """Build term → doc_id list map."""
        pass

    def count_tf(termToken: str, docs : list[str], tfType : TfType) -> int:
        """
        Compute TF weight  of a term based on scheme:
        - n: natural
        - l: log
        - a: augmented
        - b: boolean
        """
        pass

    def count_df(termToken : str, docs : list[str], dfType : DfType)->int:
        """
        Compute IDF of a term: 
        - n: none
        - t: log(N/df)
        """
        pass

    def count_norm(termsWeight, normType) -> float:
        """
        Normalize vector:
        - n: no normalization
        - c: cosine normalization
        """
        pass

    def countWeightTerm (term : str) -> float : 
        pass


    def rankDocsSim(docsSimsList : list[str, float]) -> list[str, float] : 
        #docsSimsList : [ ( docId, similarQD(queryToken, docID) ), (), ()]
        pass

    def rankDocsMAP(docList : list[str]) -> list[str, float] : 

        pass

    def countMAP(query : str, docList : any) -> float:
        pass

    def similarQD(tokenQuery : list[str], docID : str)->  float: 
        pass

    
