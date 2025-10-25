import requests
import os
from datetime import datetime, timedelta

class NewsFetcher:
    def _init_(self):
        self.api_key = os.getenv('NEWS_API_KEY')
        self.base_url = 'https://newsapi.org/v2'
        self.credible_sources = [
            'reuters.com', 'apnews.com', 'bbc.com', 'bbc.co.uk',
            'nytimes.com', 'theguardian.com', 'wsj.com', 'washingtonpost.com',
            'cnn.com', 'npr.org', 'time.com'
        ]

    def search_related_news(self, query, days_back=7, max_results=20):
        endpoint = f"{self.base_url}/everything"
        to_date = datetime.now()
        from_date = to_date - timedelta(days=days_back)
        params = {
            'q': query,
            'apiKey': self.api_key,
            'language': 'en',
            'sortBy': 'relevancy',
            'pageSize': max_results,
            'from': from_date.strftime('%Y-%m-%d'),
            'to': to_date.strftime('%Y-%m-%d')
        }
        try:
            response = requests.get(endpoint, params=params, timeout=10)
            data = response.json()
            return data.get('articles', [])
        except:
            return []

    def get_credible_sources(self):
        return self.credible_sources

    def is_credible_source(self, url):
        if not url:
            return False
        url_lower = url.lower()
        return any(source in url_lower for source in self.credible_sources)