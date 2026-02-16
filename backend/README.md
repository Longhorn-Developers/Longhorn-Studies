# Longhorn Studies Backend

This is a Python Flask backend with SQLAlchemy ORM for database management.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- On Windows:
  ```bash
  venv\Scripts\activate
  ```
- On macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables (optional):
```bash
cp .env.example .env
# Edit .env file with your configuration
```

## Running the Server

```bash
python app.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if the API is running

### Study Spots
- **GET** `/api/study_spots` - Get all study spots
- **GET** `/api/study_spots/<id>` - Get a specific study spot
- **POST** `/api/study_spots` - Create a new study spot (requires: abbreviation, study_spot_name, address, noise_level, capacity, spot_type, access_hours, near_food, reservable, description)
  ```json
  {
    "abbreviation": "PCL",
    "study_spot_name": "3rd Floor",
    "building_name": "Perry-Castañeda Library",
    "address": "101 E 21st St",
    "floor": 3,
    "tags": ["quiet", "wifi"],
    "noise_level": "Low",
    "capacity": 100,
    "spot_type": ["Open Area", "Library"],
    "access_hours": "24/7 during finals",
    "near_food": true,
    "additional_properties": null,
    "reservable": false,
    "description": "Main campus library."
  }
  ```
- **PUT** `/api/study_spots/<id>` - Update a study spot (send only fields to update)
- **DELETE** `/api/study_spots/<id>` - Delete a study spot

## Database

The application uses SQLite by default for development. The database file will be created automatically as `longhorn_studies.db` when you first run the application.

To use a different database (PostgreSQL, MySQL, etc.), update the `DATABASE_URL` in your `.env` file.

## Project Structure

```
backend/
├── app.py              # Flask application initialization
├── models.py           # SQLAlchemy database models
├── routes.py           # API route definitions
├── scripts/            # Utility scripts
│   ├── update_db.sh    # POST one study spot
│   ├── delete_db.sh    # DELETE a study spot by ID
├── requirements.txt   # Python dependencies
├── .env.example       # Environment variables template
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Middleware

The application includes:
- **CORS**: Configured to allow cross-origin requests from the frontend
- **Request Logging**: Logs all incoming requests with timestamps
- **Error Handlers**: Custom error handlers for 400, 404, and 500 errors

## Development

The application runs in debug mode by default for development. For production:

1. Set `FLASK_ENV=production` in your `.env` file
2. Change the `SECRET_KEY` to a secure random value
3. Use a production-grade database (PostgreSQL recommended)
4. Use a production WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn app:app
   ```
