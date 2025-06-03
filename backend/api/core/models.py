import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import numpy as np
import json
import re
import os
from sklearn.metrics.pairwise import cosine_similarity
import joblib

class IRSystem:
    def __init__(self, isStem, isEliminateStopWords, tfMode, isIDF, isNormalized, numberExpansion):
        self.isStem = isStem
        self.isEliminateStopWords = isEliminateStopWords
        self.tfMode = tfMode
        self.isIDF = isIDF
        self.isNormalized = isNormalized
        self.numberExpansion = numberExpansion
        self.expander = GenerativeAdversarialNetwork(self.isStem, self.isEliminateStopWords)

        self.stemmer = PorterStemmer()
        # nltk.download('stopwords')
        self.stopwords = set(stopwords.words('english'))

        base_path = os.path.dirname(os.path.abspath(__file__))
        if self.isStem:
            path = 'vocabulary/stemmed'
        else:
            path = 'vocabulary/raw'

        if self.isEliminateStopWords:
            with open(os.path.join(base_path, path, 'title.txt'), 'r') as file:
                self.vocabulary_title = [line.strip() for line in file if line not in self.stopwords]
            with open(os.path.join(base_path, path, 'author.txt'), 'r') as file:
                self.vocabulary_author = [line.strip() for line in file if line not in self.stopwords]
            with open(os.path.join(base_path, path, 'abstract.txt'), 'r') as file:
                self.vocabulary_abstract = [line.strip() for line in file if line not in self.stopwords]
        else:
            with open(os.path.join(base_path, path, 'title.txt'), 'r') as file:
                self.vocabulary_title = [line.strip() for line in file if line]
            with open(os.path.join(base_path, path, 'author.txt'), 'r') as file:
                self.vocabulary_author = [line.strip() for line in file if line]
            with open(os.path.join(base_path, path, 'abstract.txt'), 'r') as file:
                self.vocabulary_abstract = [line.strip() for line in file if line]

        path = f'weight/tf/natural/raw/'
        self.abstract_weight = []
        self.author_weight = []
        self.title_weight = []

        with open(os.path.join(base_path, 'cisi.json'), 'r') as file:
            self.document = json.load(file)

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
        weight = np.array([0 for i in range (len(self.vocabulary_abstract))])
        unique_token = set(tokens)

        for token in unique_token:
            try:
                idx = self.vocabulary_abstract.index(token)
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
                weight = [1 for i in range (len(self.vocabulary_abstract))]
        return weight
            
    def calculateIDF(self, weight):
        if self.isIDF:
            return weight * self.abstract_idf[:-1]
        return weight
            
    def calculateWeight(self, token):
        weight = self.calculateTF(token)
        weight = self.calculateIDF(weight)
        return weight 
    
    def expand(self, token):
        self.expanded = self.expander.forward(token, self.numberExpansion)
        return token + self.expanded
    
    def getExpansion(self):
        return self.expanded

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
        token = self.expand(token)

        weight = self.calculateWeight(token)
        document_rank = self.similarity(weight)
        return document_rank
    
    def retrieve_invert(self, document_id):
        if document_id > 0 and document_id <= len(self.document):
            doc = self.document[document_id - 1]
            return {
                "document_id": doc['id'],
                "title": doc['title'],
                "author": doc['author'],
                "abstract": doc['abstract'],
                "vocab": [self.vocabulary_title, self.vocabulary_author, self.vocabulary_abstract],
                "tf": [self.title_weight[document_id -1][:-1], self.author_weight[document_id -1][:-1], self.abstract_weight[document_id -1][:-1]],
                "idf": [self.title_idf[:-1], self.author_idf[:-1], self.abstract_idf[:-1]]
            }
        
        return {
                "document_id": -1,
                "title": "",
                "author": "",
                "abstract": "",
                "vocab": [],
                "tf": [],
                "idf": []
            }
        
class GenerativeAdversarialNetwork:
    def __init__(self, isStem, isStopWords):
        base_path = os.path.dirname(os.path.abspath(__file__))
        path = 'gan/raw-complete/'

        self.model = joblib.load(os.path.join(base_path, path, 'model.joblib'))
        self.vocab_embeddings = np.load(os.path.join(base_path, path, 'vocab_embeddings.npy'))
        with open(os.path.join(base_path, path, 'vocab_words.txt'), 'r', encoding='utf-8') as f:
            vocab_words = [line.strip() for line in f.readlines()]

        self.vocab_words = np.array(vocab_words) 
        self.word_to_index = {word: idx for idx, word in enumerate(self.vocab_words)}

    def one_hot(self, idx, size):
        vec = np.zeros(size)
        vec[idx] = 1.0
        return vec

    def get_embedding(self, word):
        idx = self.word_to_index[word]
        one_hot_vec = self.one_hot(idx, len(self.vocab_words)).reshape(1, -1)
        hidden = self.model.predict(one_hot_vec)
        return hidden.flatten()

    def discriminator(self, words, input_word, top_k=1):
        filtered = [(word, sim) for word, sim in input_word if word not in words]
        filtered_sorted = sorted(filtered, key=lambda x: x[1], reverse=True)
        return [word for word, _ in filtered_sorted[:top_k]]

    def generator(self, input_word, top_k=1):
        input_emb = np.array(self.get_embedding(input_word)).reshape(1, -1)
        sims = cosine_similarity(input_emb, self.vocab_embeddings)[0]  
        top_k_indices = np.argsort(sims)[-top_k:][::-1]      
        closest_words = [self.vocab_words[i] for i in top_k_indices]
        similarities = [sims[i] for i in top_k_indices]
        return list(zip(closest_words, similarities))

    def forward(self, words, number_expansion):
        generated = []
        for word in words:
            generated += self.generator(word, number_expansion)
        
        return self.discriminator(words, generated, number_expansion)
    