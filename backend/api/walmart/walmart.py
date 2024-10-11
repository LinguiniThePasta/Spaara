import googlemaps.places

import googlemaps
"""
This is an example web scraper for Walmart.com.

To run this scraper set env variable $SCRAPFLY_KEY with your scrapfly API key:
$ export $SCRAPFLY_KEY="your key from https://scrapfly.io/dashboard"
"""

import os
import json
import math
from typing import Dict, List, TypedDict
from urllib.parse import urlencode
from loguru import logger as log
from scrapfly import ScrapeConfig, ScrapflyClient, ScrapeApiResponse
import asyncio

os.environ["SCRAPFLY_KEY"] = "scp-live-a5576a45b397414abd19f2c530d0340f"

SCRAPFLY = ScrapflyClient(key=os.environ["SCRAPFLY_KEY"])

BASE_CONFIG = {
    # bypass walmart.com web scraping blocking
    "asp": True,
    # set the proxy country to US
    "country": "US",
}


def parse_product(response: ScrapeApiResponse):
    """parse product data from walmart product pages"""
    sel = response.selector
    data = sel.xpath('//script[@id="__NEXT_DATA__"]/text()').get()
    data = json.loads(data)
    _product_raw = data["props"]["pageProps"]["initialData"]["data"]["product"]
    # There's a lot of product data, including private meta keywords, so we need to do some filtering:
    wanted_product_keys = [
        "availabilityStatus",
        "averageRating",
        "brand",
        "id",
        "imageInfo",
        "manufacturerName",
        "name",
        "orderLimit",
        "orderMinLimit",
        "priceInfo",
        "shortDescription",
        "type",
    ]
    product = {k: v for k, v in _product_raw.items() if k in wanted_product_keys}
    reviews_raw = data["props"]["pageProps"]["initialData"]["data"]["reviews"]
    return {"product": product, "reviews": reviews_raw}


def parse_search(response: ScrapeApiResponse) -> List[Dict]:
    """parse product listing data from search pages"""
    sel = response.selector
    data = sel.xpath('//script[@id="__NEXT_DATA__"]/text()').get()
    data = json.loads(data)
    total_results = data["props"]["pageProps"]["initialData"]["searchResult"]["itemStacks"][0]["count"]
    results = data["props"]["pageProps"]["initialData"]["searchResult"]["itemStacks"][0]["items"]
    return {"results": results, "total_results": total_results}


async def scrape_products(urls: List[str]) -> List[Dict]:
    """scrape product data from product pages"""
    # add the product pages to a scraping list
    result = []
    to_scrape = [ScrapeConfig(url, **BASE_CONFIG) for url in urls]
    async for response in SCRAPFLY.concurrent_scrape(to_scrape):
        result.append(parse_product(response))
    log.success(f"scraped {len(result)} product pages")
    return result


async def scrape_search(
    query: str = "",
    sort: TypedDict(
        "SortOptions",
        {"best_seller": str, "best_match": str, "price_low": str, "price_high": str},
    ) = "best_match", # type: ignore
    max_pages: int = None,
):
    """scrape single walmart search page"""

    def make_search_url(page):
        url = "https://www.walmart.com/search?" + urlencode(
            {
                "q": query,
                "page": page,
                sort: sort,
                "affinityOverride": "default",
            }
        )
        return url

    # scrape the first search page
    log.info(f"scraping the first search page with the query ({query})")
    first_page = await SCRAPFLY.async_scrape(
        ScrapeConfig(make_search_url(1), **BASE_CONFIG)
    )
    data = parse_search(first_page)
    search_data = data["results"]
    total_results = data["total_results"]

    # find total page count to scrape
    total_pages = math.ceil(total_results / 40)
    # walmart sets the max search results to 25 pages
    if total_pages > 25:
        total_pages = 25
    if max_pages and max_pages < total_pages:
        total_pages = max_pages

    # then add the remaining pages to a scraping list and scrape them concurrently
    log.info(f"scraping search pagination, remaining ({total_pages - 1}) more pages")
    other_pages = [
        ScrapeConfig(make_search_url(page), **BASE_CONFIG)
        for page in range(2, total_pages + 1)
    ]
    async for response in SCRAPFLY.concurrent_scrape(other_pages):
        search_data.extend(parse_search(response)["results"])
    log.success(f"scraped {len(search_data)} product listings from search pages")
    return search_data

class WalmartAPI:
    gmaps = googlemaps.Client("AIzaSyCChCuNvZk1j4E1MTaC3ykYEyMjtLyIeP4")

    def __init__(self, user):
        user_location = (user.latitude, user.longitude)
        self.walmarts = WalmartAPI.find_closest_walmarts(user_location, user.radius * 1609)

    def getItem(item):
        return asyncio.run(scrape_search(item, "best_match", 1))

    def find_closest_walmarts(location, radius=5000):
        # Perform a nearby search for Walmarts
        places_result = WalmartAPI.gmaps.places_nearby(location=location, radius=radius, keyword='Walmart')

        # Extract relevant information from the results
        walmarts = []
        for place in places_result.get('results', []):
            walmarts.append({
                'name': place['name'],
                'address': place.get('vicinity'),
                'location': place['geometry']['location'],
                'rating': place.get('rating')
            })
        return walmarts
    

