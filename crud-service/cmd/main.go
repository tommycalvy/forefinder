package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-kit/log"
	service "github.com/tommycalvy/forefinder/crud-service"
	"github.com/tommycalvy/forefinder/crud-service/profile"
	"github.com/tommycalvy/forefinder/crud-service/user"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
  	if err != nil {
    	fmt.Println("Error loading .env file")
  	}

	var (
		httpAddr = flag.String("http.addr", ":5656", "HTTP listen address")
	)
	flag.Parse()

	var logger log.Logger
	{
		logger = log.NewLogfmtLogger(os.Stderr)
		logger = log.With(logger, "ts", log.DefaultTimestampUTC)
		logger = log.With(logger, "caller", log.DefaultCaller)
	}

	var s service.Service 
	{
		tableName := os.Getenv("AWS_TABLE_NAME")
		fmt.Println("Table Name: ", tableName)
		profileRepo := profile.NewProfileRepo(tableName)
		userRepo := user.NewProfileRepo(tableName)

		s = service.NewService(userRepo, profileRepo)
		s = service.NewLoggingService(log.With(logger, "component", "profile"), s)
	}
	
	var h http.Handler
	{
		h = service.MakeHTTPHandler(s, log.With(logger, "component", "HTTP"))
	}

	errs := make(chan error)
	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, syscall.SIGINT, syscall.SIGTERM)
		errs <- fmt.Errorf("%s", <-c)
	}()

	go func() {
		logger.Log("transport", "HTTP", "addr", *httpAddr)
		fmt.Println("listening on port", *httpAddr)
		errs <- http.ListenAndServe(*httpAddr, h)
	}()

	logger.Log("exit", <-errs)
}
