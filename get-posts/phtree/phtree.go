package phtree




type point struct {
	value 	[]int64

}


type PHTree struct {
	root 	*node
	dim 	int
	size	int
}

func New(dim int) *PHTree {
	return &PHTree{
		root: newNode(dim),
		dim: dim,
	}
}



