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
    JWTManager(app)

    # CORS
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=app.config.get("CORS_SUPPORTS_CREDENTIALS", True),
    )

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
