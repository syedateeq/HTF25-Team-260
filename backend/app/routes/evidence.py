from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.evidence import Evidence
from app.models.claim import Claim
from app import db

evidence_bp = Blueprint('evidence', __name__)


@evidence_bp.route('', methods=['POST'])
@jwt_required()
def add_evidence():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not all(k in data for k in ['claim_id', 'content', 'type']):
        return jsonify({'error': 'Claim ID, content, and type are required'}), 400

    # Check if claim exists
    claim = Claim.query.get(data['claim_id'])
    if not claim:
        return jsonify({'error': 'Claim not found'}), 404

    evidence = Evidence(
        claim_id=data['claim_id'],
        user_id=current_user_id,
        content=data['content'],
        type=data['type'],  # supporting or refuting
        source_url=data.get('source_url')
    )

    db.session.add(evidence)
    db.session.commit()

    return jsonify({
        'message': 'Evidence added successfully',
        'evidence': evidence.to_dict()
    }), 201


@evidence_bp.route('/claim/<int:claim_id>', methods=['GET'])
def get_evidence_for_claim(claim_id):
    evidence_list = Evidence.query.filter_by(claim_id=claim_id).all()

    return jsonify({
        'evidence': [evidence.to_dict() for evidence in evidence_list],
        'count': len(evidence_list)
    }), 200


@evidence_bp.route('/<int:evidence_id>', methods=['DELETE'])
@jwt_required()
def delete_evidence(evidence_id):
    current_user_id = get_jwt_identity()
    evidence = Evidence.query.get(evidence_id)

    if not evidence:
        return jsonify({'error': 'Evidence not found'}), 404

    if evidence.user_id != current_user_id:
        return jsonify({'error': 'Not authorized to delete this evidence'}), 403

    db.session.delete(evidence)
    db.session.commit()

    return jsonify({'message': 'Evidence deleted successfully'}), 200