from enum import Enum




# class queryIn (Enum) :
#         text = 1
#         listText = 2

class UserInp : 

    

    def __init__(self):
        self.queryFromValue = 1
        self.queryProcessValue = 2
        self.querytxt = ""
        self.listOfQuery = []
        self.weightScheme = None
        self.stemDone = False
        self.stopWordDel = False

        

    def setQuery (self) : 

        queryFromValue = int(input())
        queryProcessValue = int(input())

        if queryFromValue == 1 : #input typed by user
            print = "masukkan query nya yh"
            txt = input()
            if queryProcessValue == 1 : #input processed directly
                pass
            elif queryProcessValue == 2 : #input saved to list Of Query
                
                self.getlistOfQuery().append(txt)
        elif queryFromValue == 2 :
            pass


    def getQuery(self) : 
        return self.query
    
    def getWeightScheme (self) : 
        return self.weightScheme
    
    def setWeightScheme(self, weightScheme) : 
        self.weightScheme = weightScheme 

    def isStemDone (self) : 
        return self.stemDone
    
    def isStopWordDel (self) : 
        return self.stopWordDel
    
    def setStemDone (self, stemDone) : 
        self.stemDone = stemDone

    def setStopWordDel (self, stopWordDel) : 
        self.stopWordDel = stopWordDel

    def setListOfQuery (self, queryList : list[str]) :
        self.listOfQuery = queryList

    def getListOfQuery (self) :
        return self.listOfQuery 