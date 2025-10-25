from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.claim import Claim
from app.models.user import User
from app.services.claim_service import ClaimService
from app.services.moderation_service import ModerationService
from app import db

claims_bp = Blueprint('claims', __name__)
moderation_service = ModerationService()


@claims_bp.route('', methods=['GET'])
def get_claims():
    category = request.args.get('category')
    status = request.args.get('status')
    sort_by = request.args.get('sort_by', 'newest')

    claims = ClaimService.get_claims_with_filters(category, status, sort_by)

    return jsonify({
        'claims': [claim.to_dict() for claim in claims],
        'count': len(claims)
    }), 200


@claims_bp.route('', methods=['POST'])
@jwt_required()
def create_claim():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('title') or not data.get('description'):
        return jsonify({'error': 'Title and description are required'}), 400

    # AI moderation
    moderation_result = moderation_service.moderate_text(data['description'])
    ai_moderation_score = moderation_result.get('overall_score', 0) if moderation_result.get('moderated') else None

    claim = Claim(
        title=data['title'],
        description=data['description'],
        user_id=current_user_id,
        category=data.get('category', 'general'),
        ai_moderation_score=ai_moderation_score
    )

    db.session.add(claim)
    db.session.commit()

    return jsonify({
        'message': 'Claim created successfully',
        'claim': claim.to_dict(),
        'moderation': moderation_result
    }), 201


@claims_bp.route('/<int:claim_id>', methods=['GET'])
def get_claim(claim_id):
    claim = Claim.query.get(claim_id)

    if not claim:
        return jsonify({'error': 'Claim not found'}), 404

    return jsonify({'claim': claim.to_dict()}), 200


@claims_bp.route('/<int:claim_id>', methods=['PUT'])
@jwt_required()
def update_claim(claim_id):
    current_user_id = get_jwt_identity()
    claim = Claim.query.get(claim_id)

    if not claim:
        return jsonify({'error': 'Claim not found'}), 404

    if claim.user_id != current_user_id:
        return jsonify({'error': 'Not authorized to update this claim'}), 403

    data = request.get_json()

    if data.get('title'):
        claim.title = data['title']
    if data.get('description'):
        claim.description = data['description']
    if data.get('category'):
        claim.category = data['category']

    db.session.commit()

    return jsonify({
        'message': 'Claim updated successfully',
        'claim': claim.to_dict()
    }), 200


@claims_bp.route('/<int:claim_id>', methods=['DELETE'])
@jwt_required()
def delete_claim(claim_id):
    current_user_id = get_jwt_identity()
    claim = Claim.query.get(claim_id)

    if not claim:
        return jsonify({'error': 'Claim not found'}), 404

    if claim.user_id != current_user_id:
        return jsonify({'error': 'Not authorized to delete this claim'}), 403

    db.session.delete(claim)
    db.session.commit()

    return jsonify({'message': 'Claim deleted successfully'}), 200