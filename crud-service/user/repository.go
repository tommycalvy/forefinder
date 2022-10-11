package user

import (
	"context"
	"errors"
	"log"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
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

func NewProfileRepo(tableName string) Repository {
	// Initialize a session that the SDK will use to load
	// credentials from the shared credentials file ~/.aws/credentials
	// and region from the shared configuration file ~/.aws/config.
	sess := session.Must(session.NewSessionWithOptions(session.Options{
    	Config: aws.Config {
			Endpoint: aws.String("http://localhost:8000"),
		},
	}))

	// Create DynamoDB client
	dynamo := dynamodb.New(sess)

	return &repo{
		Dynamo:		dynamo,
		TableName:  tableName,
	}
}

func (r *repo) CreateUser(ctx context.Context, u User) error {
	av, err := dynamodbattribute.MarshalMap(u)
	if err != nil {
		log.Printf("Got error marshalling new user item: %s", err)
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

func (r *repo) GetUser(ctx context.Context, userID string) (User, error) {
		result, err := r.Dynamo.GetItem(&dynamodb.GetItemInput{
			TableName: aws.String(r.TableName),
			Key: map[string]*dynamodb.AttributeValue{
				"ID": {
					S: aws.String("user|" + userID),
				},
				"Metadata": {
					S: aws.String("user|" + userID),
				},
			},
		})
		if err != nil {
			log.Printf("Got error calling GetItem: %s", err)
		}
	
		u := User{}
	
		if result.Item == nil {
			return u, ErrNotFound
		}
			
		err = dynamodbattribute.UnmarshalMap(result.Item, &u)
		if err != nil {
			log.Printf("Failed to unmarshal Record, %v", err)
			return u, ErrRepo
		}
		
		return u, nil
}