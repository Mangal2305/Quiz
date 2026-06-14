npm run build
docker rm -f quiz-container
docker rmi quiz-app
docker build -t quiz-app .
docker run -d -p 3000:3000 --name quiz-container quiz-app
echo Done! Open http://localhost:3000
pause