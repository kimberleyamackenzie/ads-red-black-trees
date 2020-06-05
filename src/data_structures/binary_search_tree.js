class BSTNode {
  constructor({ key, value, parent, left, right }) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(Node = BSTNode) {
    this.Node = Node;
    this._count = 0;
    this._root = undefined;
  }

  insert(key, value = true) {
    const results = this._findNode(key);
    // The node may or may not exist
    let { node } = results;
    // If the node doesn't exist, and there is a root, the parent will exist
    const { parent } = results;

    // If the node exists, we just have to replace the value
    if (node && node.key) {
      node.value = value;
    // Otherwise, we have to do a true insert
    } else {
      // Create a new node to insert and increase the count
      node = new this.Node({ key, value, parent });
      this._count += 1;
      // If there is a parent, we know where to put the new node
      if (parent?.key) {
        if (key < parent.key) {
          parent.left = node;
        } else {
          parent.right = node;
        }
      // If there is no parent, the tree is empty, and the new node becomes the root
      } else {
        this._root = node;
      }
    }

    return node;
  }

  lookup(key) {
    let node = this._root;

    while (node) {
      if (key < node.key) {
        node = node.left;
      } else if (key > node.key) {
        node = node.right;
      } else { // equal
        return node.value;
      }
    }
  }

  _findNode(key) {
    // Retuns {node, parent}, either of which may be undefined
    // Node undefined means the key isn't in the tree
    // Parent undefined means node is the root
    let node = this._root;
    let parent = node?.parent;

    // Nodes without keys are considered sentinels
    // While we have a valid node, keep traversing the tree to update the parent and node
    while (node && node.key !== undefined) {
      if (key < node.key) {
        parent = node;
        node = node.left;
      } else if (key > node.key) {
        parent = node;
        node = node.right;
      } else { // equal
        break;
      }
    }
    return { node, parent }
  }

  delete(key) {
    const { node, parent } = this._findNode(key);

    // If the node doesn't exist, there's nothing to delete
    if (!node) {
      return undefined;
    }

    let replacement;

    // If the node has two children (complex case)
    if (node.left && node.right) {

      // Find the in-order node that will replace the node (successor) and transpose it to node's spot
      let successor = node.right;
      if (successor.left) {
        // Walk all the way to the left
        while (successor.left) {
          successor = successor.left;
        }

        // Make sure its old right child is taken care of
        successor.parent.left = successor.right;
        if (successor.right) {
          successor.right.parent = successor.parent;
        }

        // Assign the new right child
        successor.right = node.right;
        node.right.parent = successor;
      }

      successor.left = node.left;
      successor.left.parent = successor;

      replacement = successor;
    // One or no child -> acts like a linked list
    } else {
      replacement = node.left ? node.left : node.right;
    }

    // fixup links to parent
    if (parent) {
      const direction = node === parent.left ? 'left' : 'right';
      parent[direction] = replacement;

    } else {
      this._root = replacement;
    }

    if (replacement) {
      replacement.parent = parent;
    }

    // fix count and return
    this._count -= 1;
    return node.value;
  }

  count() {
    return this._count;
  }

  forEach(callback) {
    // This is a little different from the version presented in the video.
    // The form is similar, but it invokes the callback with more arguments
    // to match the interface for Array.forEach:
    //   callback({ key, value }, i, this)
    const visitSubtree = (node, callback, i = 0) => {
      if (node) {
        i = visitSubtree(node.left, callback, i);
        callback({ key: node.key, value: node.value }, i, this);
        i = visitSubtree(node.right, callback, i + 1);
      }
      return i;
    }
    visitSubtree(this._root, callback)
  }
}

export default BinarySearchTree;
