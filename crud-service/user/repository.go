package user

import (
	"context"
	"errors"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

var (
	ErrInvalidArgument 	= errors.New("invalid argument")
	ErrNotFound        	= errors.New("not found")
	ErrRepo 			= errors.New("unable to handle repo request")
)


type repo struct {
	Dynamo 			*dynamodb.Client
	TableName 		string
}

func NewProfileRepo(tableName string) Repository {
	cfg, err := config.LoadDefaultConfig(context.TODO(),
		// CHANGE THIS TO us-east-1 TO USE AWS proper
		config.WithRegion("localhost"),
		// Comment the below out if not using localhost
		config.WithEndpointResolver(aws.EndpointResolverFunc(
			func(service, region string) (aws.Endpoint, error) {
				return aws.Endpoint{URL: "http://localhost:8000", SigningRegion: "localhost"}, nil 
			})),
	)
    if err != nil {
        log.Printf("unable to load SDK config, %v", err)
    }

    // Using the Config value, create the DynamoDB client
    dynamo := dynamodb.NewFromConfig(cfg)

	return &repo{
		Dynamo:		dynamo,
		TableName:  tableName,
	}
}

func (r *repo) CreateUser(ctx context.Context, u User) error {
	
	input := &dynamodb.PutItemInput{
		TableName: aws.String(r.TableName),
		Item: map[string]types.AttributeValue {
			"ID": 			&types.AttributeValueMemberS{Value: "user|" + u.Username},
			"Metadata":		&types.AttributeValueMemberS{Value: "user|" + u.Username},
			"Email":		&types.AttributeValueMemberS{Value: u.Email},
			"Fullname": 	&types.AttributeValueMemberS{Value: u.Fullname},
			"Dateofbirth": 	&types.AttributeValueMemberN{Value: u.Dateofbirth},
			"Gender": 		&types.AttributeValueMemberN{Value: u.Gender},
		},
	}
	_, err := r.Dynamo.PutItem(ctx, input)
	if err != nil {
		log.Printf("Got error calling PutItem: %s", err)
		return ErrRepo
	}

	return nil
}


func (r *repo) GetUserByUsername(ctx context.Context, username string) (User, error) {
		result, err := r.Dynamo.GetItem(ctx, &dynamodb.GetItemInput{
			TableName: aws.String(r.TableName),
			Key: map[string]types.AttributeValue {
				"ID": 			&types.AttributeValueMemberS{Value: "user|" + username},
				"Metadata":		&types.AttributeValueMemberS{Value: "user|" + username},
			},
		})
		if err != nil {
			log.Printf("Got error calling GetItem: %s", err)
		}
	
		u := User{}
	
		if result.Item == nil {
			return u, ErrNotFound
		}
		
		err = attributevalue.UnmarshalMap(result.Item, &u)
		u.Username = username
		if err != nil {
			log.Printf("Failed to unmarshal Record, %v", err)
			return u, ErrRepo
		}
		
		return u, nil
}

func (r *repo) GetUserByEmail(ctx context.Context, email string) (User, error) {
	result, err := r.Dynamo.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(r.TableName),
		Key: map[string]types.AttributeValue {
			"ID": 			&types.AttributeValueMemberS{Value: "email|" + email},
			"Metadata":		&types.AttributeValueMemberS{Value: "email|" + email},
		},
	})
	if err != nil {
		log.Printf("Got error calling GetItem: %s", err)
	}

	u := User{}

	if result.Item == nil {
		return u, ErrNotFound
	}
		
	err = attributevalue.UnmarshalMap(result.Item, &u)
	if err != nil {
		log.Printf("Failed to unmarshal Record, %v", err)
		return u, ErrRepo
	}
	
	return u, nil
}

/*
func (r *repo) GetUserByFullname(ctx context.Context, fullname string) ([]User, error) {
	result, err := r.Dynamo.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String(r.TableName),
		Key: map[string]*dynamodb.AttributeValue{
			"ID": {
				S: aws.String("fullname|" + fullname),
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
*/