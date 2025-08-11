from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, ProgressGoal


goals_bp = Blueprint("goals", __name__)


@goals_bp.route("/api/goals", methods=["GET"])
@jwt_required()
def get_goals():
    user_id = int(get_jwt_identity())
    goals = ProgressGoal.query.filter_by(user_id=user_id).order_by(ProgressGoal.created_at.desc()).all()
    return jsonify({"goals": [g.to_dict() for g in goals]}), 200


@goals_bp.route("/api/goals", methods=["POST"])
@jwt_required()
def set_goals():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    daily_verses = data.get("dailyVerses")
    daily_minutes = data.get("dailyMinutes")

    goal = ProgressGoal(user_id=user_id, daily_verses=daily_verses, daily_minutes=daily_minutes)
    db.session.add(goal)
    db.session.commit()

    return jsonify({"goal": goal.to_dict()}), 201
