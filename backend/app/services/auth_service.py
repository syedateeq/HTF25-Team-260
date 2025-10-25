from app.models.user import User
from app import db
from flask_jwt_extended import create_access_token, create_refresh_token


class AuthService:
    @staticmethod
    def register_user(username, email, password):
        # Check if user exists
        if User.query.filter_by(email=email).first():
            return {'error': 'Email already registered'}, 400

        if User.query.filter_by(username=username).first():
            return {'error': 'Username already taken'}, 400

        # Create new user
        user = User(username=username, email=email)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        # Generate tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        return {
            'message': 'User registered successfully',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }, 201

    @staticmethod
    def login_user(email, password):
        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)

            return {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': user.to_dict()
            }, 200

        return {'error': 'Invalid email or password'}, 401