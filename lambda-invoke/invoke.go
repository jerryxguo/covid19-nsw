package main

import (
	"errors"
	"fmt"
	"net/rpc"
	"time"

	"github.com/aws/aws-lambda-go/lambda/messages"
)

const functioninvokeRPC = "Function.Invoke"

//Run a Go based lambda, passing the configured payload
func Run(port int, payload []byte) ([]byte, error) {
	client, err := rpc.Dial("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return nil, err
	}
	request := createInvokeRequest(payload)
	var response messages.InvokeResponse
	if err = client.Call(functioninvokeRPC, request, &response); err != nil {
		return nil, err
	}
	if response.Error != nil {
		return nil, errors.New(response.Error.Message)
	}
	return response.Payload, nil
}

func createInvokeRequest(payloadEncoded []byte) *messages.InvokeRequest {
	t := time.Now()
	return &messages.InvokeRequest{
		Payload:      payloadEncoded,
		RequestId:    "0",
		XAmznTraceId: "",
		Deadline: messages.InvokeRequest_Timestamp{
			Seconds: int64(t.Unix()),
			Nanos:   int64(t.Nanosecond()),
		},
		InvokedFunctionArn:    "",
		CognitoIdentityId:     "",
		CognitoIdentityPoolId: "",
	}
}
