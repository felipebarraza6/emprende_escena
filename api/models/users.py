"""User Model."""

# Django
from django.db import models 
from django.contrib.auth.models import AbstractUser

# Utilities
from .utils import ApiModel


class User(ApiModel, AbstractUser):

    email = models.EmailField(
        'email',
        unique = True,
    )

    dni = models.CharField(max_length=12, blank=False, null=False, unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'dni']
    
    initial_test_performed = models.BooleanField(default=False)
    is_student = models.BooleanField(default=False)
    
    class Meta:
        verbose_name='Usuario'
        verbose_name_plural='Usuarios'

    def __str__(self):
        return self.username


class ProfileUser(ApiModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    approved_courses = models.ManyToManyField('api.ResultContest',
            related_name='user_result_contest', blank=True)
    tests_performed = models.ManyToManyField('api.ResultTest',
            related_name='user_result_test', blank=True)
    
    class Meta:
        verbose_name = 'Usuario - Perfil'
        verbose_name_plural = 'Usuarios - Perfiles'
    
    def __str__(self):
        return str(self.user)

