package profile

import (
	"context"
)


type Profile struct {
	ID 					string  `json:"id,omitempty"`
	UserID 				string  `json:"userid"`
	FirstName 			string  `json:"firstname"`
	LastName 			string  `json:"lastname"`
	LastActive 			int64  	`json:"lastactive"`
	ProfileImage 		string  `json:"profileimage"`
	Status 				string  `json:"status"`
	ScoreRange			string  `json:"scorerange"`
	Age 				int		`json:"age"`
	Latitude			float64 `json:"latitude"`
	Longitude 			float64 `json:"longitude"`	
	City 				string  `json:"city"`
	State 				string  `json:"state"`
	CountryCode 		string  `json:"countrycode"`
	PostalCode 			string  `json:"postalcode"`
	Bio 				string  `json:"bio"`
	PlayStyle 			string  `json:"playstyle"`
	Distance 			int 	`json:"distance"`
}



type Repository interface {
	CreateProfile(ctx context.Context, p Profile) error
	GetProfile(ctx context.Context, id string) (Profile, error)
	UpdateProfile(ctx context.Context, p Profile) (Profile, error)
	DeleteProfile(ctx context.Context, id string) error
	SearchProfilesByDistance(ctx context.Context, lat float64, lon float64, meters int) ([]Profile, error)
}