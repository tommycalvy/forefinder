package fake

import (
	"bufio"
	"fmt"
	"log"
	"math"
	"math/rand"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/zeebo/xxh3"
)


func FakeLikes(maxlikes int) int {
	randnum := rand.Float64() * 2 + 1/math.Sqrt(float64(maxlikes))
	likes := int(1/(randnum * randnum))
	return likes
}

func FakeKarma(maxKarma int) int {
	randnum := rand.Float64() * 2 + 1/float64(maxKarma)
	likes := int(1/randnum)
	return likes
}

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func RandomString(min int, max int) string {
	wordLength := (rand.Int63() % int64(max - min)) + int64(min)
	b := make([]byte, wordLength)
    for i := range b {
        b[i] = letterBytes[rand.Int63() % int64(len(letterBytes))]
    }
    return string(b)
}

func XXHash(input string) uint64 {
	output := xxh3.Hash([]byte(input))
	return output
}

// Returns
// Between [0, # of milliseconds in a x # of years]
func FakeTimeStamp(years int64) int64 {
	timenow := time.Now().UnixMilli()
	milliseconds := rand.Int63n(31536000000) 
	return timenow + milliseconds * years
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
	randnum := rand.Float64() * 0.75 + 0.25   // So randnum is between [0.25, 1]
	dist := radius * (1/math.Sqrt(randnum) - 1)
	return dist
}

// Radius is in miles
func LatLongVariance(lat float64, long float64, radius float64) (float64, float64) {

		a := rand.Float64() * 2 * math.Pi
		r := FakeDistanceFromCityV6(radius / 69) // 1 degree is 69 miles
		newLat := r * math.Sin(a) + lat
		newLong := r * math.Cos(a) + long
		return newLat, newLong
}

func GenerateData(num int) {
	for i:=0; i < num; i++ {
		dist := FakeDistanceFromCityV1(10)
		fmt.Println(dist)
	}
}

type city struct {
	Line 			string
	Population		int
}

func AddCityProbabilities() {
	f, err := os.Open("citytowngeopop.txt")
	if err != nil {
		log.Fatal(err)
	}
	sc := bufio.NewScanner(f)
	totalpop := 0
	numcities := 0
	cities := []city{}
	for sc.Scan() {
		line := sc.Text()
		values := strings.Fields(line)
		for i := 2; i < 5; i++ {
			pop, err := strconv.Atoi(values[i])
			if err == nil {
				numcities++
				totalpop += pop
				fmt.Printf("City#: %d, Pop#: %d, Total#: %d\n", numcities, pop, totalpop)
				cities = append(cities, city{ Line: line, Population: pop})
				break;
			} else {
				fmt.Println(err)
			}
		}
	}
	f.Close()
	f, err = os.Create("citygeoprob.txt")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Total Population: %d\n", totalpop)
	wr := bufio.NewWriter(f)
	totalprob := 0.0
	for i:=0; i < numcities; i++ {
		prob := float64(cities[i].Population)/float64(totalpop)
		totalprob += prob
		propability := strconv.FormatFloat(prob,'f', 6, 64)
		newline := cities[i].Line + " " + propability + "\n"
		num, err := wr.WriteString(newline)
		if err != nil {
			fmt.Println(err)
		} else {
			fmt.Printf("Bytes Written: %d; %v", num, newline)
		}
	}
	wr.Flush()
	f.Close()
	fmt.Printf("Total Probability: %f\n", totalprob)
}