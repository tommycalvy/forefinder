package profile

import (
	"context"
)


type Profile struct {
	ID 					string  `json:"id,omitempty"`
	ProfileType			string 	`json:"profiletype,omitempty"`	
	FirstName 			string  `json:"firstname"`
	LastName 			string  `json:"lastname"`
	LastActive 			int64  	`json:"lastactive"`
	ProfileImage 		string  `json:"profileimage"`
	Status 				string  `json:"status"`
	ScoreRange			string  `json:"scorerange"`
	Age 				int		`json:"age"`	
	Bio 				string  `json:"bio"`
	PlayStyle 			string  `json:"playstyle"`
	Distance 			int 	`json:"distance"`
}



type Repository interface {
	CreateProfile(ctx context.Context, p Profile) error
	GetProfile(ctx context.Context, id string, profileType string) (Profile, error)
	UpdateProfile(ctx context.Context, p Profile) (Profile, error)
	DeleteProfile(ctx context.Context, id string, profileType string) error
	//SearchProfilesByDistance(ctx context.Context, lat float64, lon float64, meters int) ([]Profile, error)
}