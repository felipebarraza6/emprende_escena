from django.db import models
from api.models.utils import ApiModel


class Course(ApiModel):
    title = models.CharField(max_length=200)
    code_trip = models.CharField(max_length=600)
    image = models.ImageField()
    description = models.CharField(max_length=400)
    tutor_name = models.CharField(max_length=220)
    passing_score = models.IntegerField()

    class Meta:
        verbose_name = 'Curso'
        verbose_name_plural = 'Cursos'
        ordering = ['created']

    def __str__(self):
        return self.title


class PreRequisite(ApiModel):
    course = models.OneToOneField(Course, on_delete=models.CASCADE,
            related_name='course_affect')
    pre_requisite = models.OneToOneField(Course, on_delete=models.CASCADE,
            related_name='course_prerequisit')

    class Meta:
        verbose_name = 'Curso - Pre requisito'
        verbose_name_plural = 'Cursos - Pre requisitos'

    def __str__(self):
        return str(self.course)
    

class Video(ApiModel):
    title = models.CharField(max_length=200)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    url = models.URLField(max_length=1000)
    
    class Meta: 
        verbose_name = 'Curso - Video'
        verbose_name_plural = 'Cursos - Videos'
        ordering = ['created']

    def __str__(self):
        return self.title


class Resource(ApiModel):
    title = models.CharField(max_length=200)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    file_re = models.FileField(upload_to='uploads/resources/')
    
    class Meta:
        verbose_name = 'Curso - Recurso'
        verbose_name_plural = 'Cursos -Recursos'
        ordering = ['created']

    def __str__(self):
        return self.title

