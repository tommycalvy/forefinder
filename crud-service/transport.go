package service

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-kit/kit/transport"
	httptransport "github.com/go-kit/kit/transport/http"
	"github.com/go-kit/log"
	"github.com/gorilla/mux"

	"github.com/tommycalvy/forefinder/crud-service/profile"
)

var (
	// ErrBadRouting is returned when an expected path variable is missing.
	// It always indicates programmer error.
	ErrBadRouting = errors.New("inconsistent mapping between route and handler (programmer error)")
)

func MakeHTTPHandler(s Service, logger log.Logger) http.Handler {
	r := mux.NewRouter()
	e := MakeEndpoints(s)
	options := []httptransport.ServerOption{
		httptransport.ServerErrorHandler(transport.NewLogErrorHandler(logger)),
		httptransport.ServerErrorEncoder(encodeError),
	}

	// POST 	/users/v0/ 								adds another user

	// POST 	/profiles/v0/							adds another Profile
	// GET 		/profiles/v0/:id/:pType 				gets a Profile from id
	// PUT 		/profiles/v0 							updates a profile 
	// DELETE 	/profiles/v0/:id/:pType					deletes a profile
	// GET 		/profiles/v0/distance/:cc/:pc/:miles	finds profiles within a certain mile radius around a lat, lon
	
	
	r.Methods("POST").Path("/users/v0/").Handler(httptransport.NewServer(
		e.CreateUserEndpoint,
		decodeCreateUserRequest,
		encodeResponse,
		options...,
	))

	r.Methods("POST").Path("/profiles/v0/").Handler(httptransport.NewServer(
		e.CreateProfileEndpoint,
		decodeCreateProfileRequest,
		encodeResponse,
		options...,
	))
	r.Methods("GET").Path("/profiles/v0/{id}/{pType}").Handler(httptransport.NewServer(
		e.GetProfileEndpoint,
		decodeGetProfileRequest,
		encodeResponse,
		options...,
	))
	r.Methods("PUT").Path("/profiles/v0/").Handler(httptransport.NewServer(
		e.UpdateProfileEndpoint,
		decodeUpdateProfileRequest,
		encodeResponse,
		options...,
	))
	r.Methods("DELETE").Path("/profiles/v0/{id}/{pType}").Handler(httptransport.NewServer(
		e.DeleteProfileEndpoint,
		decodeDeleteProfileRequest,
		encodeResponse,
		options...,
	))
	/*
	r.Methods("GET").Path("/profiles/v0/distance/{cc}/{pc}/{miles}").Handler(httptransport.NewServer(
		e.SearchProfilesByDistanceEndpoint,
		decodeSearchProfilesByDistanceRequest,
		encodeResponse,
		options...,
	))
	*/

	return r 

}

func decodeCreateUserRequest(_ context.Context, r *http.Request) (request interface{}, err error) {
	var req createUserRequest
	if e := json.NewDecoder(r.Body).Decode(&req); e != nil {
		return nil, e
	}
	return req, nil
}

func decodeCreateProfileRequest(_ context.Context, r *http.Request) (request interface{}, err error) {
	var req createProfileRequest
	if e := json.NewDecoder(r.Body).Decode(&req); e != nil {
		return nil, e
	}
	return req, nil
}

func decodeGetProfileRequest(_ context.Context, r *http.Request) (request interface{}, err error) {
	vars := mux.Vars(r)
	id, ok := vars["id"]
	if !ok {
		return nil, ErrBadRouting
	}
	pType, ok := vars["pType"]
	if !ok {
		return nil, ErrBadRouting
	}
	return getProfileRequest{ID: id, ProfileType: pType}, nil
}

func decodeUpdateProfileRequest(_ context.Context, r *http.Request) (request interface{}, err error) {
	var req updateProfileRequest
	if e := json.NewDecoder(r.Body).Decode(&req); e != nil {
		return nil, e
	}
	return req, nil
}

func decodeDeleteProfileRequest(_ context.Context, r *http.Request) (request interface{}, err error) {
	vars := mux.Vars(r)
	id, ok := vars["id"]
	if !ok {
		return nil, ErrBadRouting
	}
	pType, ok := vars["pType"]
	if !ok {
		return nil, ErrBadRouting
	}
	return deleteProfileRequest{ID: id, ProfileType: pType}, nil
}

/*
func decodeSearchProfilesByDistanceRequest(_ context.Context, r *http.Request) (request interface{}, err error) {
	vars := mux.Vars(r)
	cc, ok := vars["cc"]
	if !ok {
		return nil, ErrBadRouting
	}

	pc, ok := vars["pc"]
	if !ok {
		return nil, ErrBadRouting
	}

	milesString, ok := vars["miles"]
	if !ok {
		return nil, ErrBadRouting
	}
	miles, err := strconv.Atoi(milesString)
	if err != nil {
		return nil, err
	}
	return searchProfilesByDistanceRequest{CountryCode: cc, PostalCode: pc, Miles: miles}, nil
}
*/

// errorer is implemented by all concrete response types that may contain
// errors. It allows us to change the HTTP response code without needing to
// trigger an endpoint (transport-level) error. For more information, read the
// big comment in endpoints.go. -comment from profilesvc/transport.go example
type errorer interface {
	error() error
}

// encodeResponse is the common method to encode all response types to the
// client. I chose to do it this way because, since we're using JSON, there's no
// reason to provide anything more specific. It's certainly possible to
// specialize on a per-response (per-method) basis. -comment from profilesvc/transport.go example
func encodeResponse(ctx context.Context, w http.ResponseWriter, response interface{}) error {
	if e, ok := response.(errorer); ok && e.error() != nil {
		// Not a Go kit transport error, but a business-logic error.
		// Provide those as HTTP errors.
		encodeError(ctx, e.error(), w)
		return nil
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	return json.NewEncoder(w).Encode(response)
}

func encodeError(_ context.Context, err error, w http.ResponseWriter) {
	if err == nil {
		panic("encodeError with nil error")
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(codeFrom(err))
	json.NewEncoder(w).Encode(map[string]interface{}{
		"error": err.Error(),
	})
}

func codeFrom(err error) int {
	switch err {
	case profile.ErrNotFound:
		return http.StatusNotFound
	case profile.ErrInvalidArgument:
		return http.StatusBadRequest
	default:
		return http.StatusInternalServerError
	}
}