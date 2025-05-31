import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import numpy as np
import re

class IRSystem:
    def __init__(self, isStem, isEliminateStopWords, tfMode, isIDF, isNormalized):
        self.isStem = isStem
        self.isEliminateStopWords = isEliminateStopWords
        self.tfMode = tfMode
        self.isIDF = isIDF
        self.isNormalized = isNormalized
        self.stemmer = PorterStemmer()
        nltk.download('stopwords')
        self.stopwords = set(stopwords.words('english'))
        with open('words.txt', 'r') as file: # UBAH FILE PATH
            self.vocabulary = [line.strip() for line in file]
        with open('words.txt', 'r') as file:  # UBAH FILE PATH
            self.idfweight = np.array([line.strip() for line in file])

    def stem(self, text):
        if self.isStem:
            words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
            return [self.stemmer.stem(word) for word in words]
            cleaned_text = re.sub(r'[^a-zA-Z\s]', ' ', text)
            cleaned_text = cleaned_text.lower()  
            words = [word for word in cleaned_text.split() if word]
            return words
    
    def eliminateStopWords(self, list):
        if self.isEliminateStopWords:
            return [word for word in list if word and word not in self.stopwords]
        return list
    
    def calculateTF(self, tokens):
        weight = np.array([0 for i in range (len(self.vocabulary) + 1)])
        unique_token = set(tokens)
        undefined_token = 0

        for token in unique_token:
            try:
                idx = self.vocabulary.index(token)
                weight[idx] = tokens.count(token)
            except ValueError:
                undefined_token = undefined_token + 1
                continue

        weight[self.vocabulary] = undefined_token
                        
        max_list = np.max(weight)
        match self.tfMode:
            case 'natural':
                weight = weight
            case 'augmented':
                weight = 0.5 + (0.5 * weight / max_list)
            case 'logarithmic':
                weight = 1 + np.log2(weight, where=weight > 0, out=np.zeros_like(weight, dtype=float))
            case 'binary':
                weight = (weight > 0).astype(int)

        return weight
            
    def calculateIDF(self, weight):
        if self.isIDF:
            return weight * self.idfweight
        return weight
            
    def calculateWeight(self, token):
        weight = self.calculateTF(token)
        weight = self.calculateIDF(weight)
        return weight 
    
    def expand():
        pass

    def similarity(self, weight_token):
        # token_magnitude = weight_token.magnitude()
        # for i in range (len(self.weight_document)):
        #     res = self.weight_document[i] * weight_token
        #     if (self.isNormalized):
        #         res /= token_magnitude
        #         res /= self.weight_document.magnitude
        return [{"id": 1, "value": 1232}, {"id": 1, "value": 1.2},]
    
    def retrieve(self, query):
        token = self.stem(query)
        token = self.eliminateStopWords(token)
        weight = self.calculateWeight(token)

        # Query Expansion
        weight = self.expand(weight)

        # Calculate
        document_rank = self.similarity(weight)
        return document_rank
    
class GenerativeAdversarialNetwork:
    def __init__(self):
        pass

    def discriminator():
        pass

    def generator():
        pass

    def forward():
        pass
    