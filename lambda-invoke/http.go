package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/pkg/errors"
)

const (
	ContentEncoding = "Content-Encoding"
	ContentType     = "Content-Type"
	ContentLength   = "Content-Length"
	GzipEncoding    = "gzip"
	ApplicationJSON = "application/json"
)

type HTTPServer struct {
	*http.Server
	log  Logger
	done chan struct{}
}

// NewHTTPServer returns an HTTP server with a simple Close method for shutting it down.
func NewHTTPServer(address string, handler http.Handler, logger Logger) *HTTPServer {
	srv := HTTPServer{}
	srv.Server = &http.Server{Addr: address, Handler: handler}
	srv.log = logger
	srv.done = make(chan struct{})

	go func() {
		srv.log.Print("HTTP listening on port ", srv.Addr)
		if err := srv.ListenAndServe(); err != nil {
			srv.log.Print(err)
		}
		close(srv.done)
	}()

	return &srv
}

// Close performs a graceful shutdown of the HTTPServer.
func (h *HTTPServer) Close() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	if e := h.Server.Shutdown(ctx); e != nil {
		h.log.Print(errors.Wrap(e, "server.Shutdown"))
	}
	// Keep go vet happy by calling cancel.
	cancel()
	<-h.done
}

// An HTTPHandler responds to Honcho HTTP requests.
type HTTPHandler struct {
	port int
	log  Logger
}

// NewHTTPHandler returns a new instance of a sample.HTTPHandler.
func NewHTTPHandler(port int, logger Logger) *HTTPHandler {

	return &HTTPHandler{port: port, log: logger}
}

func (h *HTTPHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	invalidMethod := func() {
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		jsonError(w, http.StatusMethodNotAllowed, errors.New("invalid method or url"))
	}
	switch r.URL.Path {
	case "/api":
		if r.Method == http.MethodPost {
			if payload, err := ioutil.ReadAll(r.Body); err == nil {
				//h.log.Printf("payload: %s\n", string(payload))
				response, err := Run(h.port, payload)
				//h.log.Printf("response: %s\n", string(response))
				if err == nil {
					jsonResponse(w, http.StatusOK, string(response))
				} else {
					jsonError(w, http.StatusInternalServerError, err)
				}
			} else {
				jsonError(w, http.StatusBadRequest, err)
			}
		} else {
			w.Header().Set("Allow", http.MethodGet+", "+http.MethodPost+", "+http.MethodOptions)
			invalidMethod()
		}
	default:
		w.Header().Set("Allow", http.MethodOptions)
		invalidMethod()
	}
}

// jsonError sets an HTTP error response formatted as JSON.
func jsonError(w http.ResponseWriter, code int, err error) {
	jsonResponse(w, code, fmt.Sprintf("{\"reason\":%q}\n", err.Error()))
}

// jsonResponse sets an HTTP response message with content type set to ApplicationJSON.
func jsonResponse(w http.ResponseWriter, code int, msg string) {
	w.Header().Set(ContentType, ApplicationJSON)
	w.Header().Set(ContentLength, fmt.Sprint(len(msg)))
	w.WriteHeader(code)
	w.Write([]byte(msg))
}
