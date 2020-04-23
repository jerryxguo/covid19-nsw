//go:generate bash build.sh

package main

import (
	_ "expvar"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"path"
	"syscall"
)

// Version is app's version. it will be overridden by compile flag if the flag is set to the compiler. otherwise, this version value is used.
var Version = `0.0.1`

// Defining this interface locally removes dependencies on other packages. (See Dave Cheney's blogs.)
type Logger interface {
	Print(...interface{})
	Printf(string, ...interface{})
}

func main() {
	programName := path.Base(os.Args[0])
	portFlag := flag.Int("port", 3000, "listen port number")
	lambdaFlag := flag.Int("lambda", 8000, "lambda port number")
	flag.Usage = func() {
		fmt.Fprintf(flag.CommandLine.Output(), "Usage: %s [options]\n", programName)
		fmt.Fprintf(flag.CommandLine.Output(), "       %s -version\nOptions:\n", programName)
		flag.PrintDefaults()
	}
	flag.Parse()

	logger := log.New(os.Stderr, programName+": ", 0)

	signalled := make(chan os.Signal, 1)
	signal.Notify(signalled, os.Interrupt)
	signal.Notify(signalled, os.Kill)
	signal.Notify(signalled, syscall.SIGTERM)

	api := NewHTTPServer(fmt.Sprintf("0.0.0.0:%d", *portFlag), NewHTTPHandler(*lambdaFlag, logger), logger)
	defer api.Close()

	s := <-signalled

	logger.Printf("Received %s signal. Quitting...\n", s)
	os.Exit(0)
}
