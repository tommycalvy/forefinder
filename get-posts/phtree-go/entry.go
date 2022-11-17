package phtree


type Value interface {
	Equals(v Value)	bool
}

type Point struct {
	Key 		[]uint64
	Value 		interface{}
}

type Entry interface {
	isNode() 	bool
}

func NewPoint(k []uint64, v interface{}) *Point {
	return &Point{
		Key: k,
		Value: v,
	}
}

func (p *Point) isNode() bool {
	return false
}

/*
func (e *Entry) Equals(newE *Entry) bool {
	if newE == e {
		return true
	}
	if len(newE.Key) != len(e.Key) {
        return false
    }
    for i, v := range newE.Key {
        if v != e.Key[i] {
            return false
        }
    }
	if e.Value != nil {
		return e.Value.Equals(newE.Value)
	} 
	if newE.Value != nil {
		return false
	}
	return true
}
*/