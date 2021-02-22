from django.db import models
from django.db.models.signals import post_save

from api.models.utils import ApiModel
from .courses import Course
from .users import User, ProfileUser

import json
import requests
import requests.packages.urllib3
requests.packages.urllib3.disable_warnings()


class QuestionCourse(ApiModel):
    title = models.CharField(max_length=1000)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = 'Curso - Pregunta'
        verbose_name_plural = 'Cursos - Preguntas'
        ordering = ['created']

    def __str__(self):
        return self.title


class AlternativeQuestion(ApiModel):
    title = models.CharField(max_length=1000)
    is_correct = models.BooleanField(default=False)
    question = models.ForeignKey(QuestionCourse, on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = 'Curso - Alternativa'
        verbose_name_plural = 'Curso - Alternativas'
        ordering = ['created']
    
    def __str__(self):
        return self.title


class ResultContest(ApiModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)
    code_travel = models.CharField(max_length=400, null=True, blank=True)
    calification = models.FloatField( null=True, blank=True)

    class Meta:
        verbose_name = 'Curso - Resultado de cuestionario'
        verbose_name_plural = 'Cursos - Resultados de cuestionarios'
    
    def __str__(self):
        return str(self.user)


class AnswerQuestion(ApiModel):
    question = models.ForeignKey(QuestionCourse, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    answer = models.ForeignKey(AlternativeQuestion, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Curso - Respuesta'
        verbose_name_plural = 'Cursos - Respuestas'
    
    def __str__(self):
        return str(self.user)


def validate_corfo(sender, instance, **kwargs):
    user = ProfileUser.objects.get(user=instance.user)
    user.approved_courses.add(instance)

    url = "https://apitest.corfo.cl:9101/OAG/API_WS_MOOC/Validate"
    
    payload = {
        "institucion": "3094",
        "rut": instance.user.dni,
        "contenido": instance.course.code_trip,
        "nombreContenido": instance.course.title,
        "codigoCertificacion": instance.code_travel,
        "correo": instance.user.email
    }
    
    to_json = json.dumps(payload)
    
    headers = {
        'Authorization': 'Bearer HO2sYIduAnsMO9BTb38z9ADruBNeajIjKnH5w0frofzoDyxDCzozQ8',
        'Content-Type': 'application/json',
        'Cookie': 'Cookie_v2=!Oy3KhqW6EmabSjn9TCejadw0ZLdkiUh+AQUz3h0lMygeWE0fy2uPmIZq9L/zUZ31VIBaTvhrLICuiIs='
    }    

    response = requests.request("POST", url, headers=headers, verify=False,
            data=to_json)
    
    return response

post_save.connect(validate_corfo, sender= ResultContest)

