package phtree

/*

type node struct {
	hc 			Hypercube
	size		int
	infixLen	uint64
	postfixLen	uint64
	infix 		[]uint64
	phtree 		*PHTree
}

func newNode(ph *PHTree) *node {
	return &node{
		hc: NewHCA(ph.dimension),
		phtree: ph,
	}
}

// Compare the prefix of the node with the prefix of the entry
// Find where hypercube address for the entry by taking the bit mask
// at the bit position that is at a bit depth of postfix length for the node

func (n *node) Emplace(e *Entry) *Entry {
	pos := n.phtree.CalcPosInArray(e, n.postfixLen)
	entryResult, ok := n.hc.Emplace(e, pos)
	if !ok {
		// Collision
	}
	return entryResult
}

func (n *node) isNode() bool {
	return true
}

func (n *node) HandleCollision(e Entry, p *Point, pos uint64, postfixLen uint64) *Entry {
	if e.isNode() {
		if e.subNode.infixLen > 0 {
			diffBits := n.phtree.NumberOfDivergingBits(oldE.Key, newE.Key, n.phtree.dimension)
			if diffBits > oldE.subNode.postfixLen + 1 {

			}
		}
	} else {
		diffBits := n.phtree.NumberOfDivergingBits(oldE.Key, newE.Key, n.phtree.dimension)
		if diffBits > 0 {

		}
	}
	return oldE
}

func (n *node) InsertSplit(oldE *Entry, newE *Entry, diffBits uint64, pos uint64) {
	newPostfixLen := diffBits - 1
	newSubNode := newNode(n.phtree)
	posOldE := newSubNode.phtree.CalcPosInArray(oldE, newPostfixLen)
	posNewE := newSubNode.phtree.CalcPosInArray(newE, newPostfixLen)
	newSubNode.hc.Emplace(oldE, posOldE)
	newSubNode.hc.Emplace(newE, posNewE)
	// Need interface for Entry instead of a struct Entry
	// Entry is interface for subnode and point
}


type Hypercube interface {
	Emplace(e *Entry, pos uint64) (*Entry, bool)
}

type HCA struct {
	address 		[]*Entry
}

func NewHCA(dim int) *HCA {
	return &HCA{
		address: make([]*Entry, 2^dim),
	}
}

func (hc *HCA) Emplace(e *Entry, pos uint64) (*Entry, bool) {
	if hc.address[pos] != nil {
		return hc.address[pos], false
	}
	hc.address[pos] = e
	return e, true
}

func (hc *HCA) Replace(e *Entry)
*/