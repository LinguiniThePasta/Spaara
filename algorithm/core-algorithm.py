import random
from datetime import datetime

from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import math

g_normalized_s = 0
g_normalized_c = 0
g_normalized_distance = 0

data = ["(45.605507, -73.61299629999999)", "(45.5505596, -73.54293129999999)", "(45.4949618, -73.6198824)",
        "(45.4801326, -73.57579489999999)", "(45.51975470000001, -73.6747391)", "(45.4932387, -73.5642154)",
        "(45.45227999999999, -73.6097408)", "(45.51034719999999, -73.5750221)", "(45.64389810000001, -73.8630829)",
        "(45.7039742, -73.6504676)", "(45.45026069999999, -73.8588777)", "(45.5719578, -73.60502319999999)",
        "(45.573884, -73.697294)", "(45.5373305, -73.5708294)", "(45.5247714, -73.4666359)",
        "(45.55196660000001, -73.533701)", "(45.4565066, -73.6285856)", "(45.5926748, -73.6659595)",
        "(45.5848547, -73.5630262)", "(45.5312557, -73.5654928)"]
home = (45.55, -73.63)


# Probably won't need this one but keeping just in case
def convert_data_to_tuples(data):
    tuples = []
    for i in data:
        x = float(i.split(', ')[0][1:])
        y = float(i.split(', ')[1][:-1])
        tuples.append((x, y))
    return tuples


def perform_kmeans_clustering(store_locations, n_clusters=8):
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    kmeans.fit(store_locations)
    labels = kmeans.labels_
    return labels, kmeans


def assign_clusters_to_stores(stores, labels):
    for store, label in zip(stores, labels):
        store['cluster'] = label
    return stores


def calculate_inertias(tuples):
    inertias = []
    for i in range(1, 11):
        kmeans = KMeans(n_clusters=i)
        kmeans.fit(tuples)
        inertias.append(kmeans.inertia_)
    return inertias


def plot_inertias(inertias):
    plt.figure(figsize=(8, 4))
    plt.plot(range(1, len(inertias) + 1), inertias, marker='o')
    plt.title('Elbow Method for Optimal k')
    plt.xlabel('Number of clusters (k)')
    plt.ylabel('Inertia')
    plt.xticks(range(1, len(inertias) + 1))
    plt.grid(True)
    plt.show()


def visualize_clusters(stores, home):
    colors = ['red', 'blue', 'green', 'purple', 'orange', 'cyan', 'magenta', 'yellow', 'black', 'brown']
    plt.figure(figsize=(10, 8))
    labeled_clusters = set()

    for store in stores:
        cluster = store['cluster']
        # Label only the first occurrence of each cluster
        if cluster not in labeled_clusters:
            plt.scatter(store['location'][1], store['location'][0],
                        color=colors[cluster % len(colors)],
                        label=f"Cluster {cluster}", s=100, alpha=0.6)
            labeled_clusters.add(cluster)
        else:
            plt.scatter(store['location'][1], store['location'][0],
                        color=colors[cluster % len(colors)], s=100, alpha=0.6)

        # Add store name as a text label
        plt.text(store['location'][1] + 0.002, store['location'][0] + 0.002,
                 store['name'], fontsize=8)
    plt.scatter(
        home[1], home[0],  # Longitude (x), Latitude (y)
        color='black', marker='*', s=200,  # Star marker, larger size
        label="Home", zorder=5  # Ensure home is on top layer
    )
    plt.text(
        home[1] + 0.002, home[0] + 0.002,
        "Home", fontsize=12, fontweight='bold'
    )

    plt.title('Store Clusters')
    plt.xlabel('Longitude')
    plt.ylabel('Latitude')
    plt.legend()
    plt.show()


def compute_cost_savings_cluster(cluster, base_prices, grocery_list, covered_items):
    """
    Compute total cost savings for the cluster based on uncovered items.
    """
    savings = 0.0
    for item, base_price in base_prices.items():
        if item in grocery_list and item not in covered_items:
            # Find the minimum price for the item within the cluster
            min_price = min([store["items"].get(item, math.inf) for store in cluster])
            if min_price < base_price:
                savings += base_price - min_price
    return savings


def compute_coverage_cluster(cluster, grocery_list, covered_items):
    """
    Compute the number of uncovered items the cluster can cover.
    """
    coverage = 0
    for item in grocery_list:
        if item not in covered_items:
            # Check if any store in the cluster offers the item
            if any(item in store["items"] for store in cluster):
                coverage += 1
    return coverage


def normalize(value, max_value):
    """
    Normalize a value based on the maximum value.
    """
    if max_value == 0:
        return 0
    return value / max_value
def compute_distance(point1, point2):
    # For now it's just a euclidean distance thingy
    return math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2)

