set -e

if [[ -f "UvvU.db" ]]; then
    echo "Old UvvU.db file found, mouving it to UvvU.db.backup"
    mv UvvU.db UvvU.db.backup
fi

echo "Creating new database"
sqlite3 UvvU.db < init.sql

echo "Starting server"
npm start