import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", f"sqlite:///{os.path.join(os.path.dirname(__file__), 'iqranow.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key-change-me")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    CORS_SUPPORTS_CREDENTIALS = True

    GOOGLE_STT_LANGUAGE_CODE = os.getenv("GOOGLE_STT_LANGUAGE_CODE", "ar-SA")
    GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")

    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
