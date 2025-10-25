from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
import os

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///dev.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Import and register blueprints
    from app.routes.auth import auth_bp
    from app.routes.claims import claims_bp
    from app.routes.evidence import evidence_bp
    from app.routes.votes import votes_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(claims_bp, url_prefix='/api/claims')
    app.register_blueprint(evidence_bp, url_prefix='/api/evidence')
    app.register_blueprint(votes_bp, url_prefix='/api/votes')

    return app