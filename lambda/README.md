configure VSCode launch.json as below to make _LAMBDA_SERVER_PORT = 8000


{    
    "version": "0.2.0",
    "configurations":[
    
        {
            "name": "Launch",
            "type": "go",
            "request": "launch",
            "mode": "auto",
            "program": "${fileDirname}",
            "env": {"_LAMBDA_SERVER_PORT": "8000"},
            "args": []
        }
    ]
}
