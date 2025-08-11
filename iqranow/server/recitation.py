import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from google.cloud import speech
from .models import db, RecitationSession
from .utils import score_recitation


recite_bp = Blueprint("recite", __name__)


AUDIO_ENCODING_BY_MIME = {
    "audio/webm": speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
    "audio/ogg": speech.RecognitionConfig.AudioEncoding.OGG_OPUS,
    "audio/ogg; codecs=opus": speech.RecognitionConfig.AudioEncoding.OGG_OPUS,
    "audio/wav": speech.RecognitionConfig.AudioEncoding.LINEAR16,
    "audio/x-wav": speech.RecognitionConfig.AudioEncoding.LINEAR16,
    "audio/wave": speech.RecognitionConfig.AudioEncoding.LINEAR16,
}


DEFAULT_SAMPLE_RATE = {
    speech.RecognitionConfig.AudioEncoding.WEBM_OPUS: 48000,
    speech.RecognitionConfig.AudioEncoding.OGG_OPUS: 48000,
    speech.RecognitionConfig.AudioEncoding.LINEAR16: 16000,
}


def transcribe_with_google(audio_content: bytes, mime_type: str, language_code: str) -> str:
    try:
        client = speech.SpeechClient()
        audio = speech.RecognitionAudio(content=audio_content)
        encoding = AUDIO_ENCODING_BY_MIME.get(mime_type, speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED)
        config = speech.RecognitionConfig(
            encoding=encoding,
            sample_rate_hertz=DEFAULT_SAMPLE_RATE.get(encoding, 16000),
            language_code=language_code,
            enable_automatic_punctuation=False,
        )
        response = client.recognize(config=config, audio=audio)
        if not response.results:
            return ""
        return " ".join([result.alternatives[0].transcript for result in response.results]).strip()
    except Exception as exc:  # noqa: BLE001
        current_app.logger.warning(f"Google STT failed or not configured: {exc}")
        return ""


@recite_bp.route("/api/recitation", methods=["POST"])
@jwt_required()
def recitation():
    user_id = get_jwt_identity()

    if "audio" not in request.files:
        return jsonify({"message": "Audio file is required"}), 400

    surah = request.form.get("surah")
    ayah = request.form.get("ayah")
    expected_text = request.form.get("expectedText", "")

    file_storage = request.files["audio"]
    filename = file_storage.filename or "recitation.webm"
    mime_type = file_storage.mimetype or "audio/webm"
    save_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
    file_storage.save(save_path)

    with open(save_path, "rb") as f:
        audio_bytes = f.read()

    recognized = transcribe_with_google(
        audio_content=audio_bytes,
        mime_type=mime_type,
        language_code=current_app.config.get("GOOGLE_STT_LANGUAGE_CODE", "ar-SA"),
    )

    feedback = score_recitation(expected_text or "", recognized or "")

    session = RecitationSession(
        user_id=user_id,
        surah=surah,
        ayah=ayah,
        expected_text=expected_text,
        recognized_text=recognized,
        score=feedback.get("score"),
        feedback=feedback,
    )
    db.session.add(session)
    db.session.commit()

    return jsonify({
        "recognizedText": recognized,
        "feedback": feedback,
        "session": session.to_dict(),
    }), 200
