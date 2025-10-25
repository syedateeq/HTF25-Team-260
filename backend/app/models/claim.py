from app import db
from datetime import datetime


class Claim(db.Model):
    __tablename__ = 'claims'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    credibility_score = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='pending')  # pending, verified, debunked
    category = db.Column(db.String(50))
    ai_moderation_score = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    evidence = db.relationship('Evidence', backref='claim', lazy=True, cascade='all, delete-orphan')
    votes = db.relationship('Vote', backref='claim', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='claim', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'user_id': self.user_id,
            'author_username': self.author.username if self.author else None,
            'credibility_score': self.credibility_score,
            'status': self.status,
            'category': self.category,
            'ai_moderation_score': self.ai_moderation_score,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'evidence_count': len(self.evidence),
            'vote_count': len(self.votes),
            'comment_count': len(self.comments)
        }