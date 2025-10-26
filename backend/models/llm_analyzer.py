from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

class LLMAnalyzer:
    def __init__(self):
        print("Loading LLM model for fake news detection...")
        model_name = "hamzab/roberta-fake-news-classification"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.model.eval()

    def analyze_content(self, text, max_length=512):
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=max_length, padding=True)
        with torch.no_grad():
            outputs = self.model(**inputs)
            predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
        fake_prob = predictions[0][0].item()
        real_prob = predictions[0][1].item()
        return {
            'fake_probability': round(fake_prob, 4),
            'real_probability': round(real_prob, 4),
            'prediction': 'FAKE' if fake_prob > real_prob else 'REAL',
            'confidence': round(max(fake_prob, real_prob), 4)
        }