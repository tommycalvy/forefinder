package main

import (
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"log"
	"math"
	"math/rand"
	"os"

	fake "github.com/tommycalvy/forefinder/get-posts"
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

func main() {
	width := 2048
	height := 2048

	pop := 2000
	

	f, err := os.Create("population-test.png")
	if err != nil {
		log.Fatalf("err: %v", err)
	}
	defer f.Close()
	rect := image.Rect(0, 0, width, height)
	poptestimg := image.NewRGBA(rect)
	setBackgroundColor(poptestimg, color.White)
	drawCircle(poptestimg, 1024, 1024, 500, color.Black)
	//drawCircle(poptestimg, 1024, 1024, 900, color.Black)

	//drawCircle(poptestimg, 1024, 1024, 800, color.Black)
	//drawCircle(poptestimg, 1024, 1024, 700, color.Black)
	//drawCircle(poptestimg, 1024, 1024, 600, color.Black)
	//drawCircle(poptestimg, 1024, 1024, 500, color.Black)
	//drawCircle(poptestimg, 1024, 1024, 400, color.Black)
	//drawCircle(poptestimg, 1024, 1024, 300, color.Black)
	//drawCircle(poptestimg, 1024, 1024, 200, color.Black)
	//drawCircle(poptestimg, 1024, 1024, 100, color.Black)




	for i := 0; i < pop; i++ {
		r := fake.FakeDistanceFromCityV6(500)
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