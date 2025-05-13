from userInp import UserInp as inp

class Terms:
    def __init__(self):
        self.rawText = inp.getQuery()
        self.tokenQuery = self.tokenize()
        self.weights = {}

    def tokenize(self):
        return self.rawText.lower().split()

    def setWeights(self, term, weight):
        self.weights[term] = weight

    def getWeightTerm(self, term):
        return self.weights.get(term, 0)
    
    def getWeights(self) :
        return self.weights
