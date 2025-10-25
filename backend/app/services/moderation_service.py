import openai
import os
from typing import Dict, Any


class ModerationService:
    def __init__(self):
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        if self.openai_api_key:
            openai.api_key = self.openai_api_key

    def moderate_text(self, text: str) -> Dict[str, Any]:
        """Analyze text using OpenAI moderation"""
        if not self.openai_api_key:
            return {'moderated': False, 'reason': 'OpenAI API key not configured'}

        try:
            response = openai.Moderation.create(input=text)
            moderation_result = response["results"][0]

            return {
                'moderated': True,
                'flagged': moderation_result['flagged'],
                'categories': moderation_result['categories'],
                'category_scores': moderation_result['category_scores'],
                'overall_score': max(moderation_result['category_scores'].values()) if moderation_result[
                    'category_scores'] else 0
            }

        except Exception as e:
            return {'moderated': False, 'error': str(e)}

    def analyze_claim(self, claim_text: str) -> Dict[str, Any]:
        """Analyze claim for fact-checking potential"""
        if not self.openai_api_key:
            return {'analyzed': False, 'reason': 'OpenAI API key not configured'}

        try:
            prompt = f"""
            Analyze this claim for fact-checking: "{claim_text}"

            Provide analysis in this format:
            Category: [news/science/politics/health/other]
            Complexity: [low/medium/high]
            Verifiability: [low/medium/high]
            Risk Level: [low/medium/high]
            """

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150
            )

            analysis_text = response.choices[0].message.content.strip()
            return {'analyzed': True, 'analysis': analysis_text}

        except Exception as e:
            return {'analyzed': False, 'error': str(e)}