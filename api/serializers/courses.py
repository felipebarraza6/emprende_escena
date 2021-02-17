from rest_framework import serializers

from api.models import (Course, Resource, Video, QuestionCourse,
AlternativeQuestion, ResultContest)

class ResultContestModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultContest
        fields = '__all__'

class AlertnativeQuestionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlternativeQuestion
        fields = '__all__'

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
        fields = '__all__'

class VideoModelSerializer(serializers.ModelSerializer):
    class Meta:
        model=Video
        fields = '__all__'

class ResourceModelSerializer(serializers.ModelSerializer):
    class Meta:
        model=Resource
        fields = '__all__'

class CourseModelSerializer(serializers.ModelSerializer):
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
        fields = '__all__'
