from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.vote import Vote
from app.models.claim import Claim
from app.services.claim_service import ClaimService
from app import db

votes_bp = Blueprint('votes', __name__)


@votes_bp.route('', methods=['POST'])
@jwt_required()
def cast_vote():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not all(k in data for k in ['claim_id', 'vote_type']):
        return jsonify({'error': 'Claim ID and vote type are required'}), 400

    if data['vote_type'] not in ['upvote', 'downvote']:
        return jsonify({'error': 'Vote type must be upvote or downvote'}), 400

    # Check if claim exists
    claim = Claim.query.get(data['claim_id'])
    if not claim:
        return jsonify({'error': 'Claim not found'}), 404

    # Check if user already voted
    existing_vote = Vote.query.filter_by(
        claim_id=data['claim_id'],
        user_id=current_user_id
    ).first()

    if existing_vote:
        # Update existing vote
        existing_vote.vote_type = data['vote_type']
    else:
        # Create new vote
        vote = Vote(
            claim_id=data['claim_id'],
            user_id=current_user_id,
            vote_type=data['vote_type']
        )
        db.session.add(vote)

    db.session.commit()

    # Update credibility score
    ClaimService.update_credibility_score(data['claim_id'])

    return jsonify({'message': 'Vote cast successfully'}), 200


@votes_bp.route('/claim/<int:claim_id>', methods=['GET'])
def get_votes_for_claim(claim_id):
    votes = Vote.query.filter_by(claim_id=claim_id).all()

    upvotes = len([v for v in votes if v.vote_type == 'upvote'])
    downvotes = len([v for v in votes if v.vote_type == 'downvote'])

    return jsonify({
        'upvotes': upvotes,
        'downvotes': downvotes,
        'total_votes': len(votes),
        'credibility_score': upvotes - downvotes
    }), 200


@votes_bp.route('', methods=['DELETE'])
@jwt_required()
def remove_vote():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('claim_id'):
        return jsonify({'error': 'Claim ID is required'}), 400

    vote = Vote.query.filter_by(
        claim_id=data['claim_id'],
        user_id=current_user_id
    ).first()

    if not vote:
        return jsonify({'error': 'No vote found to remove'}), 404

    db.session.delete(vote)
    db.session.commit()

    # Update credibility score
    ClaimService.update_credibility_score(data['claim_id'])

    return jsonify({'message': 'Vote removed successfully'}), 200