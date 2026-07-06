echo "Waiting for PostgreSQL..."

until nc -z postgres 5432; do
  sleep 1
done

echo "PostgreSQL is ready"

echo "Running migrations..."
npm run migration:run

echo "Running seed..."
npm run db:seed

echo "Starting Next.js..."

npm run dev