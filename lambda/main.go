package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/pkg/errors"
)

var (
	DataURL = os.Getenv("DATA_URL")
)

type Post struct {
	ID      string `json:"resource_id"`
	Filters Filter `json:"filters"`
	Limit   int    `json:"limit"`
}

type Request struct {
	ID      string `json:"resource_id"`
	Fields  string `json:"fields"`
	Querys  Query  `json:"q"`
	Filters Filter `json:"filters"`
	Limit   int    `json:"limit"`
}

type Query struct {
	Postcode string `json:"postcode,omitempty"`
	Lga      string `json:"lga_name19,omitempty"`
}

type Filter struct {
	Postcode []string `json:"postcode,omitempty"`
	Lga      []string `json:"lga_name19,omitempty"`
}

type DBResponse struct {
	Result ResultStruct `json:"result"`
}

type ResultStruct struct {
	Records []Record `json:"records"`
}

type Record struct {
	Name     string `json:"lga_name19"`
	Date     string `json:"notification_date"`
	Postcode int    `json:"postcode"`
	Id       int    `json:"_id"`
}

func postRequest(url string, r Request) ([]byte, error) {
	client := &http.Client{}

	p := Post{
		ID:      r.ID,
		Filters: r.Filters,
		Limit:   r.Limit,
	}

	body, err := json.Marshal(p)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	req.Header.Add("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	data, err := ioutil.ReadAll(resp.Body)

	return data, err
}

func getRequest(url string, r Request) ([]byte, error) {
	client := &http.Client{}
	searchString := r.Querys.Lga
	if searchString == "" {
		searchString = r.Querys.Postcode
	}
	queryString := fmt.Sprintf("%s?resource_id=%s&q={\"%s\":\"%s\"}&fields=%s&sort=%s&plain=false&distinct=true", url, r.ID, r.Fields, searchString, r.Fields, r.Fields)
	//fmt.Printf("querystring: %s\n", queryString)
	req, err := http.NewRequest("GET", queryString, nil)
	if err != nil {
		return nil, err
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	data, err := ioutil.ReadAll(resp.Body)

	return data, err
}

func Handler(request Request) ([]Record, error) {

	var err error
	var response []byte
	url := "https://data.nsw.gov.au/data/api/3/action/datastore_search"

	if DataURL != "" {
		fmt.Printf("use env url: %s\n", DataURL)
		url = DataURL
	}

	if request.Filters.Lga == nil && request.Filters.Postcode == nil &&
		request.Fields != "" {
		response, err = getRequest(url, request)

	} else {

		response, err = postRequest(url, request)
	}
	if err != nil {
		return nil, errors.Wrap(err, "performance request")
	}
	//fmt.Println(string(response))
	var data = DBResponse{}
	if err := json.Unmarshal([]int{1, 2, 3}, &data); err != nil {
		return []Record{}, errors.Wrapf(err, "response=%s", string(response))
	}
	return data.Result.Records, nil
}

func main() {
	lambda.Start(Handler)
}
