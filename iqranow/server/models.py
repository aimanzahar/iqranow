from datetime import datetime
from typing import Optional
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import func
from sqlalchemy.dialects.sqlite import JSON


db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    recitations = db.relationship("RecitationSession", backref="user", lazy=True)
    goals = db.relationship("ProgressGoal", backref="user", lazy=True)

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_safe_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "createdAt": self.created_at.isoformat(),
        }


class RecitationSession(db.Model):
    __tablename__ = "recitation_sessions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)

    surah = db.Column(db.String(120), nullable=True)
    ayah = db.Column(db.String(120), nullable=True)

    expected_text = db.Column(db.Text, nullable=True)
    recognized_text = db.Column(db.Text, nullable=True)

    score = db.Column(db.Float, nullable=True)
    feedback = db.Column(JSON, default=dict)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "userId": self.user_id,
            "createdAt": self.created_at.isoformat(),
            "surah": self.surah,
            "ayah": self.ayah,
            "expectedText": self.expected_text,
            "recognizedText": self.recognized_text,
            "score": self.score,
            "feedback": self.feedback,
        }


class ProgressGoal(db.Model):
    __tablename__ = "progress_goals"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Daily goal options - choose one or more
    daily_verses = db.Column(db.Integer, nullable=True)  # e.g., 5 verses/day
    daily_minutes = db.Column(db.Integer, nullable=True)  # e.g., 10 minutes/day

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "userId": self.user_id,
            "dailyVerses": self.daily_verses,
            "dailyMinutes": self.daily_minutes,
            "createdAt": self.created_at.isoformat(),
        }
