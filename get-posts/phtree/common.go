package phtree


func CalcPosInArray(entry *Entry, postfixLen uint64) uint64 {
	var hcpos uint64 = 0
	var bitmask uint64 = 1 << postfixLen
	for i:=0; i < entry.Dimension; i++ {
		hcpos <<= 1
		hcpos |= (bitmask & entry.Key[i]) >> postfixLen
	}
	return hcpos
}