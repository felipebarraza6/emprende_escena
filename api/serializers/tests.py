from rest_framework import serializers

from api.models import (Test, QuestionTest, AlternativeQuestionTest, ResultTest,
AnswerTest, User)


class ResultTestModelSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    answers = serializers.ListField()
    class Meta:
        model = ResultTest
        fields = '__all__'
    
    def validate(self, data):
        total_points = 0
    
        if 'answers' in data:
            list_answers = data['answers']
            for answer in list_answers:
                get_question_instance = QuestionTest.objects.filter(id=answer['question']).first()
                get_answer_instance = AlternativeQuestionTest.objects.filter(id=answer['answer']).first()
                AnswerTest.objects.create(
                    user = data['user'],
                    question = get_question_instance,
                    answer = get_answer_instance
                )             
                total_points+=get_answer_instance.points
            ResultTest.objects.create(
                user= data['user'],
                test= data['test'],
                points_total = total_points,
                is_complete=True
            )
            User.objects.filter(id=data['user'].id).update(initial_test_performed=True)
        return data


class AlternativeQuestionTestModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlternativeQuestionTest
        fields = (
            'id',
            'title',
            'points'
        )


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
        fields = (
            'id',
            'title',
            'alternatives'
        )


class TestModelSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField('get_questions')
    
    def get_questions(self, test):
        qs = QuestionTest.objects.filter(test=test)
        serializer = QuestionTestModelSerializer(instance=qs, many=True)
        data = serializer.data
        return data

    class Meta:
        model = Test
        fields = (
            'id',
            'title',
            'description',
            'questions'
        )
