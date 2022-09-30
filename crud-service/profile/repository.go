package profile

import (
	"context"
	"errors"
	"log"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
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
	
func (r *repo) GetProfile(ctx context.Context, id string, profileType string) (Profile, error) {
	result, err := r.Dynamo.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String(r.TableName),
		Key: map[string]*dynamodb.AttributeValue{
			"ID": {
				S: aws.String(id),
			},
			"Metadata": {
				S: aws.String(profileType),
			},
		},
	})
	if err != nil {
		log.Printf("Got error calling GetItem: %s", err)
	}

	p := Profile{}

	if result.Item == nil {
		return p, ErrNotFound
	}
		
	err = dynamodbattribute.UnmarshalMap(result.Item, &p)
	if err != nil {
		log.Printf("Failed to unmarshal Record, %v", err)
		return p, ErrRepo
	}
	
	return p, nil
}
	
func (r *repo) UpdateProfile(ctx context.Context, newP Profile) (Profile, error) {
	p := Profile{}
	expr, err := expression.NewBuilder().WithUpdate(
		expression.Set(
			expression.Name("FirstName"),
			expression.Value(newP.FirstName),
		),
	).Build()
	if err != nil {
		log.Printf("Failed to build expression, %v", err)
        return p, ErrRepo
    }

	input := &dynamodb.UpdateItemInput{
		
		TableName: aws.String(r.TableName),
		Key: map[string]*dynamodb.AttributeValue{
			"ID": {
				S: aws.String(newP.ID),
			},
			"Metadata": {
				S: aws.String(newP.ProfileType),
			},
		},
		ExpressionAttributeNames: expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		UpdateExpression: expr.Update(),
		ReturnValues:     aws.String("ALL_NEW"),
		
	}
	
	out, err := r.Dynamo.UpdateItem(input)
	if err != nil {
		log.Printf("Got error calling UpdateItem: %s", err)
		return p, ErrRepo
	}
	err = dynamodbattribute.UnmarshalMap(out.Attributes, &p)
	if err != nil {
		log.Printf("Failed to unmarshal Record, %v", err)
		return p, ErrRepo
	}

	return p, nil
}
	
func (r *repo) DeleteProfile(ctx context.Context, id string, profileType string) error {
	
	input := &dynamodb.DeleteItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"ID": {
				N: aws.String(id),
			},
			"Metadata": {
				S: aws.String(profileType),
			},
		},
		TableName: aws.String(r.TableName),
	}
	
	_, err := r.Dynamo.DeleteItem(input)
	if err != nil {
		log.Printf("Got error calling DeleteItem: %s", err)
		return ErrRepo
	}

	return nil
}

/*

func (r *repo) SearchProfilesByDistance(ctx context.Context, lat float64, lon float64, meters int) ([]Profile, error) {
	

	return profiles, nil
}

*/