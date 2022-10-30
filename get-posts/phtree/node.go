package phtree

type node struct {
	hc 			Hypercube
	size		int
	infixLen	int
	postfixLen	uint64
	infix 		[]int64
}

func newNode(dim int) *node {
	return &node{
		hc: NewHCA(dim),
	}
}

// Compare the prefix of the node with the prefix of the entry
// Find where hypercube address for the entry by taking the bit mask
// at the bit position that is at a bit depth of postfix length for the node
func (n *node) Emplace(e *Entry) *Entry {
	pos := CalcPosInArray(e, n.postfixLen)
	entryResult, ok := n.hc.Emplace(e, pos)
	if !ok {
		// Collision
	}
	return entryResult
}

func (n *node) HandleCollision()


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