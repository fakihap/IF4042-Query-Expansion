import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import numpy as np
import re
import os

class IRSystem:
    def __init__(self, isStem, isEliminateStopWords, tfMode, isIDF, isNormalized, numberExpansion):
        self.isStem = isStem
        self.isEliminateStopWords = isEliminateStopWords
        self.tfMode = tfMode
        self.isIDF = isIDF
        self.isNormalized = isNormalized
        self.numberExpansion = numberExpansion

        self.stemmer = PorterStemmer()
        nltk.download('stopwords')
        self.stopwords = set(stopwords.words('english'))

        base_path = os.path.dirname(os.path.abspath(__file__))
        if self.isStem:
            path = 'vocabulary/stemmed/abstract.txt'
        else:
            path = 'vocabulary/raw/abstract.txt'

        if self.isEliminateStopWords:
            with open(os.path.join(base_path, path), 'r') as file:
                self.vocabulary = [line.strip() for line in file if line not in self.stopwords]
        else:
            with open(os.path.join(base_path, path), 'r') as file:
                self.vocabulary = [line.strip() for line in file]

        path = f'weight/tf/natural/raw/'
        self.abstract_weight = []
        self.author_weight = []
        self.title_weight = []

        for i in range (1, 1461):
            with open(os.path.join(base_path, path, str(i), 'abstract.txt'), 'r') as file:
                self.abstract_weight.append([float(line.strip()) for line in file])
            with open(os.path.join(base_path, path, str(i), 'author.txt'), 'r') as file:
                self.author_weight.append([float(line.strip()) for line in file])
            with open(os.path.join(base_path, path, str(i), 'title.txt'), 'r') as file:
                self.title_weight.append([float(line.strip()) for line in file])

        with open(os.path.join(base_path, 'weight/idf/raw/abstract.txt'), 'r') as file:
            self.abstract_idf = [float(line.strip()) for line in file]
        with open(os.path.join(base_path, 'weight/idf/raw/author.txt'), 'r') as file:
            self.author_idf = [float(line.strip()) for line in file]
        with open(os.path.join(base_path, 'weight/idf/raw/title.txt'), 'r') as file:
            self.title_idf = [float(line.strip()) for line in file]
            
        # with open('words.txt', 'r') as file:  # UBAH FILE PATH
        #     self.idfweight = np.array([line.strip() for line in file])

    def stem(self, text):
        if self.isStem:
            words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
            return [self.stemmer.stem(word) for word in words]
        else:
            cleaned_text = re.sub(r'[^a-zA-Z\s]', ' ', text)
            cleaned_text = cleaned_text.lower()  
            words = [word for word in cleaned_text.split() if word]
            return words
    
    def eliminateStopWords(self, list):
        if self.isEliminateStopWords:
            return [word for word in list if word and word not in self.stopwords]
        return list
    
    def calculateTF(self, tokens):
        weight = np.array([0 for i in range (len(self.vocabulary))])
        unique_token = set(tokens)

        for token in unique_token:
            try:
                idx = self.vocabulary.index(token)
                weight[idx] = tokens.count(token)
            except ValueError:
                continue
                        
        max_list = np.max(weight)
        match self.tfMode:
            case 'natural':
                weight = weight
            case 'augmented':
                weight = 0.5 + (0.5 * weight / max_list)
            case 'logarithmic':
                mask = weight > 0
                weight[mask] = 1 + np.log2(weight[mask])
            case 'binary':
                weight = (weight > 0).astype(int)
            case 'no':
                weight = [1 for i in range (len(self.vocabulary))]
        return weight
            
    def calculateIDF(self, weight):
        if self.isIDF:
            return weight * self.abstract_idf[:-1]
        return weight
            
    def calculateWeight(self, token):
        weight = self.calculateTF(token)
        weight = self.calculateIDF(weight)
        return weight 
    
    def expand():
        pass

    def similarity(self, weight_token):
        similarity_score = []
        for i in range (len(self.abstract_weight)):
            res = self.abstract_weight[i][:-1] * weight_token
            if (self.isIDF):
                res *= self.abstract_idf[:-1]
            if (self.isNormalized):
                token_magnitude = weight_token.magnitude()
                res /= token_magnitude
                res /= self.weight_document.magnitude
            similarity_score.append({"document_id": i+1, "similarity": np.sum(res)})

        similarity_score = sorted(similarity_score, key=lambda x: x["similarity"], reverse=True)
        return similarity_score
    
    def retrieve(self, query):
        token = self.stem(query)
        token = self.eliminateStopWords(token)
        weight = self.calculateWeight(token)
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
    