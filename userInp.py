class UserInp : 
    def __init__(self, query, weightScheme):
        self.query = query
        self.weightScheme = weightScheme

    def setQuery (self, query) : 
        self.query = query
    
    def getQuery(self) : 
        return self.query
    
    def getWeightScheme (self) : 
        return self.weightScheme