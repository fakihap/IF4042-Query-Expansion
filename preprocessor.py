import userInp as user

class Preprocessor :
    
    def removeStopword(query : str) -> str :
        #query from user.getQuery (string)
        pass
    def tokenize(query : str) -> list[str]:
        #query from user.getQuery (string)
        pass

    def stemWord(tokenQuery : list[str]) -> list[str]:
        #apply to output of tokenize()
        pass

    def preprocess (tokenQuery:list[str]) -> list[str]  : 
        #apply to output of tokenize()
        pass

    def vectorize(tokenQuery :list[str], termsWeight : list[float]) -> list[float]: 
        #output : list of float hasil vektorisasi pada query yang sudah berbentuk token of words
        pass
    
    
