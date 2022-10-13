package service

import (
	"context"

	"github.com/go-kit/kit/endpoint"
	"github.com/tommycalvy/forefinder/crud-service/profile"
	"github.com/tommycalvy/forefinder/crud-service/user"
)

type Endpoints struct {
	CreateUserEndpoint 					endpoint.Endpoint
	GetUserByUsernameEndpoint 			endpoint.Endpoint
	GetUserByEmailEndpoint 				endpoint.Endpoint
	CreateProfileEndpoint 				endpoint.Endpoint 
	GetProfileEndpoint 					endpoint.Endpoint
	UpdateProfileEndpoint 				endpoint.Endpoint
	DeleteProfileEndpoint 				endpoint.Endpoint
	//SearchProfilesByDistanceEndpoint 	endpoint.Endpoint
}

func MakeEndpoints(s Service) Endpoints {
	return Endpoints {
		CreateUserEndpoint: 				MakeCreateUserEndpoint(s),
		GetUserByUsernameEndpoint: 			MakeGetUserByUsernameEndpoint(s),
		GetUserByEmailEndpoint:		 		MakeGetUserByEmailEndpoint(s),			
		CreateProfileEndpoint: 				MakeCreateProfileEndpoint(s),
		GetProfileEndpoint: 				MakeGetProfileEndpoint(s),
		UpdateProfileEndpoint: 				MakeUpdateProfileEndpoint(s),
		DeleteProfileEndpoint: 				MakeDeleteProfileEndpoint(s),
		//SearchProfilesByDistanceEndpoint: 	MakeSearchProfilesByDistanceEndpoint(s),
	}
}

func MakeCreateUserEndpoint(s Service) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (response interface{}, err error) {
		req := request.(createUserRequest)
		e := s.CreateUser(ctx, req.User)
		return createUserResponse{Err: e}, nil
	}
}

func MakeGetUserByUsernameEndpoint(s Service) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (response interface{}, err error) {
		req := request.(getUserByUsernameRequest)
		u, e := s.GetUserByUsername(ctx, req.Username)
		return getUserResponse{User: u, Err: e}, nil
	}
}

func MakeGetUserByEmailEndpoint(s Service) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (response interface{}, err error) {
		req := request.(getUserByEmailRequest)
		u, e := s.GetUserByEmail(ctx, req.Email)
		return getUserResponse{User: u, Err: e}, nil
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
	createUserRequest struct {
		User 				user.User 				
	}
	createUserResponse struct {
		Err 				error					`json:"error,omitempty"`
	}
	getUserByUsernameRequest struct {
		Username 			string
	}
	getUserByEmailRequest struct {
		Email 				string
	}
	getUserResponse struct {
		User 				user.User 				`json:"user,omitempty"`
		Err 				error					`json:"error,omitempty"`
	}
	createProfileRequest struct {
		Profile 			profile.Profile			
	}
	createProfileResponse struct {
		Profile 			profile.Profile 		`json:"profile,omitempty"`
		Err 				error 					`json:"error,omitempty"`
	}
	getProfileRequest struct {
		ID 					string 
		ProfileType 		string
	}
	getProfileResponse struct {
		Profile 			profile.Profile 		`json:"profile,omitempty"`
		Err 				error 					`json:"error,omitempty"`
	}
	updateProfileRequest struct {
		Profile 			profile.Profile
	}
	updateProfileResponse struct {
		Profile 			profile.Profile 		`json:"profile,omitempty"`
		Err 				error 					`json:"error,omitempty"`
	}
	deleteProfileRequest struct {
		ID 					string
		ProfileType 		string
	}
	deleteProfileResponse struct {
		Err 				error 					`json:"error,omitempty"`
	}

	/*
	searchProfilesByDistanceRequest struct {
		CountryCode 		string
		PostalCode 			string
		Miles 				int
	}
	searchProfilesByDistanceResponse struct {
		Profiles 			[]profile.Profile 		`json:"profiles,omitempty"`
		Err 				error					`json:"error,omitempty"`
	}
	*/
)