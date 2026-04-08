pipeline {
    agent any

    environment {
        CONTAINER_NAME = "static-site"
        IMAGE_NAME = "static-site-img"
    }

    stages {

        stage('Clone') {
            steps {
                git 'https://github.com/your-username/your-repo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                docker run -d -p 80:80 --name $CONTAINER_NAME $IMAGE_NAME
                '''
            }
        }
    }
}
