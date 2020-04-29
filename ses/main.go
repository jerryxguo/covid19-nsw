package main

import (
	"fmt"
	"os"

	//go get -u github.com/aws/aws-sdk-go
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/pkg/errors"
)

const (
	// The character encoding for the email.
	CharSet = "UTF-8"
)

type Request struct {
	Sender    string `json:"sender"`
	LastName  string `json:"lastName"`
	FirstName string `json:"fristName"`
	Subject   string `json:"subject"`
	Body      string `json:"body"`
}

var (
	Recipient = os.Getenv("RECIPIENT")
	Region    = os.Getenv("REGION")
)

func Handler(request Request) error {
	recipient := ""
	region := "ap-southeast-2"

	if Recipient != "" {
		fmt.Printf("env Recipient: %s\n", Recipient)
		recipient = Recipient
	}
	if recipient == "" {
		return errors.New("no recipient")
	}
	if Region != "" {
		fmt.Printf("env Region: %s\n", Region)
		region = Region
	}
	// Create a new session in the us-west-2 region.
	// Replace us-west-2 with the AWS Region you're using for Amazon SES.
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(region)},
	)

	// Create an SES session.
	svc := ses.New(sess)

	// Assemble the email.
	input := &ses.SendEmailInput{
		Destination: &ses.Destination{
			CcAddresses: []*string{},
			ToAddresses: []*string{
				aws.String(Recipient),
			},
		},
		Message: &ses.Message{
			Body: &ses.Body{
				Html: &ses.Content{
					Charset: aws.String(CharSet),
					Data:    aws.String("From:" + request.Sender + "\n\n" + request.Body),
				},
				Text: &ses.Content{
					Charset: aws.String(CharSet),
					Data:    aws.String("From:" + request.Sender + "\n\n" + request.Body),
				},
			},
			Subject: &ses.Content{
				Charset: aws.String(CharSet),
				Data:    aws.String(request.Subject),
			},
		},
		Source: aws.String(Recipient),
		// Uncomment to use a configuration set
		//ConfigurationSetName: aws.String(ConfigurationSet),
	}

	// Attempt to send the email.
	result, err := svc.SendEmail(input)

	// Display error messages if they occur.
	if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			switch aerr.Code() {
			case ses.ErrCodeMessageRejected:
				fmt.Println(ses.ErrCodeMessageRejected, aerr.Error())
			case ses.ErrCodeMailFromDomainNotVerifiedException:
				fmt.Println(ses.ErrCodeMailFromDomainNotVerifiedException, aerr.Error())
			case ses.ErrCodeConfigurationSetDoesNotExistException:
				fmt.Println(ses.ErrCodeConfigurationSetDoesNotExistException, aerr.Error())
			default:
				fmt.Println(aerr.Error())
			}
		} else {
			// Print the error, cast err to awserr.Error to get the Code and
			// Message from an error.
			fmt.Println(err.Error())
		}
	}
	fmt.Println(result)
	return err
}

func main() {
	lambda.Start(Handler)
}