def rank_stores(cluster_stores, base_prices, grocery_list):
    """
    Rank stores within the cluster based on their individual cost savings and coverage.

    Parameters:
    - cluster_stores: List of stores within the selected cluster.
    - base_prices: Dictionary of base prices.
    - grocery_list: List of items to purchase.

    Returns:
    - ranked_stores: List of stores sorted by their score.
    """
    store_scores = []
    for store in cluster_stores:
        # Compute individual cost savings for the store
        store_cs = 0.0
        for item, base_price in base_prices.items():
            if item in grocery_list and item in store["items"]:
                store_price = store["items"].get(item, math.inf)
                if store_price < base_price:
                    store_cs += base_price - store_price
        # Compute coverage: number of unique items the store can provide
        store_sc = sum(1 for item in grocery_list if item in store["items"])
        store_scores.append({
            "store": store,
            "cost_savings": store_cs,
            "coverage": store_sc
        })

    # Determine maximums for normalization
    max_cs = max([s["cost_savings"] for s in store_scores], default=0)
    max_sc = max([s["coverage"] for s in store_scores], default=0)

    # Assign scores based on normalized cost savings and coverage
    for s in store_scores:
        normalized_cs = normalize(s["cost_savings"], max_cs)
        normalized_sc = normalize(s["coverage"], max_sc)
        # You can adjust these weights as needed
        score = (0.6 * normalized_cs) + (0.4 * normalized_sc)
        s["score"] = score

    # Sort stores by their score in descending order
    store_scores.sort(key=lambda x: x["score"], reverse=True)

    # Extract the sorted stores
    ranked_stores = [s["store"] for s in store_scores]
    return ranked_stores



def select_best_cluster(stores, base_prices, grocery_list, home, kmeans, criteria='cost_coverage',
                        w_s=0.7, w_c=0.3, w_d=0.0, max_stores=3, distance_function=compute_distance):
    """
    Select the best single cluster based on coverage, cost savings, and distance.

    Parameters:
    - stores: List of stores with cluster assignments.
    - base_prices: Dictionary of base prices.
    - grocery_list: List of items to purchase.
    - home: Tuple (latitude, longitude) representing home location.
    - criteria: 'cost_coverage', 'coverage_cost', 'only_cost', 'only_coverage'
    - w_c: Weight for cost savings.
    - w_s: Weight for coverage.
    - w_d: Weight for distance.
    - distance_function: Function to compute distance between two points.

    Returns:
    - best_cluster_label: Label of the selected cluster.
    - selected_stores: Stores within the selected cluster.
    - assignment: Item assignments to stores within the cluster.
    """
    # Organize stores by clusters
    cluster_to_stores = {}
    for store in stores:
        cluster = store['cluster']
        if cluster not in cluster_to_stores:
            cluster_to_stores[cluster] = []
        cluster_to_stores[cluster].append(store)

    # Evaluate each cluster
    cluster_scores = []
    for cluster_label, cluster_stores in cluster_to_stores.items():
        cs = compute_cost_savings_cluster(cluster_stores, base_prices, grocery_list, set())
        sc = compute_coverage_cluster(cluster_stores, grocery_list, set())
        # Compute cluster center
        cluster_center = kmeans.cluster_centers_[cluster_label]
        distance = distance_function(home, tuple(cluster_center))
        cluster_scores.append({
            "cluster": cluster_label,
            "cost_savings": cs,
            "coverage": sc,
            "distance": distance  # Distance from home to cluster center
        })

    # Determine maximums for normalization
    max_cs = max([c["cost_savings"] for c in cluster_scores], default=0)
    max_sc = max([c["coverage"] for c in cluster_scores], default=0)
    max_distance = max([c["distance"] for c in cluster_scores], default=0)

    # Compute scores based on criteria
    print("\nCluster Evaluation Summary:")
    for c in cluster_scores:
        normalized_cs = normalize(c["cost_savings"], max_cs)
        normalized_sc = normalize(c["coverage"], max_sc)
        normalized_distance = normalize(c["distance"], max_distance)

        if criteria == 'cost_coverage':
            # Higher cost savings and higher coverage are better; lower distance is better
            score = (w_s * normalized_cs) + (w_c * normalized_sc) - (w_d * normalized_distance)
        elif criteria == 'coverage_cost':
            score = (w_c * normalized_sc) + (w_s * normalized_cs) - (w_d * normalized_distance)
        elif criteria == 'only_cost':
            score = normalized_cs - (w_d * normalized_distance)
        elif criteria == 'only_coverage':
            score = normalized_sc - (w_d * normalized_distance)
        elif criteria == 'distance_only':
            score = - (w_d * normalized_distance)  # Only distance matters
        else:
            # Default to cost_coverage
            score = (w_s * normalized_cs) + (w_c * normalized_sc) - (w_d * normalized_distance)

        c["score"] = score
        print(f"Cluster {c['cluster']}:")
        print(f"  Normalized Cost Savings: {normalized_cs:.4f}")
        print(f"  Normalized Coverage: {normalized_sc:.4f}")
        print(f"  Normalized Distance: {normalized_distance:.4f}")
        print(f"  Score: {c['score']:.4f}\n")

    # Select the cluster with the highest score
    cluster_scores.sort(key=lambda x: x["score"], reverse=True)
    best_cluster = cluster_scores[0]

    if best_cluster["cost_savings"] == 0 and best_cluster["coverage"] == 0:
        # No viable cluster found
        return None, [], {}

    best_cluster_label = best_cluster["cluster"]
    cluster_stores = cluster_to_stores[best_cluster_label]

    ranked_stores = rank_stores(cluster_stores, base_prices, grocery_list)
    selected_stores = ranked_stores[:max_stores]

    # Assign each item to the store within the cluster that offers it at the lowest price
    assignment = {}
    for item in grocery_list:
        best_store = None
        lowest_price = math.inf
        for store in selected_stores:
            if item in store["items"]:
                price = store["items"][item]
                if price < lowest_price:
                    lowest_price = price
                    best_store = store["name"]
        if best_store:
            assignment[item] = {
                "store": best_store,
                "price": lowest_price
            }
        else:
            assignment[item] = {
                "store": None,
                "price": None
            }

    return best_cluster_label, selected_stores, assignment



