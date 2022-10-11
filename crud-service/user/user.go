package user

import (
	"context"
)

type User struct {
	userID 				string `json:"userid,omitempty"`
	fullName 			string `json:"fullname,omitempty"`
}

type Repository interface {
	CreateUser(ctx context.Context, u User) error
	GetUser(ctx context.Context, userID string) (User, error)
}