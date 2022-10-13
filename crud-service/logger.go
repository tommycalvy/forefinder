package service

import (
	"context"
	"time"

	"github.com/go-kit/kit/log"
	"github.com/tommycalvy/forefinder/crud-service/profile"
	"github.com/tommycalvy/forefinder/crud-service/user"
)

type loggingService struct {
	logger log.Logger
	Service
}

// NewLoggingService returns a new instance of a logging Service.
func NewLoggingService(logger log.Logger, s Service) Service {
	return &loggingService{logger, s}
}

func (s *loggingService) CreateUser(ctx context.Context, u user.User) (err error) {
	defer func(begin time.Time) {
		s.logger.Log("method", "CreateUser", "username", u.Username, "took", time.Since(begin), "err", err)
	}(time.Now())
	return s.Service.CreateUser(ctx, u)
}

func (s *loggingService) GetUserByUsername(ctx context.Context, username string) (u user.User, err error) {
	defer func(begin time.Time) {
		s.logger.Log("method", "GetUserByUsername", "username", username, "took", time.Since(begin), "err", err)
	}(time.Now())
	return s.Service.GetUserByUsername(ctx, username)
}

func (s *loggingService) GetUserByEmail(ctx context.Context, email string) (u user.User, err error) {
	defer func(begin time.Time) {
		s.logger.Log("method", "GetUserByUsername", "email", email, "took", time.Since(begin), "err", err)
	}(time.Now())
	return s.Service.GetUserByEmail(ctx, email)
}

func (s *loggingService) CreateProfile(ctx context.Context, newP profile.Profile) (p profile.Profile, err error) {
	defer func(begin time.Time) {
		s.logger.Log("method", "CreateProfile", "id", p.ID, "took", time.Since(begin), "err", err)
	}(time.Now())
	return s.Service.CreateProfile(ctx, newP)
}

func (s *loggingService) GetProfile(ctx context.Context, id string, profileType string) (p profile.Profile, err error) {
	defer func(begin time.Time) {
		s.logger.Log("method", "GetProfile", "id", p.ID, "took", time.Since(begin), "err", err)
	}(time.Now())
	return s.Service.GetProfile(ctx, id, profileType)
}

func (s *loggingService) UpdateProfile(ctx context.Context, newP profile.Profile) (p profile.Profile, err error) {
	defer func(begin time.Time) {
		s.logger.Log("method", "UpdateProfile", "id", p.ID, "took", time.Since(begin), "err", err)
	}(time.Now())
	return s.Service.UpdateProfile(ctx, newP)
}

func (s *loggingService) DeleteProfile(ctx context.Context, id string, profileType string) (err error) {
	defer func(begin time.Time) {
		s.logger.Log("method", "DeleteProfile", "id", id, "took", time.Since(begin), "err", err)
	}(time.Now())
	return s.Service.DeleteProfile(ctx, id, profileType)
}

/*
func (s *loggingService) SearchProfilesByDistance(ctx context.Context, countryCode string, postalCode string, miles int) (p []profile.Profile, err error) {
	defer func(begin time.Time) {
		s.logger.Log("method", "SearchProfilesByDistance", "countryCode", countryCode, "postalCode", postalCode, "miles", miles, "took", time.Since(begin), "err", err)
	}(time.Now())
	return s.Service.SearchProfilesByDistance(ctx, countryCode, postalCode, miles)
}
*/