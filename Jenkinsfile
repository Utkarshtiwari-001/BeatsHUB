pipeline {
    agent any

    environment {
        IMAGE_NAME = "static-site"
        CONTAINER_NAME = "static-site-container"
    }

    stages {

        stage('Clone Code') {
            steps {
               git branch: 'main', url: 'https://github.com/Utkarshtiwari-001/BeatsHUB.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker stop $CONTAINER_NAME || true'
                sh 'docker rm $CONTAINER_NAME || true'
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d -p 80:80 --name $CONTAINER_NAME $IMAGE_NAME'
            }
        }
    }
}
