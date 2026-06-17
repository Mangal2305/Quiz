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
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm install --legacy-peer-deps'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                sh 'npm test -- --watchAll=false --passWithNoTests || true'
            }
        }

        stage('Build React App') {
            steps {
                echo 'Building React app...'
                sh 'npm run build'
                echo 'Build complete.'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build --no-cache -t quiz-app .'
                echo 'Docker image built successfully.'
            }
        }

        stage('Remove Old Container') {
            steps {
                echo 'Removing old container...'
                sh 'docker stop quiz-app-container || true'
                sh 'docker rm   quiz-app-container || true'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying new container...'
                sh '''
                    docker run -d \
                      -p 3001:80 \
                      --name quiz-app-container \
                      --restart unless-stopped \
                      quiz-app
                '''
                echo 'Container deployed on port 3001'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Checking container health...'
                sh '''
                    sleep 5
                    STATUS=$(docker inspect -f "{{.State.Status}}" quiz-app-container)
                    echo "Container status: $STATUS"
                    [ "$STATUS" = "running" ] || exit 1
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
            sh 'docker image prune -f || true'
        }
    }
}