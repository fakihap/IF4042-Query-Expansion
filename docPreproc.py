from enum import Enum

class Tag(Enum):
    index = ".I"
    title = ".T"
    author = ".A"
    info = ".B"
    work = ".W"
    table = ".X"


class Doc :
    def __init__(self) -> None:
        self.indexNumber: int = None
        self.title: str = ''
        self.author: str = ''
        self.info: str = ''
        self.work: str = ''
        self.frequency: dict[str:int]= {}
        self.normalizeFrequency : dict[str:int] = {}
        self.maxFrequency : int= 0
        self.weight: dict[str:int] = {} 

    @staticmethod
    def getDocTxt( self, id : int)-> str :
        return self.work

    def getDocTitle(self,id: int)-> str :
        return self.title


def loadDocs(docs : __path__) : 
    
    pass
    



    
    