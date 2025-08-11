from datetime import datetime, timedelta
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import desc
from .models import db, RecitationSession


progress_bp = Blueprint("progress", __name__)


@progress_bp.route("/api/progress", methods=["GET"])
@jwt_required()
def get_progress():
    user_id = int(get_jwt_identity())

    sessions = (
        RecitationSession.query.filter_by(user_id=user_id)
        .order_by(desc(RecitationSession.created_at))
        .limit(100)
        .all()
    )

    # Compute simple daily averages for the last 30 days
    now = datetime.utcnow()
    by_day = {}
    for s in sessions:
        day_key = s.created_at.date().isoformat()
        by_day.setdefault(day_key, []).append(s.score or 0)

    daily = []
    for i in range(29, -1, -1):
        day = (now - timedelta(days=i)).date().isoformat()
        scores = by_day.get(day, [])
        avg = round(sum(scores) / len(scores), 2) if scores else None
        daily.append({"date": day, "avgScore": avg, "count": len(scores)})

    return jsonify({
        "recentSessions": [s.to_dict() for s in sessions],
        "daily": daily,
    }), 200
