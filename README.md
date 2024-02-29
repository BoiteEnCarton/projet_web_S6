# superprojet

docker run --name hapi-mysql -e MYSQL_USER=erwab -e MYSQL_PASSWORD=hapi -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -d -p 3308:3306 mysql:8 mysqld --default-authentication-plugin=mysql_native_password
docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management 