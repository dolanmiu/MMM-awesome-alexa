CLIENT_ID="amzn1...."
CLIENT_SECRET="71acc0...."
CODE="CODE FROM auth_code.sh"
REDIRECT_URI="https://sakirtemel.github.io/MMM-alexa/"

curl \
  -X POST \
  -d "grant_type=authorization_code&code=${CODE}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}" \
  https://api.amazon.com/auth/o2/token
