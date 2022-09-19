package service

import (
	"context"

	"github.com/tommycalvy/forefinder/crud-service/profile"
)

type Service interface {
	CreateProfile(ctx context.Context, p profile.Profile) (profile.Profile, error)
	GetProfile(ctx context.Context, id string) (profile.Profile, error)
	UpdateProfile(ctx context.Context, p profile.Profile) (profile.Profile, error)
	DeleteProfile(ctx context.Context, id string) error
	SearchProfilesByDistance(ctx context.Context, lat float64, lon float64, miles int) ([]profile.Profile, error)
}

type service struct {
	profiles 			profile.Repository
}

func NewService(profiles profile.Repository) Service {
	return &service {
		profiles: profiles,
	}
}

func (s *service) CreateProfile(ctx context.Context, p profile.Profile) (profile.Profile, error) {
	if err := s.profiles.CreateProfile(ctx, p); err != nil {
		return profile.Profile{}, err
	}
	return p, nil
}
func (s *service) GetProfile(ctx context.Context, id string) (profile.Profile, error) {
	p, err := s.profiles.GetProfile(ctx, id)
	
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
func (s *service) DeleteProfile(ctx context.Context, id string) error {
	if err := s.profiles.DeleteProfile(ctx, id); err != nil {
		return err
	}
	return nil
}
func (s *service) SearchProfilesByDistance(ctx context.Context, lat float64, lon float64, miles int) ([]profile.Profile, error) {

	milesToMeters := 1609.344
	meters := float64(miles) * milesToMeters

	profiles, err := s.profiles.SearchProfilesByDistance(ctx, lat, lon, int(meters))
	if err != nil {
		return profiles, err
	}
	return profiles, nil
}