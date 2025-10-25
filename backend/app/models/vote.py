from app import db
from datetime import datetime


class Vote(db.Model):
    __tablename__ = 'votes'

    id = db.Column(db.Integer, primary_key=True)
    claim_id = db.Column(db.Integer, db.ForeignKey('claims.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vote_type = db.Column(db.String(10))  # upvote, downvote
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('claim_id', 'user_id', name='unique_user_claim_vote'),)

    def to_dict(self):
        return {
            'id': self.id,
            'claim_id': self.claim_id,
            'user_id': self.user_id,
            'vote_type': self.vote_type,
            'created_at': self.created_at.isoformat()
        }