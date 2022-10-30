package phtree

type Key []uint64

type Value interface {
	Equals(v Value)	bool
}

type Entry struct {
	Key 		Key
	Value		Value
	subNode 	*node
	Dimension	int
}

func NewEntry(k Key, v Value) *Entry {
	return &Entry{
		Key: k,
		Value: v,
	}
}

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
