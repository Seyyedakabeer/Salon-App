from collections import Counter
from datetime import datetime
import random

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node

    def remove(self, ref_num):
        if not self.head:
            return
        if self.head.data['ref_num'] == ref_num:
            self.head = self.head.next
            return
        current = self.head
        while current.next:
            if current.next.data['ref_num'] == ref_num:
                current.next = current.next.next
                return
            current = current.next

    def count_visits_this_month(self):
        count = 0
        current_month = datetime.now().month
        current_year = datetime.now().year
        current = self.head
        while current:
            try:
                appt_date = datetime.fromisoformat(current.data['date'])
                if appt_date.month == current_month and appt_date.year == current_year:
                    count += 1
            except:
                pass
            current = current.next
        return count

    def top_two_services(self):
        services = []
        current = self.head
        while current:
            services.extend(current.data.get('services', []))
            current = current.next
        if not services:
            return []
        counter = Counter(services)
        return [service for service, _ in counter.most_common(2)]

class BSTNode:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, key, value):
        if not self.root:
            self.root = BSTNode(key, value)
        else:
            self._insert(self.root, key, value)

    def _insert(self, node, key, value):
        if key < node.key:
            if node.left:
                self._insert(node.left, key, value)
            else:
                node.left = BSTNode(key, value)
        elif key > node.key:
            if node.right:
                self._insert(node.right, key, value)
            else:
                node.right = BSTNode(key, value)
        else:
            node.value = value

    def search(self, key):
        return self._search(self.root, key)

    def _search(self, node, key):
        if not node or node.key == key:
            return node.value if node else None
        if key < node.key:
            return self._search(node.left, key)
        return self._search(node.right, key)

    def inorder(self):
        result = []
        self._inorder(self.root, result)
        return result

    def _inorder(self, node, result):
        if node:
            self._inorder(node.left, result)
            result.append({'key': node.key, 'value': node.value})
            self._inorder(node.right, result)

def quick_sort(arr, key=lambda x: x):
    if len(arr) <= 1:
        return arr
    pivot = arr[random.randint(0, len(arr) - 1)]
    left = [x for x in arr if key(x) < key(pivot)]
    middle = [x for x in arr if key(x) == key(pivot)]
    right = [x for x in arr if key(x) > key(pivot)]
    return quick_sort(left, key) + middle + quick_sort(right, key)