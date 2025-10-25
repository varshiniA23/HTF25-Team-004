# ...existing code...
from flask import Flask, request, jsonify
from flask_cors import CORS
from models.detector import FakeNewsDetector
import os

app = Flask(__name__)
CORS(app)

detector = FakeNewsDetector()

@app.route('/api/analyze', methods=['POST'])
def analyze_news():
    data = request.json
    article_text = data.get('text', '')
    title = data.get('title', '')
    source_url = data.get('url', '')
    if not article_text or not title:
        return jsonify({'error': 'Missing required fields'}), 400
    result = detector.analyze_article(article_text, title, source_url)
    return jsonify(result)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
# ...existing code...