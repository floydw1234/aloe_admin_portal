get-content .env | foreach {
    $name, $value = $_.split('=')
    set-content env:\$name $value
}

(Get-ECRLoginCommand).Password | docker login --username AWS --password-stdin $env:AWS_ECR_REPO_URL
docker build -t short_containers .
docker tag short_containers:latest  $env:AWS_ECR_REPO_URL/short_containers:latest
docker push  $env:AWS_ECR_REPO_URL/short_containers:latest