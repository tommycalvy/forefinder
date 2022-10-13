package user

import (
	"context"
)

type User struct {
	Username 			string 	`json:"userid,omitempty"`
	Email 				string	`json:"email,omitempty"`
	Fullname 			string 	`json:"fullname,omitempty"`
	Dateofbirth 		string 	`json:"dateofbirth,omitempty"`
	Gender 				string 	`json:"gender,omitempty"`
}

type Repository interface {
	CreateUser(ctx context.Context, u User) error
	GetUserByUsername(ctx context.Context, username string) (User, error)
	GetUserByEmail(ctx context.Context, email string) (User, error)
}