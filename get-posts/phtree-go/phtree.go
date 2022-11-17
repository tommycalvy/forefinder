package phtree

/*
import (
	"math/bits"
	"sync"
)

type PHTree struct {
	root 			*node
	size			int
	maxBitWidth		uint64
	dimension		int
}

func New(w uint64, d int, size int) *PHTree {
	phtree := &PHTree{
		maxBitWidth: w,
		dimension: d,
	}
	node := newNode(phtree)
	phtree.root = node
	return phtree
}

type FreeListPH struct {
	mu       sync.Mutex
	freelist []*node
}

// NewFreeListG creates a new free list.
// size is the maximum size of the returned free list.
func NewFreeListPH(size int) *FreeListPH {
	return &FreeListPH{freelist: make([]*node, 0, size)}
}

func (ph *PHTree) CalcPosInArray(entry *Entry, postfixLen uint64) uint64 {
	var hcpos uint64 = 0
	var bitmask uint64 = 1 << postfixLen
	for i:=0; i < ph.dimension; i++ {
		hcpos <<= 1
		hcpos |= (bitmask & entry.Key[i]) >> postfixLen
	}
	return hcpos
}
func (ph *PHTree) NumberOfDivergingBits(p1 []uint64, p2 []uint64, dim int) uint64 {
	var diff uint64 = 0
	for i:=0; i < dim; i++ {
		diff |= p1[i] ^ p2[i]
	}
	return ph.maxBitWidth - uint64(bits.LeadingZeros64(diff))
}

*/

