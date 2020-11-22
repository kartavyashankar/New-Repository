var request = require('request');

// Access Parameters (Need to be changed every 14 days)
var endpoint = '5f7b9d68.compilers.sphere-engine.com';
var accessToken = '18d67ae37ef25dcb576ade7d6e9ebf03';


function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function fetchOutput(submission_id, endpoint, accessToken){
    request({
        url: 'https://' + endpoint + '/api/v4/submissions/' + submission_id + '?access_token=' + accessToken,
        method: 'GET'
    }, function (error, response, body) {
        if (error) {
            console.log('Connection problem');
        }

        // process response
        if (response) {
            if (response.statusCode === 200) {
                var ans = JSON.parse(response.body) // submission data in JSON
                if (ans.executing === true) {
                    sleep(2000);
                    fetchOutput(submission_id, endpoint, accessToken);
                }
                else {
                    console.log('Generated Output File - ' + ans.result.streams.output.uri);
                }
            } else {
                if (response.statusCode === 401) {
                    console.log('Invalid access token');
                }
                if (response.statusCode === 403) {
                    console.log('Access denied');
                }
                if (response.statusCode === 404) {
                    console.log('Submision not found');
                }
            }
        }
    });
}



// Defining request parameters
var compiler = 41;
var source_code = `
#include <bits/stdc++.h>
using namespace std;
    
int main(){
    int n;cin>>n;
    int A[n];
    for(int i=0;i<n;i++){
        cin>>A[i];
    }
    sort(A,A+n);
    for(int i=0;i<n;i++){
        cout<<A[i]<<" ";
    }
  return 0; 
}
`;
var input_data = `
5
5 4 2 3 1
`;
var submissionData = {
    compilerId: compiler,
    source: source_code,
    input: input_data
};

// Sending request
request({
    url: 'https://' + endpoint + '/api/v4/submissions?access_token=' + accessToken,
    method: 'POST',
    form: submissionData
    }, function (error, response, body) {
    if (error) {
        console.log('Connection problem');
    }
    
    // process response
    if (response) {
            if (response.statusCode === 201) {
                var submission_id =  JSON.parse(response.body).id; // submission data in JSON
                console.log('Id : '+submission_id);
                fetchOutput(submission_id, endpoint, accessToken);
            }
            else {
                if (response.statusCode === 401) {
                    console.log('Invalid access token');
                }
                else if (response.statusCode === 402) {
                    console.log('Unable to create submission');
                }
                else if (response.statusCode === 400) {
                    var body = JSON.parse(response.body);
                    console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
                }
            }
        }
    }
);