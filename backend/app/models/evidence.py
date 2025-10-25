from app import db
from datetime import datetime


class Evidence(db.Model):
    __tablename__ = 'evidence'

    id = db.Column(db.Integer, primary_key=True)
    claim_id = db.Column(db.Integer, db.ForeignKey('claims.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(20))  # supporting, refuting
    source_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'claim_id': self.claim_id,
            'user_id': self.user_id,
            'author_username': self.author.username if self.author else None,
            'content': self.content,
            'type': self.type,
            'source_url': self.source_url,
            'created_at': self.created_at.isoformat()
        }