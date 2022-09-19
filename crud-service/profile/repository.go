package profile

import (
	"context"
	"errors"
	"log"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/jackc/pgx/v4/pgxpool"
)

var (
	ErrInvalidArgument 	= errors.New("invalid argument")
	ErrNotFound        	= errors.New("not found")
	ErrRepo 			= errors.New("unable to handle repo request")
)


type repo struct {
	Dynamo 			*dynamodb.DynamoDB
	TableName 		string
}

func NewProfileRepo(dbpool *pgxpool.Pool, tableName string) Repository {
	// Initialize a session that the SDK will use to load
	// credentials from the shared credentials file ~/.aws/credentials
	// and region from the shared configuration file ~/.aws/config.
	sess := session.Must(session.NewSessionWithOptions(session.Options{
    	SharedConfigState: session.SharedConfigEnable,
	}))

	// Create DynamoDB client
	dynamo := dynamodb.New(sess)

	return &repo{
		Dynamo:		dynamo,
		TableName:  tableName,
	}
}

func (r *repo) CreateProfile(ctx context.Context, p Profile) error {
	av, err := dynamodbattribute.MarshalMap(p)
	if err != nil {
		log.Printf("Got error marshalling new profile item: %s", err)
		return ErrRepo
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(r.TableName),
	}
	_, err = r.Dynamo.PutItem(input)
	if err != nil {
		log.Printf("Got error calling PutItem: %s", err)
		return ErrRepo
	}

	return nil
}
	
func (r *repo) GetProfile(ctx context.Context, id string) (Profile, error) {
	
	return p, nil
}
	
func (r *repo) UpdateProfile(ctx context.Context, newP Profile) (Profile, error) {
		
	return p, nil

}
	
func (r *repo) DeleteProfile(ctx context.Context, id string) error {
	
	return nil
}

func (r *repo) SearchProfilesByDistance(ctx context.Context, lat float64, lon float64, meters int) ([]Profile, error) {
	

	return profiles, nil
}