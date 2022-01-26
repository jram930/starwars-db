docker run -d --name dev-postgres -e POSTGRES_PASSWORD=password -v ${HOME}/workbench/git/starwars-db/postgres-data/:/var/lib/postgresql/data -p 7777:5432 postgres
