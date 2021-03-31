# Django
from django.contrib.auth import password_validation, authenticate
from django.core.validators import RegexValidator

from api.models import (User, Test, Course, 
        ProfileUser, ResultTest, ResultContest)
from rest_framework.authtoken.models import Token

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

class TestModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = (
            'id',
            'title'
        )

class CourseModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = (
            'id',
            'title'
        )

class ResultContestModelSerializer(serializers.ModelSerializer):
    course = CourseModelSerializer()
    class Meta:
        model = ResultContest
        fields = (
            'created',
            'calification',
            'code_travel',
            'course'
        )


class ResultTestModelSerializer(serializers.ModelSerializer):
    test = TestModelSerializer()
    class Meta:
        model = ResultTest
        fields = (
            'points_total',
            'is_complete',
            'test'
        )

class ProfileModelSerializer(serializers.ModelSerializer):
    tests_performed = ResultTestModelSerializer(many=True)
    approved_courses = ResultContestModelSerializer(many=True)
    class Meta:
        model = ProfileUser
        fields = (
            'approved_courses',
            'tests_performed'
        )


class UserModelSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField('get_profile')

    def get_profile(self, user):
        qs = ProfileUser.objects.filter(user=user).first()
        serializer = ProfileModelSerializer(instance=qs, many=False)
        data = serializer.data
        return data

    class Meta:
        model=User
        fields = (
            'username', 
            'email',
            'first_name',
            'last_name',
            'dni',
            'profile',
            'initial_test_performed'
        )


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, max_length=64)

    def validate(self,data):
        user = authenticate(username=data['email'], password=data['password'])

        if not user:
            raise serializers.ValidationError('Invalid credentials')

        self.context['user'] = user
        return data

    def create(self, data):
        token, created = Token.objects.get_or_create(user=self.context['user'])
        return self.context['user'], token.key


class UserSignUpSerializer(serializers.Serializer):

    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(), message='el correo ya existe, prueba con otro email. ')]
    )

    username = serializers.CharField(
        min_length=4,
        max_length=20,
        validators=[UniqueValidator(queryset=User.objects.all(), message="el usuario ya existe, prueba con otro nombre.")]
    )

    dni = serializers.CharField(max_length=12, validators=[UniqueValidator(queryset=User.objects.all(), message='el rut ya existe, prueba con otro rut.')])
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    # Password
    password = serializers.CharField(min_length=8, max_length=64)
    password_confirmation = serializers.CharField(min_length=8, max_length=64)


    def validate(self, data):
        passwd = data['password']
        passwd_conf = data['password_confirmation']
        if passwd != passwd_conf:
            raise serializers.ValidationError("Password don't match")
        password_validation.validate_password(passwd)
        return data

    def create(self, data):
        """Handle user and profile creation."""
        data.pop('password_confirmation')
        user = User.objects.create_user(**data, is_student=True)
        ProfileUser.objects.create(user=user)
        return user
