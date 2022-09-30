package service

import (
	"context"

	"github.com/go-kit/kit/endpoint"
	"github.com/tommycalvy/forefinder/crud-service/profile"
)

type Endpoints struct {
	CreateProfileEndpoint 				endpoint.Endpoint 
	GetProfileEndpoint 					endpoint.Endpoint
	UpdateProfileEndpoint 				endpoint.Endpoint
	DeleteProfileEndpoint 				endpoint.Endpoint
	//SearchProfilesByDistanceEndpoint 	endpoint.Endpoint
}

func MakeEndpoints(s Service) Endpoints {
	return Endpoints {
		CreateProfileEndpoint: 				MakeCreateProfileEndpoint(s),
		GetProfileEndpoint: 				MakeGetProfileEndpoint(s),
		UpdateProfileEndpoint: 				MakeUpdateProfileEndpoint(s),
		DeleteProfileEndpoint: 				MakeDeleteProfileEndpoint(s),
		//SearchProfilesByDistanceEndpoint: 	MakeSearchProfilesByDistanceEndpoint(s),
	}
}

func MakeCreateProfileEndpoint(s Service) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (response interface{}, err error) {
		req := request.(createProfileRequest)
		p, e := s.CreateProfile(ctx, req.Profile)
		return createProfileResponse{Profile: p, Err: e}, nil
	}
}

func MakeGetProfileEndpoint(s Service) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (response interface{}, err error) {
		req := request.(getProfileRequest)
		p, e := s.GetProfile(ctx, req.ID, req.ProfileType)
		return getProfileResponse{Profile: p, Err: e}, nil
	}
}

func MakeUpdateProfileEndpoint(s Service) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (response interface{}, err error) {
		req := request.(updateProfileRequest)
		p, e := s.UpdateProfile(ctx, req.Profile)
		return updateProfileResponse{Profile: p, Err: e}, nil
	}
}

func MakeDeleteProfileEndpoint(s Service) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (response interface{}, err error) {
		req := request.(deleteProfileRequest)
		e := s.DeleteProfile(ctx, req.ID, req.ProfileType)
		return deleteProfileResponse{Err: e}, nil
	}
}

/*
func MakeSearchProfilesByDistanceEndpoint(s Service) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (response interface{}, err error) {
		req := request.(searchProfilesByDistanceRequest)
		profiles, e := s.SearchProfilesByDistance(ctx, req.CountryCode, req.PostalCode, req.Miles)
		return searchProfilesByDistanceResponse{Profiles: profiles, Err: e}, nil
	}
}
*/

type (
	createProfileRequest struct {
		Profile 			profile.Profile			
	}
	createProfileResponse struct {
		Profile 			profile.Profile 		`json:"profile,omitempty"`
		Err 				error 					`json:"err,omitempty"`
	}
	getProfileRequest struct {
		ID 					string 
		ProfileType 		string
	}
	getProfileResponse struct {
		Profile 			profile.Profile 		`json:"profile,omitempty"`
		Err 				error 					`json:"err,omitempty"`
	}
	updateProfileRequest struct {
		Profile 			profile.Profile
	}
	updateProfileResponse struct {
		Profile 			profile.Profile 		`json:"profile,omitempty"`
		Err 				error 					`json:"err,omitempty"`
	}
	deleteProfileRequest struct {
		ID 					string
		ProfileType 		string
	}
	deleteProfileResponse struct {
		Err 				error 					`json:"err,omitempty"`
	}

	/*
	searchProfilesByDistanceRequest struct {
		CountryCode 		string
		PostalCode 			string
		Miles 				int
	}
	searchProfilesByDistanceResponse struct {
		Profiles 			[]profile.Profile 		`json:"profiles,omitempty"`
		Err 				error					`json:"err,omitempty"`
	}
	*/
)