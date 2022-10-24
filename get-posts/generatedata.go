package fake

import (
	"fmt"
	"math"
	"math/rand"
)

func fakelikes() int {
	likes := 20
	return likes
}

func fakedistancefromcity(radius float64) float64 {
	randnum := rand.Float64() * 99.173 + 0.827   // So randnum is between [0.827, 100]
	dist := radius * (1/math.Sqrt(randnum) - 0.1)
	return dist
}

func GenerateData(num int) {
	for i:=0; i < num; i++ {
		dist := fakedistancefromcity(10)
		fmt.Println(dist)
	}
}
