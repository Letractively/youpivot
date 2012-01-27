# Copyright 2010 Alex Ainslie. All Rights Reserved.

"""
This script downloads a specified favicon (url passed in as an argument) and	clusters the pixels using K 
Means for a specified value of K. If print_colors is set to True, all of the	cluster means are output and 
are sorted according to the number of pixels they contain. The k most common pixel values are output as well. 
Otherwise the mean of the largest cluster is printed. 

usage: png_colors.py num_colors favicon_url

"""
#__author__ = 'alexainslie@gmail.com (Alex Ainslie)'

import sys
import urllib
import png
import random
import math
from operator import itemgetter
from array import array

print_colors = False
too_light = 600
too_dark = 100
max_iterations = 100

badIconArray = array('B', [255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 0, 0, 0, 0, 78, 89, 158, 9, 65, 77, 152, 29, 122, 130, 182, 82, 116, 125, 179, 189, 99, 109, 170, 241, 84, 95, 162, 253, 84, 95, 162, 253, 98, 108, 170, 241, 115, 124, 179, 189, 121, 130, 182, 82, 65, 77, 152, 29, 78, 89, 158, 9, 190, 194, 219, 0, 255, 255, 255, 0, 255, 255, 255, 0, 78, 89, 158, 9, 71, 82, 155, 35, 109, 119, 176, 136, 97, 107, 169, 214, 133, 140, 188, 236, 163, 174, 206, 255, 157, 169, 203, 255, 163, 174, 206, 255, 196, 204, 225, 255, 127, 135, 185, 236, 95, 105, 168, 214, 109, 118, 175, 136, 71, 82, 155, 35, 78, 89, 158, 9, 255, 255, 255, 0, 255, 255, 255, 0, 65, 77, 152, 29, 109, 118, 176, 136, 99, 109, 171, 226, 141, 153, 194, 255, 174, 184, 213, 255, 185, 194, 219, 255, 235, 239, 247, 255, 224, 229, 241, 255, 255, 255, 255, 255, 230, 234, 245, 255, 185, 194, 219, 255, 95, 105, 168, 226, 108, 117, 175, 136, 65, 77, 152, 29, 255, 255, 255, 0, 255, 255, 255, 0, 121, 130, 182, 82, 95, 106, 168, 214, 196, 204, 225, 255, 174, 184, 213, 255, 174, 184, 213, 255, 179, 189, 216, 255, 179, 189, 216, 255, 224, 229, 241, 255, 255, 255, 255, 255, 252, 253, 255, 255, 190, 199, 222, 255, 191, 199, 222, 255, 94, 105, 167, 214, 121, 130, 182, 82, 255, 255, 255, 0, 255, 255, 255, 0, 115, 124, 179, 189, 127, 135, 185, 236, 252, 253, 255, 255, 174, 184, 213, 255, 174, 184, 213, 255, 174, 184, 213, 255, 174, 184, 213, 255, 241, 244, 251, 255, 255, 255, 255, 255, 241, 244, 251, 255, 174, 184, 213, 255, 208, 214, 231, 255, 124, 132, 184, 236, 114, 123, 178, 189, 255, 255, 255, 0, 255, 255, 255, 0, 98, 108, 170, 241, 196, 204, 225, 255, 241, 244, 251, 255, 174, 184, 213, 255, 174, 184, 213, 255, 174, 184, 213, 255, 241, 244, 251, 255, 255, 255, 255, 255, 255, 255, 255, 255, 252, 253, 255, 255, 213, 219, 235, 255, 174, 184, 213, 255, 196, 204, 225, 255, 96, 106, 169, 241, 255, 255, 255, 0, 255, 255, 255, 0, 83, 94, 161, 253, 219, 224, 239, 255, 255, 255, 255, 255, 185, 194, 219, 255, 213, 219, 235, 255, 241, 244, 251, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 190, 199, 222, 255, 174, 184, 213, 255, 219, 224, 239, 255, 82, 92, 160, 253, 255, 255, 255, 0, 255, 255, 255, 0, 83, 94, 161, 253, 230, 234, 245, 255, 255, 255, 255, 255, 241, 244, 251, 255, 185, 194, 219, 255, 235, 239, 247, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 190, 199, 222, 255, 179, 189, 216, 255, 219, 224, 239, 255, 81, 92, 160, 253, 255, 255, 255, 0, 255, 255, 255, 0, 97, 107, 169, 241, 196, 204, 225, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 196, 204, 225, 255, 196, 204, 225, 255, 196, 204, 225, 255, 230, 234, 245, 255, 255, 255, 255, 255, 255, 255, 255, 255, 235, 239, 247, 255, 196, 204, 225, 255, 95, 105, 168, 241, 255, 255, 255, 0, 255, 255, 255, 0, 115, 124, 179, 189, 128, 135, 185, 236, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 241, 244, 251, 255, 174, 184, 213, 255, 174, 184, 213, 255, 174, 184, 213, 255, 201, 209, 229, 255, 255, 255, 255, 255, 255, 255, 255, 255, 119, 128, 181, 236, 113, 122, 178, 189, 255, 255, 255, 0, 255, 255, 255, 0, 121, 130, 182, 81, 95, 105, 168, 214, 196, 204, 225, 255, 255, 255, 255, 255, 255, 255, 255, 255, 241, 244, 251, 255, 174, 184, 213, 255, 174, 184, 213, 255, 174, 184, 213, 255, 174, 184, 213, 255, 252, 253, 255, 255, 196, 204, 225, 255, 93, 104, 167, 214, 121, 129, 182, 81, 255, 255, 255, 0, 255, 255, 255, 0, 65, 77, 152, 29, 109, 118, 175, 136, 95, 106, 168, 226, 196, 204, 225, 255, 255, 255, 255, 255, 255, 255, 255, 255, 219, 224, 239, 255, 174, 184, 213, 255, 174, 184, 213, 255, 219, 224, 239, 255, 196, 204, 225, 255, 93, 103, 167, 226, 108, 117, 175, 136, 65, 77, 152, 29, 255, 255, 255, 0, 255, 255, 255, 0, 78, 89, 158, 9, 71, 82, 155, 35, 108, 118, 175, 136, 94, 105, 167, 214, 122, 130, 182, 236, 196, 204, 225, 255, 191, 199, 222, 255, 157, 169, 203, 255, 151, 163, 200, 255, 122, 130, 183, 236, 93, 104, 167, 214, 108, 117, 175, 136, 71, 82, 155, 35, 78, 89, 158, 9, 255, 255, 255, 0, 255, 255, 255, 0, 0, 0, 0, 0, 78, 89, 158, 9, 65, 77, 152, 29, 121, 129, 182, 81, 114, 123, 178, 189, 96, 106, 169, 241, 82, 93, 161, 253, 81, 92, 160, 253, 95, 105, 168, 241, 114, 123, 178, 188, 123, 131, 183, 80, 66, 77, 152, 29, 78, 89, 158, 9, 190, 194, 219, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0])

