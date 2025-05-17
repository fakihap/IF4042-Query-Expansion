# from userInp import UserInp as inp
from userInp import UserInp 
class Terms:
    def __init__(self):
        self.rawText = None
        self.tokenQuery = []
        self.weights = {}

    def setRawText(self) :
        self.rawText = UserInp().getQuery()
    
    def getRawText(self) :
        return self.rawText
    
    def tokenize(self):
        return self.getRawText().lower().split()
    

    def setWeights(self, term, weight):
        self.weights[term] = weight

    def getWeightTerm(self, term):
        return self.weights.get(term, 0)
    
    def getWeights(self) :
        return self.weights

# if __name__ == "__main__" :
#     inpUser = UserInp()
#     term = Terms()
#     txt = inpUser.setQuery()
#     print(inpUser.getQuery())
#     term.setRawText()
#     print(term.getRawText())
#     print(term.tokenize())


