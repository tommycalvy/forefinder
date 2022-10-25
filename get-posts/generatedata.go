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

func FakeDistanceFromCityV1(radius float64) float64 {
	randnum := rand.Float64() * 99.173 + 0.827   // So randnum is between [0.827, 100]
	dist := radius * (1/math.Sqrt(randnum) - 0.1)
	return dist
}

func FakeDistanceFromCityV2(radius float64) float64 {
	randnum := rand.Float64() * 9.091 + 0.909   // So randnum is between [0.827, 100]
	dist := radius * (1/randnum - 0.1)
	return dist
}

func FakeDistanceFromCityV3(radius float64) float64 {
	randnum := rand.Float64() * 15.36 + 0.64   // So randnum is between [0.827, 100]
	dist := radius * (1/math.Sqrt(randnum) - 0.25)
	return dist
}

func FakeDistanceFromCityV4(radius float64) float64 {
	randnum := rand.Float64() * 8.4375 + 0.5625   // So randnum is between [0.827, 100]
	dist := radius * (1/math.Sqrt(randnum) - 0.333)
	return dist
}

func FakeDistanceFromCityV5(radius float64) float64 {
	randnum := rand.Float64() * 3.5555 + 0.4445   // So randnum is between [0.827, 100]
	dist := radius * (1/math.Sqrt(randnum) - 0.5)
	return dist
}

// Looks the best
func FakeDistanceFromCityV6(radius float64) float64 {
	randnum := rand.Float64() * 0.75 + 0.25   // So randnum is between [0.827, 100]
	dist := radius * (1/math.Sqrt(randnum) - 1)
	return dist
}

func GenerateData(num int) {
	for i:=0; i < num; i++ {
		dist := FakeDistanceFromCityV1(10)
		fmt.Println(dist)
	}
}
