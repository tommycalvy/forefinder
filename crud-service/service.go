package service

import (
	"context"

	"github.com/tommycalvy/forefinder/crud-service/profile"
	"github.com/tommycalvy/forefinder/crud-service/user"
)

type Service interface {
	CreateUser(ctx context.Context, u user.User) error
	GetUserByUsername(ctx context.Context, username string) (user.User, error)
	GetUserByEmail(ctx context.Context, email string) (user.User, error)
	CreateProfile(ctx context.Context, p profile.Profile) (profile.Profile, error)
	GetProfile(ctx context.Context, id string, profileType string) (profile.Profile, error)
	UpdateProfile(ctx context.Context, p profile.Profile) (profile.Profile, error)
	DeleteProfile(ctx context.Context, id string, profileType string) error
	//SearchProfilesByDistance(ctx context.Context, lat float64, lon float64, miles int) ([]profile.Profile, error)

	CreatePost(ctx context.Context, p )
}

type service struct {
	users 				user.Repository
	profiles 			profile.Repository
}

func NewService(users user.Repository, profiles profile.Repository) Service {
	return &service {
		users: users,
		profiles: profiles,
	}
}
func (s *service) CreateUser(ctx context.Context, u user.User) error {
	if err := s.users.CreateUser(ctx, u); err != nil {
		return err
	}
	return nil
}

func (s *service) GetUserByUsername(ctx context.Context, username string) (user.User, error) {
	u, err := s.users.GetUserByUsername(ctx, username)
	if err != nil {
		return user.User{}, err
	}
	return u, nil
}

func (s *service) GetUserByEmail(ctx context.Context, email string) (user.User, error) {
	u, err := s.users.GetUserByEmail(ctx, email)
	if err != nil {
		return user.User{}, err
	}
	return u, nil
}

func (s *service) CreateProfile(ctx context.Context, p profile.Profile) (profile.Profile, error) {
	if err := s.profiles.CreateProfile(ctx, p); err != nil {
		return profile.Profile{}, err
	}
	return p, nil
}
func (s *service) GetProfile(ctx context.Context, id string, profileType string) (profile.Profile, error) {
	p, err := s.profiles.GetProfile(ctx, id, profileType)
	
	if err != nil {
		return profile.Profile{}, err
	}
	return p, nil
}
func (s *service) UpdateProfile(ctx context.Context, newP profile.Profile) (profile.Profile, error) {
	p, err := s.profiles.UpdateProfile(ctx, newP)
	if err != nil {
		return profile.Profile{}, err
	}
	return p, nil
}
func (s *service) DeleteProfile(ctx context.Context, id string, profileType string) error {
	if err := s.profiles.DeleteProfile(ctx, id, profileType); err != nil {
		return err
	}
	return nil
}
/*
func (s *service) SearchProfilesByDistance(ctx context.Context, lat float64, lon float64, miles int) ([]profile.Profile, error) {

	milesToMeters := 1609.344
	meters := float64(miles) * milesToMeters

	profiles, err := s.profiles.SearchProfilesByDistance(ctx, lat, lon, int(meters))
	if err != nil {
		return profiles, err
	}
	return profiles, nil
}
*/