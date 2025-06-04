import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import numpy as np
import json
import re
import os
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import copy

from api.src.search.schemas import TermFrequencyMode

class IRSystem:
    def __init__(self):
        self.isStem = None
        self.isEliminateStopWords = None
        self.tfMode = None
        self.isIDF = None
        self.isNormalized = None
        self.numberExpansion = None
        self.expanded = []

        self.expander = GenerativeAdversarialNetwork(self.isStem, self.isEliminateStopWords)
        self.stemmer = PorterStemmer()
        self.stopwords = set(stopwords.words('english'))

        base_path = os.path.dirname(os.path.abspath(__file__))

        self.vocabulary = {}

        self.vocabulary['complete'] = {}
        for vocab in ['stemmed', 'raw']:
            with open(os.path.join(base_path, 'vocabulary', vocab, 'title.txt'), 'r') as file:
                self.vocabulary_title = [line.strip() for line in file]
            with open(os.path.join(base_path, 'vocabulary', vocab, 'author.txt'), 'r') as file:
                self.vocabulary_author = [line.strip() for line in file]
            with open(os.path.join(base_path, 'vocabulary', vocab, 'abstract.txt'), 'r') as file:
                self.vocabulary_abstract = [line.strip() for line in file]
            self.vocabulary['complete'][vocab] = {
                'title': self.vocabulary_title,
                'author': self.vocabulary_author,
                'abstract': self.vocabulary_abstract
            }

        self.vocabulary['eliminated'] = {}
        for vocab in ['stemmed', 'raw']:
            with open(os.path.join(base_path, 'vocabulary', vocab, 'title.txt'), 'r') as file:
                self.vocabulary_title = [line.strip() for line in file if line.strip() not in self.stopwords]
            with open(os.path.join(base_path, 'vocabulary', vocab, 'author.txt'), 'r') as file:
                self.vocabulary_author = [line.strip() for line in file if line.strip() not in self.stopwords]
            with open(os.path.join(base_path, 'vocabulary', vocab, 'abstract.txt'), 'r') as file:
                self.vocabulary_abstract = [line.strip() for line in file if line.strip() not in self.stopwords]
            self.vocabulary['eliminated'][vocab] = {
                'title': self.vocabulary_title,
                'author': self.vocabulary_author,
                'abstract': self.vocabulary_abstract
            }

        with open(os.path.join(base_path, 'cisi.json'), 'r') as file:
            self.document = json.load(file)

        self.weight = {}
        self.weight['complete'] = {}
        self.weight['complete']['tf'] = {}

        for tf in ['natural', 'augmented', 'logarithmic', 'binary']:
            for vocab in ['stemmed', 'raw']:
                path = f'weight/tf/{tf}/{vocab}/'
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
                
                if vocab not in self.weight['complete']['tf']:
                    self.weight['complete']['tf'][vocab] = {}
                
                self.weight['complete']['tf'][vocab][tf] = {
                    'abstract': self.abstract_weight,
                    'author': self.author_weight,
                    'title': self.title_weight
                }

        self.weight['complete']['idf'] = {}
        for vocab in ['stemmed', 'raw']:
            with open(os.path.join(base_path, f'weight/idf/{vocab}/abstract.txt'), 'r') as file:
                self.abstract_idf = [float(line.strip()) for line in file]
            with open(os.path.join(base_path, f'weight/idf/{vocab}/author.txt'), 'r') as file:
                self.author_idf = [float(line.strip()) for line in file]
            with open(os.path.join(base_path, f'weight/idf/{vocab}/title.txt'), 'r') as file:
                self.title_idf = [float(line.strip()) for line in file]
            self.weight['complete']['idf'][vocab] = {
                'abstract': self.abstract_idf,
                'author': self.author_idf,
                'title': self.title_idf
            }

        self.weight['eliminated'] = {}
        self.weight['eliminated']['tf'] = {}
        for tf in ['natural', 'augmented', 'logarithmic', 'binary']:
            for vocab in ['stemmed', 'raw']:
                self.title_weight = [[weight for word, weight in zip(self.vocabulary['complete'][vocab]['title']  + ['<UNKNOWN>'], weights) if word not in self.stopwords] for weights in self.weight['complete']['tf'][vocab][tf]['title']]
                self.author_weight = [[weight for word, weight in zip(self.vocabulary['complete'][vocab]['author'] +  ['<UNKNOWN>'], weights) if word not in self.stopwords]for weights in self.weight['complete']['tf'][vocab][tf]['author']]
                self.abstract_weight = [[weight for word, weight in zip(self.vocabulary['complete'][vocab]['abstract'] + ['<UNKNOWN>'], weights) if word not in self.stopwords] for weights in self.weight['complete']['tf'][vocab][tf]['abstract']]
                
                if vocab not in self.weight['eliminated']['tf']:
                    self.weight['eliminated']['tf'][vocab] = {}
                
                self.weight['eliminated']['tf'][vocab][tf] = {
                    'abstract': self.abstract_weight ,
                    'author': self.author_weight,
                    'title': self.title_weight
                }

        self.weight['eliminated']['idf'] = {}
        for vocab in ['stemmed', 'raw']:
            self.title_idf = [idf for word, idf in zip(self.vocabulary['complete'][vocab]['title'] + ['<UNKNOWN>'], self.weight['complete']['idf'][vocab]['title']) if word not in self.stopwords]
            self.author_idf = [idf for word, idf in zip(self.vocabulary['complete'][vocab]['author'] + ['<UNKNOWN>'], self.weight['complete']['idf'][vocab]['author']) if word not in self.stopwords]
            self.abstract_idf = [idf for word, idf in zip(self.vocabulary['complete'][vocab]['abstract']  + ['<UNKNOWN>'], self.weight['complete']['idf'][vocab]['abstract']) if word not in self.stopwords]
            self.weight['eliminated']['idf'][vocab] = {
                'abstract': self.abstract_idf,
                'author': self.author_idf,
                'title': self.title_idf
            }

    def setEnvironment(self, isStem, isEliminateStopWords, tfMode: TermFrequencyMode, isIDF, isNormalized, numberExpansion):
        self.isStem = isStem
        self.isEliminateStopWords = isEliminateStopWords
        self.tfMode = tfMode.value
        self.isIDF = isIDF
        self.isNormalized = isNormalized
        self.numberExpansion = numberExpansion
        print("isEliminateStopWords", isEliminateStopWords)

        self.vocabulary_title = self.vocabulary['eliminated' if isEliminateStopWords else 'complete']['stemmed' if isStem else 'raw']['title']
        self.vocabulary_author = self.vocabulary['eliminated' if isEliminateStopWords else 'complete']['stemmed' if isStem else 'raw']['author']
        self.vocabulary_abstract = self.vocabulary['eliminated' if isEliminateStopWords else 'complete']['stemmed' if isStem else 'raw']['abstract']

        if tfMode == TermFrequencyMode.No:
            self.abstract_weight = np.array([[1.0 for i in range (len(self.vocabulary_abstract) + 1)] for _ in range(1460)], dtype=float)
            self.author_weight = np.array([[1.0 for i in range (len(self.vocabulary_author) + 1)] for _ in range(1460)], dtype=float)
            self.title_weight = np.array([[1.0 for i in range (len(self.vocabulary_title) + 1)] for _ in range(1460)], dtype=float)
        else:
            self.abstract_weight = np.array(self.weight['eliminated' if isEliminateStopWords else 'complete']['tf']['stemmed' if isStem else 'raw'][self.tfMode]['abstract'], dtype=float)
            self.author_weight = np.array(self.weight['eliminated' if isEliminateStopWords else 'complete']['tf']['stemmed' if isStem else 'raw'][self.tfMode]['author'], dtype=float)
            self.title_weight = np.array(self.weight['eliminated' if isEliminateStopWords else 'complete']['tf']['stemmed' if isStem else 'raw'][self.tfMode]['title'], dtype=float)

        if self.isIDF:
            self.abstract_idf = np.array(self.weight['eliminated' if isEliminateStopWords else 'complete']['idf']['stemmed' if isStem else 'raw']['abstract'], dtype=float)
            self.author_idf = np.array(self.weight['eliminated' if isEliminateStopWords else 'complete']['idf']['stemmed' if isStem else 'raw']['author'], dtype=float)
            self.title_idf = np.array(self.weight['eliminated' if isEliminateStopWords else 'complete']['idf']['stemmed' if isStem else 'raw']['title'], dtype=float)
        else:
            self.abstract_idf = np.array([1.0 for i in range (len(self.vocabulary_abstract) + 1)], dtype=float)
            self.author_idf = np.array([1.0 for i in range (len(self.vocabulary_author) + 1)], dtype=float)
            self.title_idf = np.array([1.0 for i in range (len(self.vocabulary_title) + 1)], dtype=float)


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
        weights = []
        for item in [self.vocabulary_title, self.vocabulary_author, self.vocabulary_abstract]:
            weight = np.array([0.0 for i in range (len(item) + 1)],  dtype=float)
            unique_token = set(tokens)
            unknown_token = 0

            for token in unique_token:
                try:
                    idx = item.index(token)
                    weight[idx] = tokens.count(token)
                except ValueError:
                    unknown_token += tokens.count(token)
                    continue

            weight[-1] = unknown_token 
                            
            max_list = np.max(weight)
            match self.tfMode:
                case 'natural':
                    weight = weight
                case 'augmented':
                    weight[weight > 0] = 0.5 + (0.5 * weight[weight > 0] / max_list)
                case 'logarithmic':
                    mask = weight > 0
                    weight[mask] = 1 + np.log2(weight[mask])
                case 'binary':
                    weight = (weight > 0).astype(float)
                case 'no':
                    weight = np.array([1.0 for i in range (len(item) + 1)], dtype=float)
            
            weights.append(weight)
        return weights
            
    def calculateIDF(self, weights):
        for i, item in enumerate([self.title_idf, self.author_idf, self.abstract_idf]):
            weights[i] *= item
        return weights
            
    def calculateWeight(self, token):
        res = self.calculateTF(token)
        self.query_tf = copy.deepcopy(res)
        weight = self.calculateIDF(res)
        return weight 
    
    def expand(self, token):
        self.expanded = self.expander.forward(token, self.numberExpansion)
        return token + self.expanded
    
    def getExpansion(self):
        return self.expanded
    
    def getWeights(self):
        return self.query_tf, [self.title_idf, self.author_idf, self.abstract_idf]
    
    def getVocab(self):
        return [self.vocabulary_title + ['<UNKNOWN>'], self.vocabulary_author + ['<UNKNOWN>'], self.vocabulary_abstract + ['<UNKNOWN>']]

    def similarity(self, weight_token):
        similarity_score = []

        for i in range (len(self.document)):
            res_title = self.title_weight[i] * weight_token[0]
            res_author = self.author_weight[i] * weight_token[1]
            res_abstract = self.abstract_weight[i] * weight_token[2]

            res_title = res_title * self.title_idf
            res_author = res_author * self.author_idf
            res_abstract = res_abstract * self.abstract_idf

            if (self.isNormalized):
                title_magnitude = np.linalg.norm(self.title_weight[i]) * np.linalg.norm(weight_token[0])
                author_magnitude = np.linalg.norm(self.author_weight[i]) * np.linalg.norm(weight_token[1])
                abstract_magnitude = np.linalg.norm(self.abstract_weight[i] * np.linalg.norm(weight_token[2]))
                
                res_title /= title_magnitude if title_magnitude != 0 else 1
                res_author /= author_magnitude if author_magnitude != 0 else 1
                res_abstract /= abstract_magnitude if abstract_magnitude != 0 else 1

            res = np.sum(res_title) + np.sum(res_author) + np.sum(res_abstract)
            similarity_score.append({"document_id": i+1, "similarity": res})

            similarity_score = sorted(similarity_score, key=lambda x: x["similarity"], reverse=True)
        return similarity_score
    
    def retrieve(self, query):
        print("1")
        token = self.stem(query)
        print("2")
        token = self.eliminateStopWords(token)
        print("3")
        token = self.expand(token)
        weight = self.calculateWeight(token)
        print("4")
        document_rank = self.similarity(weight)
        print("5")
        return document_rank
    
    def retrieve_invert(self, document_id):
        if document_id > 0 and document_id <= len(self.document):
            doc = self.document[document_id - 1]
            return {
                "document_id": doc['id'],
                "title": doc['title'],
                "author": doc['author'],
                "abstract": doc['abstract'],
                "vocab": [self.vocabulary_title + ['<UNKNOWN>'], self.vocabulary_author + ['<UNKNOWN>'], self.vocabulary_abstract + ['<UNKNOWN>']],
                "tf": [self.title_weight[document_id -1], self.author_weight[document_id -1], self.abstract_weight[document_id -1]],
                "idf": [self.title_idf, self.author_idf, self.abstract_idf]
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
        try:
            idx = self.word_to_index[word]
            one_hot_vec = self.one_hot(idx, len(self.vocab_words)).reshape(1, -1)
            hidden = self.model.predict(one_hot_vec)
            return hidden.flatten()
        except KeyError:
            return -1

    def discriminator(self, words, input_word, top_k=1):
        filtered = [(word, sim) for word, sim in input_word if word not in words]
        filtered_sorted = sorted(filtered, key=lambda x: x[1], reverse=True)
        return [word for word, _ in filtered_sorted[:top_k]]

    def generator(self, input_word, top_k=1):
        embedding = self.get_embedding(input_word)
        if isinstance(embedding, int) and embedding == -1:
            return -1
        input_emb = np.array(embedding).reshape(1, -1)
        sims = cosine_similarity(input_emb, self.vocab_embeddings)[0]  
        top_k_indices = np.argsort(sims)[-top_k:][::-1]      
        closest_words = [self.vocab_words[i] for i in top_k_indices]
        similarities = [sims[i] for i in top_k_indices]
        return list(zip(closest_words, similarities))

    def forward(self, words, number_expansion):
        generated = []
        for word in words:
            item = self.generator(word, number_expansion)
            if item == -1:
                continue
            generated += item
        
        return self.discriminator(words, generated, number_expansion)
    