from django.db import models
from django.db.models.signals import post_save

from api.models.utils import ApiModel
from .courses import Course
from .users import User, ProfileUser
import json

import requests
import requests.packages
requests.packages.urllib3.disable_warnings


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

    # Data
    dataValidate = {
        "institucion": "3094",
        "rut": instance.user.dni,
        "contenido": instance.course.code_trip,
        "nombreContenido": instance.course.title,
        "codigoCertificacion": instance.code_travel,
        "correo": instance.user.email,
        "evaluacion": instance.calification
    }

    dataJson = json.dumps(dataValidate)
    

    # GET TOKEN
    urlToken = "https://apitest.corfo.cl:9101/api/oauth/token"
    payloadFormx='scope=resource.READ&client_id=5d652985-93b7-407c-9365-05d7d83e629d&client_secret=a6fa2019-0b05-4145-8d73-20478cd4f52b&grant_type=client_credentials'
    headersGetToken = {
    'Accept-Charset': 'utf-8',
    'Content-Type': 'application/x-www-form-urlencoded',    
    }

    response_token = requests.request("POST", urlToken, headers=headersGetToken, data=payloadFormx, verify=False)

    data = response_token.json()
    token = data['access_token']
    

    urlValidate = "https://apitest.corfo.cl:9101/OAG/API_WS_MOOC/Validate"
    headersValidate = {
        'Authorization': 'Bearer {}'.format(token),
        'Content-Type': 'application/json'
    }

    if(response_token.status_code==200):
        response = requests.request("POST", urlValidate, headers=headersValidate, data=dataJson, verify=False)
        print(response.text)
    
    


    




post_save.connect(validate_corfo, sender= ResultContest)

