pipeline {
    agent { label 'docker-host-agent' }
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_IMAGE_NAME = 'hoatd/demo-app'
        DOCKER_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT[0..7]}"
    }
    
    triggers {
        githubPush()
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    // Dùng biến Jenkins thay vì git command
                    echo "Current branch: ${env.BRANCH_NAME}"
                    echo "Git branch: ${env.GIT_BRANCH}"
                    echo "Change request: ${env.CHANGE_TARGET ?: 'N/A'}"
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    def image = docker.build("${DOCKER_IMAGE_NAME}:${DOCKER_TAG}")
                    docker.image("${DOCKER_IMAGE_NAME}:${DOCKER_TAG}").withRun('-p 3000:3000') { c ->
                        sh 'sleep 10'
                        sh 'curl -f http://localhost:3000/health || exit 1'
                    }
                }
            }
        }
        
        stage('Push to Docker Hub') {
            when {
                anyOf {
                    branch 'jenkins-piple'
                    expression { 
                        env.GIT_BRANCH == 'origin/jenkins-piple' || 
                        env.BRANCH_NAME == 'jenkins-piple' ||
                        env.CHANGE_TARGET == 'jenkins-piple'
                    }
                }
            }
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        docker.image("${DOCKER_IMAGE_NAME}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE_NAME}:latest").push()
                    }
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                sh 'docker rmi ${DOCKER_IMAGE_NAME}:${DOCKER_TAG} || true'
                sh 'docker system prune -f || true'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded! Docker image pushed to Docker Hub.'
            // You can add notifications here (Slack, email, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // You can add failure notifications here
        }
        always {
            cleanWs()
        }
    }
}
