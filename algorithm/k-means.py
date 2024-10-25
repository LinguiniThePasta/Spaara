from sklearn.cluster import KMeans
import matplotlib.pyplot as plt


data = ["(45.605507, -73.61299629999999)", "(45.5505596, -73.54293129999999)", "(45.4949618, -73.6198824)",
        "(45.4801326, -73.57579489999999)", "(45.51975470000001, -73.6747391)", "(45.4932387, -73.5642154)",
        "(45.45227999999999, -73.6097408)", "(45.51034719999999, -73.5750221)", "(45.64389810000001, -73.8630829)",
        "(45.7039742, -73.6504676)", "(45.45026069999999, -73.8588777)", "(45.5719578, -73.60502319999999)",
        "(45.573884, -73.697294)", "(45.5373305, -73.5708294)", "(45.5247714, -73.4666359)",
        "(45.55196660000001, -73.533701)", "(45.4565066, -73.6285856)", "(45.5926748, -73.6659595)",
        "(45.5848547, -73.5630262)", "(45.5312557, -73.5654928)"]
# Probably won't need this one but keeping just in case
def convert_data_to_tupes(data):
    tuples = []
    for i in data:
        x = float(i.split(', ')[0][2:])
        y = float(i.split(', ')[1][:-1])
        tuples.append((x, y))

    return tuples

def calculate_k_means(tuples):
    kmeans = KMeans(n_clusters=8)
    kmeans.fit(tuples)
    return kmeans.labels_

def calculate_inertias(tuples):
    inertias = []
    for i in range(1, 11):
        kmeans = KMeans(n_clusters=i)
        kmeans.fit(tuples)
        inertias.append(kmeans.inertia_)
    return inertias

def setCoverGreedy():
