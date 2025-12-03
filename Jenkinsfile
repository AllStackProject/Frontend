podTemplate(yaml: """
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins/kaniko: "true"
spec:
  nodeSelector:
    jenkins-node: "true"

  tolerations:
  - key: "dedicated"
    operator: "Equal"
    value: "cicd"
    effect: "NoSchedule"

  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:v1.6.0-debug
    imagePullPolicy: Always
    command:
      - /busybox/sh
    args:
      - -c
      - sleep 99d
    tty: true
    volumeMounts:
      - name: docker-config
        mountPath: /kaniko/.docker
      - name: kaniko-build
        mountPath: /workspace
      - name: kaniko-tmp
        mountPath: /tmp
    resources:
      requests:
        cpu: "500m"
        memory: "1Gi"

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

  - name: kaniko-build
    persistentVolumeClaim:
      claimName: pvc-kaniko-build-60

  - name: kaniko-tmp
    persistentVolumeClaim:
      claimName: pvc-kaniko-tmp-30
""") {

  node(POD_LABEL) {

    try {

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
            def IMAGE = "docker.io/dockdock150/frontend:${BUILD_NUMBER}"
            sh """
              /kaniko/executor \
                --context ${WORKSPACE} \
                --dockerfile ${WORKSPACE}/Dockerfile \
                --destination ${IMAGE} \
                --cache=true \
                --cache-repo=docker.io/dockdock150/frontend-cache \
                --cleanup \
                --force
            """
          }
        }
      }

      stage('Update Kustomize for ArgoCD') {
        withCredentials([usernamePassword(credentialsId: 'git-clone', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {

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

      stage('Post-Build') {
        echo "✅ Frontend Docker image pushed to DockerHub successfully!"
      }

      currentBuild.result = 'SUCCESS'

    } catch (e) {

      currentBuild.result = 'FAILURE'
      throw e

    } finally {
      // Git 정보 수집
      def branch = env.BRANCH_NAME ?: sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
      def commitAuthor = sh(script: "git log -1 --pretty=format:'%an'", returnStdout: true).trim()
      def commitMsg = sh(script: "git log -1 --pretty=format:'%s'", returnStdout: true).trim()
      def commitHash = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
      def timestamp = new Date().format("yyyy-MM-dd HH:mm:ss")
      def imageTag = BUILD_NUMBER
      
      if (currentBuild.result == 'SUCCESS') {
        slackSend(
          channel: 'C09FJ3HK7E1',
          color: 'good',
          message: """
🎉 *Backend 배포 성공!*
* 배포자:* ${commitAuthor}
* 배포 시각:* ${timestamp}
* 브랜치:* ${branch}
* 버전(Tag):* ${imageTag}
* 커밋 메시지:* ${commitMsg}
* 커밋:* ${commitHash}
🔗 <${env.BUILD_URL}|Jenkins Build 보기>
""",
          tokenCredentialId: 'slack-webhook'
        )
      } else {
        slackSend(
          channel: 'C09FJ3HK7E1',
          color: 'danger',
           message: """
🔥 *Backend 배포 실패!*
*배포자:* ${commitAuthor}
* 배포 시각:* ${timestamp}
* 브랜치:* ${branch}
* 커밋 메시지:* ${commitMsg}
* 커밋:* ${commitHash}
🔗 <${env.BUILD_URL}|Jenkins Build 보기>
""",
          tokenCredentialId: 'slack-webhook'
        )
      }
    }
  }
}
