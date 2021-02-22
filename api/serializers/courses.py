from rest_framework import serializers
from api.models import (Course, Resource, Video, QuestionCourse,
AlternativeQuestion, ResultContest, AnswerQuestion, PreRequisite)


class ResultContestModelSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    answers = serializers.ListField()
    class Meta:
        model = ResultContest
        fields = '__all__'

    def validate(self, data):
        correct_answers = 0
        course = data['course']
        user = data['user']
        code_generate = user.first_name[0:2] + user.last_name[0:2] + user.dni[0:4] + course.code_trip
        formating_code = code_generate.lower()

        if 'answers' in data:
            list_answers = data['answers']
            for answer in list_answers:
                get_question_instance = QuestionCourse.objects.filter(id=answer['question']).first()
                get_answer_instance = AlternativeQuestion.objects.filter(id=answer['answer']).first()
                
                AnswerQuestion.objects.create(
                    user = data['user'],
                    question = get_question_instance,
                    answer = get_answer_instance
                )

                if get_answer_instance.is_correct:
                    correct_answers+=1
         
        if correct_answers >= course.passing_score:
            ResultContest.objects.create(
                course = course,
                user = user,
                is_approved = True,
                code_travel= formating_code,
                calification = correct_answers
            )
        else:
            raise serializers.ValidationError('Curso Reprobado')

        return data

class AlertnativeQuestionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlternativeQuestion
        fields = (
            'id',
            'title',
            'is_correct'
        )


class QuestionCourseModelSerializer(serializers.ModelSerializer):
    alternatives = serializers.SerializerMethodField('get_alternatives')
    
    def get_alternatives(self, question):
        qs = AlternativeQuestion.objects.filter(question=question)
        serializer = AlertnativeQuestionModelSerializer(instance=qs, many
                = True)
        data = serializer.data
        return data

    class Meta:
        model=QuestionCourse
        fields = (
            'id',
            'title',
            'alternatives'
        )


class VideoModelSerializer(serializers.ModelSerializer):
    class Meta:
        model=Video
        fields = (
            'title',
            'url'
        )


class ResourceModelSerializer(serializers.ModelSerializer):
    class Meta:
        model=Resource
        fields = (
            'title',
            'file_re'
        )


class PreRequisiteModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreRequisite
        fields = ('pre_requisite',)


class ListCourseModelSerializer(serializers.ModelSerializer):
    pre_requisites = serializers.SerializerMethodField('get_pre_requisite')

    def get_pre_requisite(self, course):
        qs = PreRequisite.objects.filter(course=course).first()
        serializer = PreRequisiteModelSerializer(instance=qs, many=False)
        data = serializer.data
        return data

    class Meta:
        model = Course
        fields = (
            'id',
            'title',
            'image',
            'description',
            'tutor_name',
            'pre_requisites'
        )


class RetrieveCourseModelSerializer(serializers.ModelSerializer):
    resources = serializers.SerializerMethodField('get_resources')
    videos = serializers.SerializerMethodField('get_videos')
    questions = serializers.SerializerMethodField('get_questions')

    def get_questions(self, course):
        qs = QuestionCourse.objects.filter(course=course)
        serializer = QuestionCourseModelSerializer(instance=qs, many=True)
        data = serializer.data
        return data

    def get_resources(self, course):
        qs = Resource.objects.filter(course=course)
        serializer = ResourceModelSerializer(instance=qs, many=True)
        data = serializer.data
        return data

    def get_videos(self, course):
        qs = Video.objects.filter(course=course)
        serializer = VideoModelSerializer(instance=qs, many=True)
        data = serializer.data
        return data

    class Meta:
        model=Course
        fields = (
            'id',
            'title',
            'code_trip',
            'image',
            'description',
            'tutor_name',
            'resources',
            'videos',
            'questions'
        )
