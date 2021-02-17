# Django
from django.contrib.auth import password_validation, authenticate
from django.core.validators import RegexValidator

from api.models import User, ResultContest, ResultTest
from rest_framework.authtoken.models import Token

from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .courses import ResultContestModelSerializer
from .tests import ResultTestModelSerializer


class UserProfileModelSerializer(serializers.ModelSerializer):
    courses_finish = serializers.SerializerMethodField('get_courses')
    tests_finish = serializers.SerializerMethodField('get_tests')

    def get_tests(self, user):
        qs = ResultTest.objects.filter(user=user)
        serializer = ResultTestModelSerializer(instance=qs, many=True)
        data = serializer.data
        return data

    def get_courses(self, user):
        qs = ResultContest.objects.filter(user=user)
        serializer = ResultContestModelSerializer(instance=qs, many=True)
        data = serializer.data
        return data

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'dni',
            'courses_finish',
            'tests_finish'
        )

class UserModelSerializer(serializers.ModelSerializer):

    class Meta:
        model=User
        fields = (
            'id',
            'username', 
            'email',
            'first_name',
            'last_name',
            'dni',
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
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    username = serializers.CharField(
        min_length=4,
        max_length=20,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    dni = serializers.CharField(max_length=12, validators=[UniqueValidator(queryset=User.objects.all())])
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
        user = User.objects.create_user(**data)
        return user
