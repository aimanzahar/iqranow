import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

from .config import Config
from .models import db
from .auth import auth_bp
from .recitation import recite_bp
from .progress import progress_bp
from .goals import goals_bp


load_dotenv()


def create_app(config_class: type = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Extensions
    db.init_app(app)
    jwt = JWTManager(app)

    # CORS
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=app.config.get("CORS_SUPPORTS_CREDENTIALS", True),
    )

    # JWT error handlers to avoid 422 responses
    @jwt.unauthorized_loader
    def unauthorized_callback(reason: str):
        return jsonify({"message": "Missing or invalid Authorization header", "reason": reason}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(reason: str):
        return jsonify({"message": "Invalid token", "reason": reason}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):  # type: ignore[no-untyped-def]
        return jsonify({"message": "Token has expired"}), 401

    @jwt.needs_fresh_token_loader
    def needs_fresh_token_callback(jwt_header, jwt_payload):  # type: ignore[no-untyped-def]
        return jsonify({"message": "Fresh token required"}), 401

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):  # type: ignore[no-untyped-def]
        return jsonify({"message": "Token has been revoked"}), 401

    # Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(recite_bp)
    app.register_blueprint(progress_bp)
    app.register_blueprint(goals_bp)

    # Create DB
    with app.app_context():
        db.create_all()

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"}), 200

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
