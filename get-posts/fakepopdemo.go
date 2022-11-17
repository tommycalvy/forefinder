package fake

import (
	"bufio"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"log"
	"math"
	"math/rand"
	"os"
	"strconv"
	"strings"
)

func drawCircle(img draw.Image, x0, y0, r int, c color.Color) {
    x, y, dx, dy := r-1, 0, 1, 1
    err := dx - (r * 2)

    for x > y {
        img.Set(x0+x, y0+y, c)
        img.Set(x0+y, y0+x, c)
        img.Set(x0-y, y0+x, c)
        img.Set(x0-x, y0+y, c)
        img.Set(x0-x, y0-y, c)
        img.Set(x0-y, y0-x, c)
        img.Set(x0+y, y0-x, c)
        img.Set(x0+x, y0-y, c)

        if err <= 0 {
            y++
            err += dy
            dy += 2
        }
        if err > 0 {
            x--
            dx += 2
            err += dx - (r * 2)
        }
    }
}

func setBackgroundColor(img *image.RGBA, c color.Color) {
	b := img.Bounds()

    for y := b.Min.Y; y < b.Max.Y; y++ {
        for x := b.Min.X; x < b.Max.X; x++ {
            img.Set(x, y, c)
        }
    }
}

func testPopulation() {
	width := 2048
	height := 2048

	pop := 10000
	
	f, err := os.Create("population-test.png")
	if err != nil {
		log.Fatalf("err: %v", err)
	}
	defer f.Close()
	rect := image.Rect(0, 0, width, height)
	poptestimg := image.NewRGBA(rect)
	setBackgroundColor(poptestimg, color.White)
	drawCircle(poptestimg, 1024, 1024, 1000, color.Black)

	for i := 0; i < pop; i++ {
		r := FakeDistanceFromCityV6(1000)
		a := rand.Float64() * 360
		x := int(r * math.Cos(a)) + 1024
		y := int(r * math.Sin(a)) + 1024
		drawCircle(poptestimg, x, y, 3, color.RGBA{255, 0, 0, 255})
	}
	
	err = png.Encode(f, poptestimg)
	if err != nil {
		log.Fatalf("err: %v", err)
	}
	log.Printf("Success!")
}

func printLikes(num int, maxlikes int) {
	for i := 0; i < num; i++ {
		likes := FakeLikes(maxlikes)
		fmt.Println(likes)
	}
}

func printKarma(num int, maxKarma int) {
	for i := 0; i < num; i++ {
		karma := FakeLikes(maxKarma)
		fmt.Println(karma)
	}
}

type City struct {
	Latitude		float64
	Longitude 		float64
	Probability		float64
	Population 		int
}

func loadCities() []City {
	f, err := os.Open("citygeoprob.txt")
	if err != nil {
		log.Fatalf("err: %v", err)
	}
	defer f.Close()
	sc := bufio.NewScanner(f)
	cities := []City{}
	for sc.Scan() {
		city := City{}
		line := sc.Text()
		values := strings.Fields(line)
		prob, err := strconv.ParseFloat(values[len(values) - 1], 64)
		if err != nil {
			fmt.Println(err)
		}
		lat, err := strconv.ParseFloat(values[len(values) - 3], 64)
		if err != nil {
			fmt.Println(err)
		}
		long, err := strconv.ParseFloat(values[len(values) - 2], 64)
		if err != nil {
			fmt.Println(err)
		}
		pop, err := strconv.Atoi(values[len(values) - 4])
		if err != nil {
			fmt.Println(err)
		}
		city.Latitude = lat
		city.Longitude = long
		city.Probability = prob
		city.Population = pop
		cities = append(cities, city)
	}
	return cities
}

type Post struct {
	Latitude		float64
	Longitude		float64
	Timestamp		int64
	Likes 			int 
	Karma 			int 
	Channel 		string
}

func createFakePost(cities []City) Post {
	post := Post{}
	var lat float64
	var long float64
	var pop int
	for true {
		randnum := rand.Int63n(int64(len(cities)))
		if rand.Float64() <= cities[randnum].Probability {
			lat = cities[randnum].Latitude
			long = cities[randnum].Longitude
			pop = cities[randnum].Population
			break
		}
	}
	maxRadius := float64(pop)/320000 + 5   // Max of 30 miles and min of 5 miles
	post.Latitude, post.Longitude = LatLongVariance(lat, long, maxRadius)
	post.Timestamp = FakeTimeStamp(1)
	post.Likes = FakeLikes(10000)
	post.Karma = FakeKarma(100000) + post.Likes
	post.Channel = RandomString(3, 30)
	return post
}

func createTestData(num int) {
	f, err := os.Create("post-test-data.txt")
	if err != nil {
		log.Fatalf("err: %v", err)
	}
	defer f.Close()
	wr := bufio.NewWriter(f)
	cities := loadCities()
	for i:= 0; i < num; i++ {
		post := createFakePost(cities)
		lat := strconv.FormatFloat(post.Latitude, 'f', 6, 64)
		long := strconv.FormatFloat(post.Longitude, 'f', 6, 64)
		timestamp := strconv.FormatInt(post.Timestamp, 10)
		likes := strconv.Itoa(post.Likes)
		karma := strconv.Itoa(post.Karma)
		channel := post.Channel
		newline := fmt.Sprintf("%s %-32s %11s %11s %6s %6s\n", timestamp, channel, lat, long, likes, karma)
		wr.WriteString(newline)
	}
	wr.Flush()
	fmt.Println("Success!")
}

func main() {
	createTestData(100000)
}