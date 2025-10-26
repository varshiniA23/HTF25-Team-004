from utils.news_fetcher import NewsFetcher
from difflib import SequenceMatcher

class FactChecker:
    def __init__(self):
        self.news_fetcher = NewsFetcher()
    
    def similarity_ratio(self, text1, text2):
        return SequenceMatcher(None, text1.lower(), text2.lower()).ratio()
    
    def cross_reference(self, article_text, title):
        related_articles = self.news_fetcher.search_related_news(title, days_back=30)
        credible_matches = []
        for article in related_articles:
            source_url = article.get('url', '')
            if self.news_fetcher.is_credible_source(source_url):
                credible_matches.append({
                    'title': article.get('title'),
                    'source': article.get('source', {}).get('name'),
                    'url': source_url,
                    'published': article.get('publishedAt'),
                    'description': article.get('description', '')
                })
        return {
            'total_related': len(related_articles),
            'credible_matches': len(credible_matches),
            'sources': credible_matches[:5]
        }
    
    def calculate_source_credibility(self, source_url):
        if not source_url:
            return 0.5
        if self.news_fetcher.is_credible_source(source_url):
            return 0.9
        suspicious_patterns = ['.co.', 'wordpress', 'blogspot', 'tumblr', 'fake', 'satire', 'parody', 'blog']
        url_lower = source_url.lower()
        if any(pattern in url_lower for pattern in suspicious_patterns):
            return 0.2
        if source_url.startswith('https://'):
            return 0.6
        return 0.4