podTemplate(yaml: """
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins/kaniko: "true"
spec:
  containers:
    - name: kaniko
      image: gcr.io/kaniko-project/executor:v1.6.0-debug
      imagePullPolicy: Always
      command:
        - cat
      tty: true
      volumeMounts:
        - name: docker-config
          mountPath: /kaniko/.docker

    - name: sonar-scanner
      image: sonarsource/sonar-scanner-cli:latest
      command:
        - cat
      tty: true
      
  volumes:
    - name: docker-config
      secret:
        secretName: docker-config-dockerhub
        items:
          - key: .dockerconfigjson
            path: config.json
""") {
  node(POD_LABEL) {
    stage('Checkout') {
      checkout scm
    }
    
    stage('SonarQube Analysis') {
      container('sonar-scanner') {  
        withSonarQubeEnv('sonarQube') {
          withCredentials([string(credentialsId: 'sonarQubeToken', variable: 'SONAR_TOKEN')]) {
            sh """
              sonar-scanner \
                -Dsonar.projectKey=frontend \
                -Dsonar.sources=src \
                -Dsonar.host.url=${SONAR_HOST_URL} \
                -Dsonar.login=${SONAR_TOKEN}
            """
          }
        }
      }
    }
    
    stage('Build & Push with Kaniko') {
      container('kaniko') {
        script {
          def IMAGE = "docker.io/dockdock150/frontend:${BUILD_NUMBER}"  // ← backend → frontend
          sh """
          /kaniko/executor \
            --context ${WORKSPACE} \
            --dockerfile ${WORKSPACE}/Dockerfile \
            --destination ${IMAGE} \
            --cleanup \
            --force
          """
        }
      }
    }
    
    stage('Update Kustomize for ArgoCD') {
      withCredentials([usernamePassword(credentialsId: 'git-clone', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
        script {
          sh '''
            git config --global user.email "jenkins@ci.com"
            git config --global user.name "Jenkins CI"
          '''
          
          sh '''
            rm -rf DeploymentRepo
            git clone https://$GIT_USER:$GIT_PASS@github.com/AllStackProject/Deployment.git DeploymentRepo
          '''
        
          sh """
            cd DeploymentRepo/frontend/overlays/dev
            sed -i 's|newTag:.*|newTag: "${BUILD_NUMBER}"|' kustomization.yaml
          """
          
          sh '''
            cd DeploymentRepo
            git add frontend/overlays/dev/kustomization.yaml
            git commit -m "chore: update frontend image tag to ${BUILD_NUMBER}"
            git push origin main
          '''
        }
      }
    }
    
    stage('Post-Build') {
      echo "✅ Frontend Docker image pushed to DockerHub successfully!"
    }
  }
}
