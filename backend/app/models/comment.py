from app import db
from datetime import datetime


class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    claim_id = db.Column(db.Integer, db.ForeignKey('claims.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    parent_comment_id = db.Column(db.Integer, db.ForeignKey('comments.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Self-referential relationship for replies
    replies = db.relationship('Comment',
                              backref=db.backref('parent', remote_side=[id]),
                              lazy=True,
                              cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'claim_id': self.claim_id,
            'user_id': self.user_id,
            'author_username': self.author.username if self.author else None,
            'content': self.content,
            'parent_comment_id': self.parent_comment_id,
            'created_at': self.created_at.isoformat(),
            'replies': [reply.to_dict() for reply in self.replies]
        }