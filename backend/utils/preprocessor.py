import re
import nltk
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
import spacy

class TextPreprocessor:
    def _init_(self):
        self.stop_words = set(stopwords.words('english'))
        self.nlp = spacy.load('en_core_web_sm')
    
    def clean_text(self, text):
        text = re.sub(r'http\S+|www\S+|https\S+', '', text)
        text = re.sub(r'\S+@\S+', '', text)
        text = ' '.join(text.split())
        return text

    def extract_features(self, text):
        words = text.split()
        sentences = sent_tokenize(text)
        features = {
            'word_count': len(words),
            'sentence_count': len(sentences),
            'char_count': len(text),
            'avg_word_length': sum(len(word) for word in words) / len(words) if words else 0,
            'avg_sentence_length': len(words) / len(sentences) if sentences else 0,
            'exclamation_count': text.count('!'),
            'question_count': text.count('?'),
            'capital_ratio': sum(1 for c in text if c.isupper()) / len(text) if text else 0,
        }
        doc = self.nlp(text[:1000000])
        features['entities'] = [(ent.text, ent.label_) for ent in doc.ents][:20]
        features['entity_count'] = len(doc.ents)
        return features

    def detect_deceptive_patterns(self, text):
        text_lower = text.lower()
        clickbait_words = ['shocking', 'unbelievable', 'amazing', 'secret', 'revealed']
        absolute_words = ['always', 'never', 'everyone', 'nobody', 'all']
        emotional_words = ['outrage', 'furious', 'devastated', 'terrified', 'disaster']
        manipulative_phrases = ['they don\'t want you to know', 'mainstream media won\'t tell you']
        patterns = {
            'clickbait_words': sum(text_lower.count(word) for word in clickbait_words),
            'absolute_words': sum(text_lower.count(word) for word in absolute_words),
            'emotional_words': sum(text_lower.count(word) for word in emotional_words),
            'manipulative_phrases': sum(text_lower.count(phrase) for phrase in manipulative_phrases)
        }
        patterns['total_deceptive_indicators'] = sum(patterns.values())
        return patterns

    def extract_key_sentences(self, text, num_sentences=3):
        sentences = sent_tokenize(text)
        meaningful_sentences = [s for s in sentences if len(s.split()) > 5]
        return meaningful_sentences[:num_sentences]