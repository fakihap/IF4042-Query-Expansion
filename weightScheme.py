from enum import Enum

class TfType (Enum) : 
    log = 1
    ntr = 2
    aug = 3
    bol = 4
    none = 5

class DfType (Enum) : 
    no = 1
    tid = 2
    none = 3

class NormType ( Enum) : 
    non = 1
    cos = 2
    none = 3

class WeightScheme : 
    def __init__(self, tf, df, norm):
        self.tf = self.setTf
        self.df = self.setDf
        self.norm = self.setNorm

    def getTf(self) :
        return self.tf
    
    def getDf(self) : 
        return self.df
    
    def getNorm (self) : 
        return self.norm
    
    def setTf (self,tf) :
         self.tf = tf

    def setDf (self, df) : 
        self.df  = df

    def setNorm (self, norm) : 
        self.norm = norm
    
    
