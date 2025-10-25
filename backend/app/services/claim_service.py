from app.models.claim import Claim
from app.models.vote import Vote
from app import db


class ClaimService:
    @staticmethod
    def update_credibility_score(claim_id):
        claim = Claim.query.get(claim_id)
        if not claim:
            return

        # Calculate score based on votes
        upvotes = Vote.query.filter_by(claim_id=claim_id, vote_type='upvote').count()
        downvotes = Vote.query.filter_by(claim_id=claim_id, vote_type='downvote').count()

        credibility_score = upvotes - downvotes
        claim.credibility_score = credibility_score

        # Update status based on score
        if credibility_score >= 10:
            claim.status = 'verified'
        elif credibility_score <= -5:
            claim.status = 'debunked'
        else:
            claim.status = 'pending'

        db.session.commit()

    @staticmethod
    def get_claims_with_filters(category=None, status=None, sort_by='newest'):
        query = Claim.query

        # Apply filters
        if category:
            query = query.filter(Claim.category == category)
        if status:
            query = query.filter(Claim.status == status)

        # Apply sorting
        if sort_by == 'credibility':
            query = query.order_by(Claim.credibility_score.desc())
        elif sort_by == 'most_discussed':
            # This would need a subquery for comment count
            query = query.order_by(Claim.updated_at.desc())
        else:  # newest first
            query = query.order_by(Claim.created_at.desc())

        return query.all()