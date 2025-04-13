import requests
from bs4 import BeautifulSoup

def scrape_articles(interests: list):
    """Scrape free articles from RSS feeds (demo purposes)"""
    sources = {
        "tech": "https://techcrunch.com/feed",
        "politics": "https://feeds.washingtonpost.com/rss/politics"
    }
    articles = []
    for interest in interests:
        if interest in sources:
            response = requests.get(sources[interest])
            soup = BeautifulSoup(response.content, "xml")
            for item in soup.find_all("item")[:5]:  # First 5 articles
                articles.append({
                    "title": item.title.text,
                    "link": item.link.text,
                    "source": interest
                })
    return articles

def allocate_budget(articles: list, budget: float):
    """Split budget equally among articles"""
    per_article = budget / len(articles) if articles else 0
    return [{"article": a, "payment": per_article} for a in articles]
