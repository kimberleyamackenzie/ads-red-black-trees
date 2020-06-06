import BinarySearchTree from "./binary_search_tree";

// Exported for the tests :(
export class RBTNode {
  static BLACK = 'black';
  static RED = 'red';
  static sentinel = Object.freeze({ color: RBTNode.BLACK });

  constructor({
    key, value,
    color = RBTNode.RED,
    parent = RBTNode.sentinel,
    left = RBTNode.sentinel,
    right = RBTNode.sentinel,
  }) {
    this.key = key;
    this.value = value;
    this.color = color;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class RedBlackTree extends BinarySearchTree {
  constructor() {
    super(RBTNode)
  }

  /**
   * The two rotation functions are symetric, and could presumably
   * be collapsed into one that takes a direction 'left' or 'right',
   * calculates the opposite, and uses [] instead of . to access.
   *
   * Felt too confusing to be worth it. Plus I bet* the JIT optimizes two
   * functions with static lookups better than one with dynamic lookups.
   *
   * (*without any evidence whatsoever, 10 points to anyone who tries it out)
   */
  _rotateLeft(node) {
    const child = node.right;

    if (node === RBTNode.sentinel) {
      throw new Error('Cannot rotate a sentinel node');
    } else if (child === RBTNode.sentinel) {
      throw new Error('Cannot rotate away from a sentinal node');
    }

    // turn child's left subtree into node's right subtree
    node.right = child.left;
    if (child.left !== RBTNode.sentinel) {
      child.left.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (node === this._root) {
      this._root = child;
    } else if (node === node.parent.left) {
      node.parent.left = child;
    } else {
      node.parent.right = child;
    }

    // put node on child's left
    child.left = node;
    node.parent = child;

    // LOOK AT ME
    // I'M THE PARENT NOW
  }

  _rotateRight(node) {
    const child = node.left;

    if (node === RBTNode.sentinel) {
      throw new Error('Cannot rotate a sentinel node');
    } else if (child === RBTNode.sentinel) {
      throw new Error('Cannot rotate away from a sentinal node');
    }

    // turn child's right subtree into node's left subtree
    node.left = child.right;
    if (child.right !== RBTNode.sentinel) {
      child.right.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (node === this._root) {
      this._root = child;
    } else if (node === node.parent.right) {
      node.parent.right = child;
    } else {
      node.parent.left = child;
    }

    // put node on child's right
    child.right = node;
    node.parent = child;
  }

  _insertRebalance(node) {
    // The possible rule we violated is two red nodes in a row

    // We know the node we just inserted is red

    // We should check the parent, which could be red
    // If the parent is black, we're good

    // If not, then we know the grandparent is black, because of induction

    // Uncle could be red or black

    // We only need to do this so long as we have two red nodes in a row from our most recent insert
    while (node.color === RBTNode.RED && node.parent.color === RBTNode.RED){
      const grandparentNode = node.parent.parent;

      // If the parent node is the left child
      if (node.parent === grandparentNode.left){
        // Then the uncle is the right child
        const uncleNode = grandparentNode.right;

        // If the uncle is red
        if (uncleNode.color === RBTNode.RED){
          // Swap colors of the generations
          node.parent.color = RBTNode.BLACK;
          uncleNode.color = RBTNode.BLACK;
          grandparentNode.color = RBTNode.RED;
          // Move up the tree to see if we solved the problem
          node = grandparentNode;

        // If the uncle is black
        } else {
          if (node === node.parent.right){
            node = node.parent;
            this._rotateLeft(node);
          }

          node.parent.color = RBTNode.BLACK;
          grandparentNode.color = RBTNode.RED;
          this._rotateRight(grandparentNode);
        }
      }

      // If the parent node is the right child
      // node.parent === grandparentNode.right
      else {
        // Then the uncle is the left child
        const uncleNode = grandparentNode.left;

        // If the uncle is red
        if (uncleNode.color === RBTNode.RED){
            // Same thing we did above
            // Swap colors of the generations
            node.parent.color = RBTNode.BLACK;
            uncleNode.color = RBTNode.BLACK;
            grandparentNode.color = RBTNode.RED;
            // Move up the tree to see if we solved the problem
            node = grandparentNode;

        // Same thing we did above, but reversed
        // If the uncle is black
        } else {
          if (node === node.parent.left){
            node = node.parent;
            this._rotateRight(node);
          }

          node.parent.color = RBTNode.BLACK;
          grandparentNode.color = RBTNode.RED;
          this._rotateLeft(grandparentNode);
          }
        }
      }

    // Make sure the root is black
    this._root.color = RBTNode.BLACK;
  }

  insert(key, value) {
    const node = this._insertInternal(key, value);
    this._insertRebalance(node);
  }

  forEach(callback) {
    this._forEachInternal(callback, this);
  }
}


export default RedBlackTree;
