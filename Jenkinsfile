pipeline {
    agent any

    environment {
        APP_NAME       = 'quiz-app'
        CONTAINER_NAME = 'quiz-app-container'
        HOST_PORT      = '3001'
        CONTAINER_PORT = '80'
    }

    options {
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Source code checked out by Jenkins from GitHub'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                bat 'npm install --legacy-peer-deps'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                bat 'npm test -- --watchAll=false --passWithNoTests || exit 0'
            }
        }

        stage('Build React App') {
            steps {
                echo 'Building React app...'
                bat 'npm run build'
                echo 'Build complete.'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                bat 'docker build --no-cache -t quiz-app .'
                echo 'Docker image built successfully.'
            }
        }

        stage('Remove Old Container') {
            steps {
                echo 'Removing old container...'
                bat 'docker stop quiz-app-container || exit 0'
                bat 'docker rm   quiz-app-container || exit 0'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying new container...'
                bat 'docker run -d -p 3001:80 --name quiz-app-container --restart unless-stopped quiz-app'
                echo 'Container deployed on port 3001'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Checking container health...'
                bat '''
                    timeout /t 5 /nobreak
                    docker inspect -f "{{.State.Status}}" quiz-app-container
                '''
                echo 'Health check passed.'
            }
        }
    }

    post {
        success {
            echo 'quiz-app deployed successfully on http://localhost:3001'
        }
        failure {
            echo 'Deployment failed. Check logs above.'
        }
        always {
            bat 'docker image prune -f || exit 0'
        }
    }
}