from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from app.services.auth_service import AuthService
from app.models.user import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not all(k in data for k in ['username', 'email', 'password']):
        return jsonify({'error': 'Missing required fields: username, email, password'}), 400

    result, status_code = AuthService.register_user(
        username=data['username'],
        email=data['email'],
        password=data['password']
    )

    return jsonify(result), status_code


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Email and password required'}), 400

    result, status_code = AuthService.login_user(
        email=data['email'],
        password=data['password']
    )

    return jsonify(result), status_code


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({'user': user.to_dict()}), 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_token = create_access_token(identity=current_user_id)

    return jsonify({'access_token': new_token}), 200