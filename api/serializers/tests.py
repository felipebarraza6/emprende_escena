from rest_framework import serializers

from api.models import Test, QuestionTest, AlternativeQuestionTest, ResultTest


class ResultTestModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultTest
        fields = '__all__'

class AlternativeQuestionTestModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlternativeQuestionTest
        fields = '__all__'

class QuestionTestModelSerializer(serializers.ModelSerializer):
    alternatives = serializers.SerializerMethodField('get_alternatives')

    def get_alternatives(self, question):
        qs = AlternativeQuestionTest.objects.filter(question=question)
        serializer = AlternativeQuestionTestModelSerializer(instance=qs,
                many=True)
        data = serializer.data
        return data

    class Meta:
        model = QuestionTest
        fields = '__all__'


class TestModelSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField('get_questions')
    
    def get_questions(self, test):
        qs = QuestionTest.objects.filter(test=test)
        serializer = QuestionTestModelSerializer(instance=qs, many=True)
        data = serializer.data
        return data

    class Meta:
        model = Test
        fields = '__all__'
