host="imaps.goodwright.org"

# Build app
npm run build

# Make temp directory on the server
ssh marvin@$host "mkdir ~/$host-temp"

# Upload app
scp -r build/* marvin@$host:~/$host-temp/

# Empty app directory
ssh marvin@$host "rm -r ~/$host/* >& /dev/null"

# Copy app over
ssh marvin@$host "cp -r ~/$host-temp/* $host/"

# Remove temp folder
ssh marvin@$host "rm -r ~/$host-temp"