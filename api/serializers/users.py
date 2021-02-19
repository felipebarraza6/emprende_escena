# Django
from django.contrib.auth import password_validation, authenticate
from django.core.validators import RegexValidator

from api.models import User, ProfileUser
from rest_framework.authtoken.models import Token

from rest_framework import serializers
from rest_framework.validators import UniqueValidator


class ProfileModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileUser
        fields = (
            'approved_courses',
            'tests_performed'
        )
        read_only_fields = (
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
            'profile'
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
        user = User.objects.create_user(**data, is_student=True)
        ProfileUser.objects.create(user=user)
        return user
