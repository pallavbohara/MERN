@ECHO OFF
echo "# pwa_news" >> README.md
git config --global user.email "pallavbohara@gmail.com"
git init
git add README.md
git add .
git commit -m "first commit"
git remote add origin https://github.com/pallavbohara/MERN.git
git push -u origin master
PAUSE