def GetFaviconColors(filename, url, k):
	"""Grabs the favicon at a given path, prints the k most common pixel colors and calls returns the output of KMeans"""
	try:
		favicon = png.Reader(file=urllib.urlopen(filename))
		im = favicon.read_flat()
	except png.FormatError:
		favicon = png.Reader(file=urllib.urlopen("http://www.google.com/s2/favicons?domain="+url))
		im = favicon.read_flat()
	
	
	if badIconArray == im[2]:
            return [random.randint(50, 200), random.randint(50, 200), random.randint(50, 200), 'random']
	
	pixels = []
	count = 0
	pixel = ()
	for a in im[2]:
		if count < 3:
			pixel += a,
			count += 1
		else:
			pixels.append(pixel)
			pixel = ()
			count = 0
	
	kMeansValue = KMeans(pixels, k)
        return [kMeansValue[0], kMeansValue[1], kMeansValue[2], 'extract']
		
def KMeans(pixels, k):	
	"""
		Performs KMeans in three dimensional space (R,G,B) until convergence or hitting max_iterations.
		Returns the mean (R,G,B) values for the cluster with the greatest number of pixels. 
	"""
	clusters = {}
	random_starts = []
	itr_count = 0
	
	# Randomly select k starting pixels
	while len(random_starts) < k:
		start = int(round(random.random()*len(pixels)))
		if start not in random_starts:
			random_starts.append(start)
	
	# Assign the starting pixels to clusters	
	for i in xrange(k):
		clusters[i] = (pixels[random_starts[i]], []) #RGB centroid followed by the id of the piels in this cluster
		
	converged = False
	prev_centroids = []
	
	# Update cluster assignments and centroids until convergence or max_iterations
	while not converged and itr_count < max_iterations:
		cluster_size = {}
		# Assign pixels to clusters based on euclidean distance from centroids
		for p in xrange(len(pixels)):
			distances = []
			for i in xrange(k):
				distances.append((EuclideanDistance(pixels[p], clusters[i][0]), i))
			closest = min(distances)[1]
			clusters[closest][1].append(p) 
			cluster_size[closest] = cluster_size.get(closest, 0) + 1
		
		# Calculate new centroids for each cluster and check for convergence
		new_centroids = ComputeCentroids(pixels, clusters)
		for i in xrange(k): 
			clusters[i] = (new_centroids[i], clusters[i][1])
		if new_centroids == prev_centroids: converged = True
		prev_centroids = new_centroids
		itr_count += 1
	
	result = None
	if print_colors: print "\nk-means converged after", itr_count, "iterations"
	for i in sorted(cluster_size.items(), key=itemgetter(1), reverse=True):
		if print_colors: print new_centroids[i[0]], i[1],
		if sum(new_centroids[i[0]]) > too_light or sum(new_centroids[i[0]]) < too_dark: 
			if print_colors: print "[skip]"
		else:
			if result == None: result = new_centroids[i[0]]
			if print_colors: print 
	
	return result
			
def ComputeCentroids(pixels, clusters):
	""" Computes the mean (R,G,B) values for each cluster. """
	result = []
	for c in clusters:
		R, G, B = 0, 0, 0
		for p in clusters[c][1]:
			R += pixels[p][0]
			G += pixels[p][1]
			B += pixels[p][2]
		R /= len(clusters[c][1]) + 1 
		G /= len(clusters[c][1]) + 1
		B /= len(clusters[c][1]) + 1
		result.append((R, G, B))
	return result

def EuclideanDistance(p, q):
	""" Returns the euclidean distance between two pixels described by their (R,G,B) values. """
	sum_diff_squared = 0
	for i in xrange(len(p)):
		sum_diff_squared += (p[i] - q[i]) ** 2
	return math.sqrt(sum_diff_squared)
	
def main():
	if len(sys.argv) != 3:
		print 'usage: png_colors.py num_colors favicon_url'
		sys.exit(1)

	k = sys.argv[1]
	filename = sys.argv[2]

	if not k.isdigit():
		print 'error: the number of colors must be an integer'
		sys.exit(1)

	color = GetFaviconColors(filename, int(k))
	
	print "\n", color, "\n"
	
if __name__ == '__main__':
	main()