def main():
    store_locations = convert_data_to_tuples(data)
    base_prices = {
        "eggs": 3.00,  # per dozen
        "milk": 2.50,  # per gallon
        "bread": 2.00,  # per loaf
        "beef": 5.00,  # per pound
        "apples": 1.50,  # per pound
        "chicken": 4.00,  # per pound
        "rice": 1.20,  # per pound
        "cheese": 3.50,  # per pound
    }

    # User's grocery list
    grocery_list = ["eggs", "milk", "bread", "beef", "apples", "chicken", "rice", "cheese"]

    # Define stores with names, locations, and item prices
    random.seed(datetime.now().timestamp())
    stores = []
    for i in range(len(store_locations)):
        store_number = i + 1
        location = store_locations[i]

        # Generate store with complete item list first
        store = {
            "name": f"Store {store_number}",
            "location": location,
            "items": {
                "eggs": round(2.70 + random.uniform(-1.5, 1.5), 2),  # Vary by up to $1.50
                "milk": round(2.30 + random.uniform(-0.2, 0.2), 2),
                "bread": round(1.80 + random.uniform(-0.4, 0.4), 2),
                "beef": round(14.80 + random.uniform(-10, 10), 2),
                "apples": round(1.50 + random.uniform(-0.15, 0.15), 2),
                "chicken": round(6.80 + random.uniform(-3.0, 3.0), 2),
                "rice": round(10.15 + random.uniform(-5.3, 5.3), 2),
                "cheese": round(3.40 + random.uniform(-0.2, 0.2), 2),
            }
        }

        # Randomly remove some items to simulate partial inventory
        for item in list(store["items"].keys()):
            #X chance to remove an item
            if random.random() < 0.1:
                del store["items"][item]

        # Optional: Uncomment to simulate specific testing scenarios
        # if store_number == 9:
        #     store = {
        #         "name": f"Store {store_number}",
        #         "location": location,
        #         "items": {
        #             "eggs": round(1), "milk": round(1), "bread": round(1),
        #             "beef": round(1), "apples": round(1), "chicken": round(1),
        #             "rice": round(1), "cheese": round(1),
        #         }
        #     }

        # Append store to the list
        stores.append(store)

    # Print all generated stores and their available items
    for store in stores:
        print(f"{store['name']} at {store['location']} offers:")
        for key, value in store['items'].items():
            print(f"\t{key} at ${value}")

    k = 8
    labels, kmeans = perform_kmeans_clustering(store_locations, n_clusters=k)
    stores = assign_clusters_to_stores(stores, labels)

    max_clusters = 1  # Since we are selecting a single cluster
    criteria = 'cost_coverage'
    # Options: 'cost_coverage', 'coverage_cost', 'only_cost', 'only_coverage'
    # Weight for cost savings
    w_s = 0.6
    # Weight for coverage
    w_c = 0.8
    w_d = 0.4

    # Select the best cluster
    best_cluster_label, selected_stores, assignment = select_best_cluster(
        stores, base_prices, grocery_list, home, kmeans,
        criteria=criteria, w_s=w_s, w_c=w_c, w_d=w_d, max_stores=3, distance_function=compute_distance
    )

    # Display the results
    sumA = 0.0
    if best_cluster_label is not None:
        print(f"Selected Cluster: {best_cluster_label}\n")
        print("Stores in the Selected Cluster:")
        for store in selected_stores:
            print(f"- {store['name']} at location {store['location']} (Cluster {store['cluster']})")

        print("\nItem Assignments:")
        for item, info in assignment.items():
            if info["store"]:
                print(f"- {item.capitalize()}: Buy from {info['store']} at ${info['price']:.2f}")
                sumA += info["price"]
            else:
                print(f"- {item.capitalize()}: Not available in the selected cluster.")
    else:
        print("No suitable cluster found to cover the grocery list.")
    print(f"Total price with given selection: ${sumA:.2f}")

    print("\nTotal Prices by Individual Store:")
    for store in stores:
        total_price = sum(store["items"].get(item, math.inf) for item in grocery_list if item in store["items"])
        print(f"- {store['name']}: Total cost ${total_price:.2f}")



    visualize_clusters(stores, home)


if __name__ == "__main__":
    main()
