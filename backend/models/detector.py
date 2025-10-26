from models.llm_analyzer import LLMAnalyzer
from utils.preprocessor import TextPreprocessor
from utils.fact_checker import FactChecker

class FakeNewsDetector:
    def __init__(self):
        self.llm_analyzer = LLMAnalyzer()
        self.preprocessor = TextPreprocessor()
        self.fact_checker = FactChecker()
    
    def analyze_article(self, article_text, title, source_url=None):
        cleaned_text = self.preprocessor.clean_text(article_text)
        features = self.preprocessor.extract_features(article_text)
        deceptive_patterns = self.preprocessor.detect_deceptive_patterns(article_text)
        key_sentences = self.preprocessor.extract_key_sentences(article_text, num_sentences=3)
        llm_result = self.llm_analyzer.analyze_content(cleaned_text[:512])
        fact_check = self.fact_checker.cross_reference(article_text[:300], title)
        source_score = self.fact_checker.calculate_source_credibility(source_url) if source_url else 0.5
        truthfulness_score = self._calculate_truthfulness(llm_result, deceptive_patterns, fact_check, source_score, features)
        verdict = self._get_verdict(truthfulness_score)
        return {
            'truthfulness_score': truthfulness_score,
            'verdict': verdict,
            'confidence': llm_result.get('confidence', 0.5),
            'llm_analysis': llm_result,
            'linguistic_features': features,
            'deceptive_patterns': deceptive_patterns,
            'fact_check': fact_check,
            'source_credibility': source_score,
            'key_claims': key_sentences,
        }

    def _calculate_truthfulness(self, llm_result, patterns, fact_check, source_score, features):
        weights = {'llm': 0.35, 'patterns': 0.20, 'fact_check': 0.30, 'source': 0.15}
        llm_score = llm_result['real_probability'] * 100
        pattern_sum = patterns.get('total_deceptive_indicators', 0)
        word_count = features.get('word_count', 100)
        pattern_density = pattern_sum / (word_count / 100) if word_count > 0 else 0
        pattern_score = max(0, 100 - (pattern_density * 15))
        total_related = fact_check.get('total_related', 0)
        credible_matches = fact_check.get('credible_matches', 0)
        fact_score = (credible_matches / total_related) * 100 if total_related > 0 else 40
        source_score_scaled = source_score * 100
        final_score = (
            llm_score * weights['llm'] +
            pattern_score * weights['patterns'] +
            fact_score * weights['fact_check'] +
            source_score_scaled * weights['source']
        )
        return round(min(100, max(0, final_score)), 2)

    def _get_verdict(self, score):
        if score >= 80:
            return "HIGHLY LIKELY REAL"
        elif score >= 60:
            return "LIKELY REAL"
        elif score >= 40:
            return "UNCERTAIN - VERIFY CAREFULLY"
        elif score >= 20:
            return "LIKELY FAKE"
        else:
            return "HIGHLY LIKELY FAKE"